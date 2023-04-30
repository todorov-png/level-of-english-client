import $api from '@/http';
import { AxiosResponse } from 'axios';
import { IRole, IRoleShort, IDeleteRole, IDeleteRoles } from '@/models/IRole';

export default class RoleService {
  static async fetchRoles(): Promise<AxiosResponse<IRole[]>> {
    return $api.get<IRole[]>('/roles');
  }

  static async fetchRolesList(): Promise<AxiosResponse<IRoleShort[]>> {
    return $api.get<IRoleShort[]>('/roles-list');
  }

  static async createRole(data: IRole): Promise<AxiosResponse<IRole>> {
    return $api.post<IRole>('/role', data);
  }

  static async updateRole(data: IRole): Promise<AxiosResponse<IRole>> {
    return $api.put<IRole>('/role', data);
  }

  static async deleteRoles(data: IDeleteRoles): Promise<AxiosResponse> {
    return $api.delete('/roles', { data });
  }

  static async deleteRole(data: IDeleteRole): Promise<AxiosResponse> {
    return $api.delete('/role', { data });
  }
}
