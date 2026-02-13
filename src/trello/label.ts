import { api, authParams } from "@/api";
import { envVars } from "@/constants/env-vars";

export class Label {
  public async getAll(): Promise<GetAllResponse> {
    const response = await api.get(`boards/${envVars.BOARD_ID}/labels`, {
      params: {
        ...authParams,
      },
    });

    return response.data;
  }
}

interface ILabel {
  id: string;
  name: string;
}

interface GetAllResponse extends Array<ILabel> {}
