declare namespace Express {
  export interface Request {
    user: {
      id: string;
      email: string;
    };
    session: {
      token: string;
      language: string;
    };
  }
}
