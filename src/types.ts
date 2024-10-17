export interface Team {
  id: string;
  name: string;
  color: string;
}

export interface Competition {
  id: string;
  type: '1 vs 1' | '2 vs 2' | 'Todos Vs Todos' | 'Arbitraria';
  teams: string[];
  scores: number[];
  description: string;
}

export interface State {
  teams: Team[];
  competitions: Competition[];
}