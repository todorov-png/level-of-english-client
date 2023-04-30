export interface IUser {
  id?: string;
  username: string;
  email: string;
  isActivated: boolean;
  permissions?: object;
}

export interface IUpdateUser {
  username: string;
  email: string;
  password: string;
  newPassword: string;
}

export interface IEditUser {
  user: string | null;
  role: string | null;
  team: string | null;
}

export interface IDeleteUser {
  user: string;
}
