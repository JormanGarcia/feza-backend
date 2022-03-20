import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export class UsersService {
  static async findAll() {
    return await prisma.user.findMany();
  }

  static async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        operationHistory: {
          include: {
            users: {
              select: {
                email: true,
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },

          orderBy: {
            creationDate: "desc",
          },
        },

        requests: {
          orderBy: {
            creationDate: "desc",
          },

          include: {
            users: {
              select: {
                firstName: true,
                email: true,
                lastName: true,
                id: true,
              },
            },
          },
        },
      },
    });

    return user;
  }

  static async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  static async matchEmail(email: string) {
    return await prisma.user.findMany({
      where: {
        OR: [
          {
            email: {
              startsWith: email,
            },
          },

          {
            firstName: {
              startsWith: email,
            },
          },
          {
            lastName: {
              startsWith: email,
            },
          },
        ],
      },
    });
  }

  static async isEmailAvailable(email: string) {
    return (await this.findByEmail(email)) === null;
  }

  static async create({ password, ...data }: Prisma.UserCreateInput) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        password: hashedPassword,
        ...data,
      },
    });

    return newUser;
  }

  static async delete(id: string) {
    return await prisma.user.delete({
      where: {
        id,
      },
    });
  }

  static async update(id: string, body: Prisma.UserUpdateInput) {
    return await prisma.user.update({
      where: {
        id,
      },
      data: body,
    });
  }

  static balance = {
    sum: (email: string, amount: number) => {
      return prisma.user.update({
        where: {
          email: email,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
    },
    substract: (email: string, amount: number) => {
      return prisma.user.update({
        where: {
          email: email,
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
    },
    transfer: async (fromUser: string, toUser: string, amount: number) => {
      await Promise.all([
        this.balance.sum(toUser, amount),
        this.balance.substract(fromUser, amount),
      ]);
    },
  };
}
