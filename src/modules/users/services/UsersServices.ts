import { Request } from 'express';
import { inject, injectable } from 'tsyringe';
import { Users } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import { ICreateUsers } from '../dtos/IUsersDTO';
import { IHashProvider } from '@shared/container/providers/HashProvider/models/IHashProvider';
import { IPrismaProvider } from '@shared/container/providers/Prisma/models/IPrismaProvider';
import { i18n } from '@shared/internationalization';
import { IServicesBase } from '@shared/infra/http/services/IServicesBase';
import { emailIsValid } from '@shared/utils/validations';

@injectable()
class UsersServices implements IServicesBase {

  constructor(
    @inject('PrismaProvider')
    private _prisma: IPrismaProvider,

    @inject('HashProvider')
    private _hashProvider: IHashProvider
  ) { }


  async datasValidate(data: ICreateUsers): Promise<ICreateUsers> {
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
    let data: ICreateUsers = body;
    data = await this.datasValidate(data);
    const userExist = await this._prisma.repository().users.findFirst({
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
    const user = await this._prisma.repository().users.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

    return user;
  }

  update(data: Request): Promise<any> {
    throw new Error('Method not implemented.');
  }

  delete(data: Request): Promise<any> {
    throw new Error('Method not implemented.');
  }

  show(data: Request): Promise<any> {
    throw new Error('Method not implemented.');
  }

  inactivateActivate(data: Request): Promise<any> {
    throw new Error('Method not implemented.');
  }
}

export { UsersServices };
