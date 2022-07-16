import { Users } from '@prisma/client';
import { hash } from 'bcrypt';
import { Request } from 'express';
import { prisma } from '../../../database/prismaClient';
import AppError from '../../../shared/errors/AppError';
import { ICreateUsers } from '../dtos/IUsersDTO';

class UsersServices {

  public async store(req: Request): Promise<Users> {
    const { body } = req;
    const data: ICreateUsers = body;

    const userExist = await prisma.users.findFirst({
      where: {
        email: {
          equals: data.email,
          mode: 'insensitive'
        }
      }
    })
    if (userExist) {
      throw new AppError('User alredy exists');
    }

    const hashPassword = await hash(data.password, 10);
    const user = await prisma.users.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashPassword,
      }
    });

    return user;
  }
}

export { UsersServices };