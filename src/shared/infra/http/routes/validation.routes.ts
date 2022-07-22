import { Joi } from 'celebrate';

export const paginationRoute = {
  page: Joi.number(),
  limit: Joi.number(),
  order: Joi.string().valid('ASC', 'DESC'),
};
