import $api from '@/http';
import { AxiosResponse } from 'axios';
import { IUser, IUpdateUser, IEditUser, IDeleteUser } from '@/models/IUser';

export default class UserService {
  static async sendActivationCode(): Promise<AxiosResponse> {
    return $api.post('/activation-code');
  }

  static async createUser(data: IUser): Promise<AxiosResponse<IUser>> {
    return $api.post<IUser>('/user', data);
  }

  static async updateUser(data: IUpdateUser): Promise<AxiosResponse<IUser>> {
    return $api.put<IUser>('/user-update', data);
  }

  static async fetchUsers(): Promise<AxiosResponse<IUser[]>> {
    return $api.get<IUser[]>('/users');
  }

  static async editUser(data: IEditUser): Promise<AxiosResponse<IUser>> {
    return $api.put<IUser>('/user', data);
  }

  static async deleteUser(data: IDeleteUser): Promise<AxiosResponse> {
    return $api.delete('/user', { data });
  }
}
