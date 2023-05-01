import $api from '@/http';
import { AxiosResponse } from 'axios';

export default class TestService {
  static async getTests(): Promise<AxiosResponse<any[]>> {
    return $api.get<any[]>('/tests');
  }

  static async getList(): Promise<AxiosResponse<any[]>> {
    return $api.get<any[]>('/tests-list');
  }
}
