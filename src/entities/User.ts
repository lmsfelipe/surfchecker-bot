export interface IUser {
  name: string;
  phoneNumber: string;
  allowedRequests?: number;
  favoriteSpot?: string;
  forecasts?: string[];
}

export class User {
  data: IUser;

  constructor(data: IUser) {
    this.data = data;
  }
}
