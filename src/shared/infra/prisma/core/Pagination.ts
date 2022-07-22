import { env } from "@shared/env";

export interface IPaginateOptions {
  limit: number;
  page: number;
  order?: 'asc' | 'desc';
}
export interface IPaginatedResult {
  data: any[]
  meta: {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
    prev: number | null
    next: number | null
  }
}

export type PaginateFunction = <K>(model: any, args?: K) => Promise<IPaginatedResult>

export const createPaginator = (defaultOptions: IPaginateOptions): PaginateFunction => {
  return async (model, args: any = { where: undefined }) => {
    const page = Number(defaultOptions?.page) || 1
    const perPage = Number(defaultOptions?.limit || env?.PAGE_SIZE) || 10

    const skip = page > 0 ? perPage * (page - 1) : 0
    const [total, data] = await Promise.all([
      model.count({ where: args?.where }),
      model.findMany({
        ...args,
        take: perPage,
        skip,
      }),
    ])
    const lastPage = Math.ceil(total / perPage)

    return {
      data,
      meta: {
        total,
        lastPage,
        currentPage: page,
        perPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
    }
  }
}

// const paginate = createPaginator({ perPage: 20 })
// const result = await paginate<Prisma.UserFindManyArgs>(
//   prisma.user,
//   {
//     where: {
//       name: {
//         contains: 'Alice'
//       }
//     }
//     orderBy: {
//       id: 'desc',
//     }
//   },
//   { page: query.page }
// })