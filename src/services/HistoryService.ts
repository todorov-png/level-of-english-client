import $api from '@/http';
import { AxiosResponse } from 'axios';

export default class HistoryService {
  static async getAll(): Promise<AxiosResponse<any[]>> {
    return $api.get<any[]>('/history/all');
  }

  static async create(data: any): Promise<AxiosResponse<any>> {
    return $api.post<any>('/history', data);
  }
}