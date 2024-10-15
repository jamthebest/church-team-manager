export interface Team {
  id: string;
  name: string;
  color: string;
}

export interface Competition {
  id: string;
  type: '1vs1' | '2vs2' | 'todosVsTodos' | 'arbitraria';
  teams: string[];
  scores: number[];
  description: string;
}

export interface State {
  teams: Team[];
  competitions: Competition[];
}