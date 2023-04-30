import $api from '@/http';
import { AxiosResponse } from 'axios';
import { ITeam, ITeamShort, IDeleteTeam } from '@/models/ITeam';

export default class TeamService {
  static async fetchTeams(): Promise<AxiosResponse<ITeam[]>> {
    return $api.get<ITeam[]>('/teams');
  }

  static async fetchTeamsList(): Promise<AxiosResponse<ITeamShort[]>> {
    return $api.get<ITeamShort[]>('/teams-list');
  }

  static async createTeam(data: ITeam): Promise<AxiosResponse<ITeam>> {
    return $api.post<ITeam>('/team', data);
  }

  static async updateTeam(data: ITeam): Promise<AxiosResponse<ITeam>> {
    return $api.put<ITeam>('/team', data);
  }

  static async deleteTeam(data: IDeleteTeam): Promise<AxiosResponse> {
    return $api.delete('/team', { data });
  }
}
