export interface IForecast {
  response: string;
  city: string;
  state: string;
  spot: string;
}

export class Forecast {
  data: IForecast;

  constructor(data: IForecast) {
    this.data = data;
  }
}
