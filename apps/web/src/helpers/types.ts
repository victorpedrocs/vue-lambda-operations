export type ValueOf<T> = T[keyof T];

export type Record = {
  id: number;
  userBalance: number;
  amount: number;
  userId: number;
  type: string;
  dateTime: string;
  operationResponse: string;
};

export type OperationType = 'add' | 'sub' | 'multi' | 'div' | 'sqrt' | 'str';

export type RandomStringParams = {
  length: number;
};

export type ArithmeticParams = {
  a: number;
  b: number;
};

export type ArithmeticOpBody = {
  type: OperationType;
  params: RandomStringParams | ArithmeticParams;
};

export type QueryRecordsParams = {
  text?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'amount' | 'userBalance' | 'dateTime' | 'type';
  sortingOrder?: 'asc' | 'desc';
};
