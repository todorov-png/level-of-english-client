export interface IUser {
  id?: string;
  username: string;
  email: string;
  isActivated: boolean;
  permissions?: object;
}

export interface IEditUser {
  username: string;
  email: string;
  password: string;
  newPassword: string;
}

export interface IUpdateUser {
  user: string | null;
  role: string | null;
  team: string | null;
}

export interface IDeleteUser {
  user: string;
}
