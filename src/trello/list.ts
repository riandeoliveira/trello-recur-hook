import { api, authParams } from "@/api";
import { envVars } from "@/constants/env-vars";

export class List {
  public async getAll(): Promise<GetAllResponse> {
    const response = await api.get(`/boards/${envVars.BOARD_ID}/lists`, {
      params: {
        ...authParams,
      },
    });

    return response.data;
  }
}

interface IList {
  id: string;
  name: string;
}

interface GetAllResponse extends Array<IList> {}
