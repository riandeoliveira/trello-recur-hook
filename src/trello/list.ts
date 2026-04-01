import { api, authParams } from "@/api";
import { envVars } from "@/constants/env-vars";
import type { ICard } from "./card";

export class List {
  public async getAll(): Promise<GetAllResponse> {
    const response = await api.get(`/boards/${envVars.BOARD_ID}/lists`, {
      params: {
        ...authParams,
      },
    });

    return response.data;
  }

  public async getCards(listId: string): Promise<ICard[]> {
    const response = await api.get(`/lists/${listId}/cards`, {
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
