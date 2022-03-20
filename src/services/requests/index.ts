import { PrismaClient } from "@prisma/client";
import { fdatasync } from "fs";
import { OperationsService } from "../operations";
const prisma = new PrismaClient();

export class RequestsService {
  static findAll() {
    return prisma.request.findMany({
      include: {
        users: true,
      },
    });
  }

  static findById(id: string) {
    return prisma.request.findUnique({
      include: {
        users: true,
      },
      where: {
        id,
      },
    });
  }

  static async create(data: {
    fromUser: string;
    toUser: string;
    amount: number;
  }) {
    const newRequest = await prisma.request.create({
      data: {
        issuer: data.fromUser,
        amount: data.amount,
        status: "PENDING",
        users: {
          connect: [
            {
              email: data.fromUser,
            },
            {
              email: data.toUser,
            },
          ],
        },
      },

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

    return {
      ok: true,
      data: newRequest,
    };
  }

  static async handle(action: "pay" | "reject", id: string) {
    const request = await prisma.request.delete({
      where: {
        id,
      },
      include: {
        users: true,
      },
    });

    if (action === "pay") {
      OperationsService.transfer({
        fromUser: request.users[0].email,
        toUser: request.users[1].email,
        amount: request.amount,
      });
    }

    return {
      ok: true,
      data: request,
    };
  }
}
