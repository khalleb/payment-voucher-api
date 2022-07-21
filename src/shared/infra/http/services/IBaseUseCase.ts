interface IBaseUseCase {
  execute(data?: unknown): Promise<any>;
}

export { IBaseUseCase };
