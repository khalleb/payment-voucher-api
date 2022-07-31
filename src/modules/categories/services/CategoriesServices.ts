import { Request } from 'express';

import { Categories, Prisma } from '@prisma/client';
import { injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import { HttpResponseMessage, messageResponse } from '@shared/infra/http/core/HttpResponse';
import { IServicesBase } from '@shared/infra/http/services/IServicesBase';
import { createPaginator, IPaginatedResult, IPaginateOptions } from '@shared/infra/prisma/core/Pagination';
import { prisma } from '@shared/infra/prisma/prismaClient';
import { i18n } from '@shared/internationalization';

import { ICategoriesDTO } from '../dtos/ICategoriesDTO';

@injectable()
class CategoriesServices implements IServicesBase {
  async datasValidate(data: ICategoriesDTO): Promise<ICategoriesDTO> {
    if (!data) {
      throw new AppError(i18n('category.enter_the_data'));
    }
    if (!data.name) {
      throw new AppError(i18n('category.enter_the_name_data'));
    }

    data.name = data.name.trim();

    if (data.name.length <= 3) {
      throw new AppError(i18n('category.enter_full_name', { count: '3' }));
    }
    if (data.name.length >= 70) {
      throw new AppError(i18n('category.category_name_too_long', { count: '70' }));
    }
    return data;
  }

  public async store(req: Request): Promise<Categories> {
    const { body } = req;
    let data: ICategoriesDTO = body;
    data = await this.datasValidate(data);

    const exists = await prisma.categories.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive',
        },
      },
    });

    if (exists) {
      throw new AppError(i18n('category.name_alredy_exists'));
    }

    const category = await prisma.categories.create({
      data: {
        name: data.name,
      },
    });

    return category;
  }

  async update(req: Request): Promise<Categories> {
    const { body } = req;
    let data: ICategoriesDTO = body;
    data = await this.datasValidate(data);

    if (!data?.id) {
      throw new AppError(i18n('category.enter_your_ID'));
    }

    const category = await prisma.categories.findFirst({
      where: { id: data.id },
    });
    if (!category) {
      throw new AppError(i18n('category.not_found_in_the_database'));
    }

    const checkEmail = await prisma.categories.findFirst({
      where: { name: data.name },
    });
    if (checkEmail && checkEmail.id !== data.id) {
      throw new AppError(i18n('category.there_already_name_registered_database'));
    }
    const result = await prisma.categories.update({
      where: { id: data.id },
      data: {
        name: data.name,
      },
    });
    return result;
  }

  delete(_: Request): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async show(req: Request): Promise<Categories | null> {
    const { query } = req;
    const id = query?.id as string;

    if (!id) {
      throw new AppError(i18n('category.enter_your_ID'));
    }
    const category = await prisma.categories.findFirst({ where: { id } });
    return category;
  }

  async inactivateActivate(req: Request): Promise<HttpResponseMessage> {
    const { query } = req;
    const id = query.id as string;
    if (!id) {
      throw new AppError(i18n('category.enter_your_ID'));
    }
    const category = await prisma.categories.findFirst({ where: { id } });
    if (!category) {
      throw new AppError(i18n('category.not_found_in_the_database'));
    }

    await prisma.categories.update({
      where: { id },
      data: {
        active: !category.active,
      },
    });

    return messageResponse(
      `${i18n('category.category')} ${category.active ? i18n('labels.inactivated') : i18n('labels.activated')}`,
    );
  }

  async index(datas: IPaginateOptions): Promise<IPaginatedResult> {
    const paginate = createPaginator(datas);
    const result = await paginate<Prisma.UsersFindManyArgs>(prisma.categories, {});
    return result;
  }
}

export { CategoriesServices };
