import { PrismaClient } from "@prisma/client";
import { IPrismaProvider } from "../models/IPrismaProvider";

class PrismaProvider implements IPrismaProvider {
  private prisma;
  constructor() {
    this.prisma = new PrismaClient();
  }

  repository() {
    return this.prisma;
  }

}

export { PrismaProvider };