export interface IAgentChecker {
  response: string;
  city: string;
  state: string;
  spot: string;
}

export class AgentChecker {
  data: IAgentChecker;

  constructor(data: IAgentChecker) {
    this.data = data;
  }
}
