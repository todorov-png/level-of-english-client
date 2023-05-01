export interface ITeam {
  _id?: string;
  name: string;
  tests: [string];
  linkTg?: string;
}

export interface ITeamShort {
  _id: string;
  name: string;
}

export interface IDeleteTeam {
  team: string;
}

