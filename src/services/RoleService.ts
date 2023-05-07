import $api from '@/http';
import { AxiosResponse } from 'axios';
import { IRole, IRoleShort, IDeleteRole, IDeleteRoles } from '@/models/IRole';

export default class RoleService {
  static async getAll(): Promise<AxiosResponse<IRole[]>> {
    return $api.get<IRole[]>('/role/all');
  }

  static async getList(): Promise<AxiosResponse<IRoleShort[]>> {
    return $api.get<IRoleShort[]>('/role/list');
  }

  static async create(data: IRole): Promise<AxiosResponse<IRole>> {
    return $api.post<IRole>('/role', data);
  }

  static async update(data: IRole): Promise<AxiosResponse<IRole>> {
    return $api.put<IRole>('/role', data);
  }

  static async deleteList(data: IDeleteRoles): Promise<AxiosResponse> {
    return $api.delete('/role/list', { data });
  }

  static async delete(data: IDeleteRole): Promise<AxiosResponse> {
    return $api.delete('/role', { data });
  }
}
