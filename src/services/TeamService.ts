import $api from '@/http';
import { AxiosResponse } from 'axios';
import { ITeam, ITeamShort, IDeleteTeam } from '@/models/ITeam';

export default class TeamService {
  static async getAll(): Promise<AxiosResponse<ITeam[]>> {
    return $api.get<ITeam[]>('/team/all');
  }

  static async getList(): Promise<AxiosResponse<ITeamShort[]>> {
    return $api.get<ITeamShort[]>('/team/list');
  }

  static async create(data: ITeam): Promise<AxiosResponse<ITeam>> {
    return $api.post<ITeam>('/team', data);
  }

  static async update(data: ITeam): Promise<AxiosResponse<ITeam>> {
    return $api.put<ITeam>('/team', data);
  }

  static async delete(data: IDeleteTeam): Promise<AxiosResponse> {
    return $api.delete('/team', { data });
  }
}
