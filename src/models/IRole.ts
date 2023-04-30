import { IPermissions } from '@/models/IPermissions';

export interface IRole {
  _id?: string;
  name: string;
  permissions: IPermissions;
}

export interface IRoleShort {
  _id: string;
  name: string;
}

export interface IDeleteRole {
  role: string;
}

export interface IDeleteRoles {
  roles: [string];
}
