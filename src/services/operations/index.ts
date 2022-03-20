import { Prisma, PrismaClient } from "@prisma/client";
import { UsersService } from "../users";

const prisma = new PrismaClient();

export class OperationsService {
  static async findAll() {
    return await prisma.operation.findMany();
  }

  static async findById(id: string) {
    const operation = await prisma.operation.findUnique({
      where: {
        id,
      },
    });

    return operation;
  }

  static async create(data: Prisma.OperationCreateInput) {
    const newUser = await prisma.operation.create({
      data,
      include: {
        users: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            id: true,
          },
        },
      },
    });

    return newUser;
  }

  static async delete(id: string) {
    return await prisma.operation.delete({
      where: {
        id,
      },
    });
  }

  static async update(id: string, body: Prisma.OperationUpdateInput) {
    return await prisma.operation.update({
      where: {
        id,
      },
      data: body,
    });
  }

  static async transfer({ amount, fromUser, toUser }: ITransferDTO) {
    const newOperation: Prisma.OperationCreateInput = {
      issuer: fromUser,
      status: "COMPLETED",
      type: "TRANSFER",
      amount: amount,
      users: {
        connect: [
          {
            email: fromUser,
          },
          {
            email: toUser,
          },
        ],
      },
    };

    const [operation] = await Promise.all([
      this.create(newOperation),
      await UsersService.balance.transfer(fromUser, toUser, amount),
    ]);

    return operation;
  }

  static async exchange({ amount, from, to, user }: IExchangeDTO) {
    return this.create({
      amount,
      status: "PENDING",
      type: "EXCHANGE",
      users: {
        connect: {
          email: user,
        },
      },
      from,
      to,
    });
  }

  static async handleExchange({ action, id, exchanger }: IHandleEXchangeDTO) {
    if (action === "accept") {
      return this.update(id, {
        status: "ACCEPTED",
        users: {
          connect: {
            email: exchanger,
          },
        },
      });
    }

    if (action === "reject") {
      return this.update(id, {
        status: "REJECTED",
        users: {
          connect: {
            email: exchanger,
          },
        },
      });
    }

    if (action === "wait") {
      return this.update(id, {
        status: "WAITING",
      });
    }

    if (action === "confirm") {
      const operation = await prisma.operation.update({
        where: {
          id,
        },
        data: {
          status: "COMPLETED",
        },
        include: {
          users: true,
        },
      });

      if (operation.users[0].role === "ADMIN") {
        await UsersService.balance.transfer(
          operation.users[1].email,
          operation.users[0].email,
          operation.amount
        );
      }

      if (operation.users[0].role === "USER") {
        await UsersService.balance.substract(
          operation.users[0].email,
          operation.amount
        );
      }

      return operation;
    }
  }
}

interface ITransferDTO {
  amount: number;
  fromUser: string;
  toUser: string;
}

interface IHandleEXchangeDTO {
  action: string;
  id: string;
  exchanger?: string;
}

interface IExchangeDTO {
  amount: number;
  user: string;
  from: string;
  to: string;
}
