import $api from '@/http';
import { AxiosResponse } from 'axios';

export default class TestService {
  static async getTests(): Promise<AxiosResponse<any[]>> {
    return $api.get<any[]>('/test/all');
  }

  static async getList(): Promise<AxiosResponse<any[]>> {
    return $api.get<any[]>('/test/list');
  }
}
