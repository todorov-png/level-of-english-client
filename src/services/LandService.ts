import $api from '@/http';
import { AxiosResponse } from 'axios';
// import { IUser, IUpdateUser, IEditUser, IDeleteUser } from '@/models/IUser';

export default class LandService {
  static async getLands(): Promise<AxiosResponse<any[]>> {
    return $api.get<any[]>('/lands');
  }
}
