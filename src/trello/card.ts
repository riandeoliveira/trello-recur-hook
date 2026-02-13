import { api, authParams } from "@/api";

export class Card {
  public async get(id: string): Promise<GetResponse> {
    const response = await api.get(`/cards/${id}`, {
      params: {
        ...authParams,
      },
    });

    return response.data;
  }

  public async update(id: string, params: UpdateParams): Promise<void> {
    await api.put(`/cards/${id}`, null, {
      params: {
        ...params,
        ...authParams,
      },
    });
  }
}

interface ICard {
  id: string;
  idList: string;
  idLabels: string[];
  desc: string;
  due: string;
  dueComplete: boolean;
  pos: string;
}

interface GetResponse extends ICard {}

interface UpdateParams extends Omit<Partial<ICard>, "id"> {}
