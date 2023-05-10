import $api from '@/http';
import { AxiosResponse } from 'axios';

export default class TestService {
  static async getAll(): Promise<AxiosResponse<any[]>> {
    return $api.get<any[]>('/test/all');
  }

  static async getList(): Promise<AxiosResponse<any[]>> {
    return $api.get<any[]>('/test/list');
  }

  static async get(id: string): Promise<AxiosResponse<any>> {
    return $api.get<any>(`/test/${id}`);
  }
}
