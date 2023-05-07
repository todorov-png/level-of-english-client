import $api from '@/http';
import { AxiosResponse } from 'axios';
import { IUser, IUpdateUser, IEditUser, IDeleteUser } from '@/models/IUser';

export default class UserService {
  static async create(data: IUser): Promise<AxiosResponse<IUser>> {
    return $api.post<IUser>('/user', data);
  }

  static async edit(data: IEditUser): Promise<AxiosResponse<IUser>> {
    return $api.put<IUser>('/user/edit', data);
  }

  static async getAll(): Promise<AxiosResponse<IUser[]>> {
    return $api.get<IUser[]>('/user/all');
  }
  
  static async update(data: IUpdateUser): Promise<AxiosResponse<IUser>> {
    return $api.put<IUser>('/user', data);
  }

  static async delete(data: IDeleteUser): Promise<AxiosResponse> {
    return $api.delete('/user', { data });
  }
}
