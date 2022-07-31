import { Request } from 'express';

import { Prisma, Users } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import { IHashProvider } from '@shared/container/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';
import { HttpResponseMessage, messageResponse } from '@shared/infra/http/core/HttpResponse';
import { IServicesBase } from '@shared/infra/http/services/IServicesBase';
import { IPaginatedResult, IPaginateOptions, createPaginator } from '@shared/infra/prisma/core/Pagination';
import { prisma } from '@shared/infra/prisma/prismaClient';
import { i18n } from '@shared/internationalization';
import { removeProperty } from '@shared/utils/objectUtil';
import { emailIsValid } from '@shared/utils/validations';

import { IUsersDTO } from '../dtos/IUsersDTO';

@injectable()
class UsersServices implements IServicesBase {
  constructor(
    @inject('HashProvider')
    private _hashProvider: IHashProvider,
  ) {}

  async datasValidate(data: IUsersDTO): Promise<IUsersDTO> {
    if (!data) {
      throw new AppError(i18n('user.enter_the_data'));
    }
    if (!data.name) {
      throw new AppError(i18n('user.enter_the_name_data'));
    }
    if (!data.email) {
      throw new AppError(i18n('user.enter_the_email_data'));
    }
    data.name = data.name.trim();
    data.email = data.email.trim().toLowerCase();

    if (data.name.length <= 3) {
      throw new AppError(i18n('user.enter_full_name', { count: '3' }));
    }
    if (data.name.length >= 70) {
      throw new AppError(i18n('user.user_name_too_long', { count: '70' }));
    }
    if (data.email.length <= 7) {
      throw new AppError(i18n('validations.invalid_email'));
    }
    if (data.email.length >= 50) {
      throw new AppError(i18n('validations.email_too_long', { max: '50' }));
    }
    if (!emailIsValid(data.email)) {
      throw new AppError(i18n('validations.invalid_email'));
    }
    return data;
  }

  public async store(req: Request): Promise<Users> {
    const { body } = req;
    let data: IUsersDTO = body;
    data = await this.datasValidate(data);
    const userExist = await prisma.users.findFirst({
      where: {
        email: {
          equals: data.email,
          mode: 'insensitive',
        },
      },
    });
    if (userExist) {
      throw new AppError(i18n('user.email_alredy_exists'));
    }

    if (!data.password) {
      throw new AppError(i18n('user.enter_the_password'));
    }
    if (!data.password_confirmation) {
      throw new AppError(i18n('user.enter_the_password_confirmation'));
    }

    data.password = data.password.trim();
    data.password_confirmation = data.password_confirmation.trim();

    if (data.password !== data.password_confirmation) {
      throw new AppError(i18n('user.passwords_do_not_match'));
    }

    data.password = await this._hashProvider.generateHash(data.password);
    const user = await prisma.users.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

    return user;
  }

  async update(req: Request): Promise<Users> {
    const { body } = req;
    let data: IUsersDTO = body;
    data = await this.datasValidate(data);

    if (!data?.id) {
      throw new AppError(i18n('user.enter_your_ID'));
    }

    const user = await prisma.users.findFirst({ where: { id: data.id } });
    if (!user) {
      throw new AppError(i18n('user.not_found_in_the_database'));
    }

    const checkEmail = await prisma.users.findFirst({
      where: { email: data.email },
    });
    if (checkEmail && checkEmail.id !== data.id) {
      throw new AppError(i18n('user.there_already_email_registered_database'));
    }
    const result = await prisma.users.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
      },
    });
    return result;
  }

  delete(_: Request): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async show(req: Request): Promise<Users | null> {
    const { query } = req;
    const id = query?.id as string;

    if (!id) {
      throw new AppError(i18n('user.enter_your_ID'));
    }
    const user = await prisma.users.findFirst({ where: { id } });
    return removeProperty(user, ['password']);
  }

  async inactivateActivate(req: Request): Promise<HttpResponseMessage> {
    const { query } = req;
    const id = query.id as string;
    if (!id) {
      throw new AppError(i18n('user.enter_your_ID'));
    }
    const user = await prisma.users.findFirst({ where: { id } });
    if (!user) {
      throw new AppError(i18n('user.not_found_in_the_database'));
    }

    await prisma.users.update({
      where: { id },
      data: {
        active: !user.active,
      },
    });

    return messageResponse(
      `${i18n('user.user')} ${user.active ? i18n('labels.inactivated') : i18n('labels.activated')}`,
    );
  }

  async index(datas: IPaginateOptions): Promise<IPaginatedResult> {
    const paginate = createPaginator(datas);
    const result = await paginate<Prisma.UsersFindManyArgs>(prisma.users, {});
    return result;
  }
}

export { UsersServices };
