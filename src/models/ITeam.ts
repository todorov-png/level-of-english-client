export interface ITeam {
  _id?: string;
  name: string;
  bearer: string;
  linkTg?: string;
}

export interface ITeamShort {
  _id: string;
  name: string;
}

export interface IDeleteTeam {
  team: string;
}

