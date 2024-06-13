export type Pagination = {
  page: number;
  perPage: number;
  lastPage: number;
  count: number;
};

export type ResJSON<T = null> = {
  status: number;
  data: T;
  message: string;
  meta?: Pagination;
};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      PORT: string;
      NODE_ENV: string;
      DATABASE: string;
    }
  }
}
