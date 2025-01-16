import { AvailableColors } from './constants';

export interface Team {
    id: string;
    name: string;
    color: AvailableColors;
}

export interface Competition {
    id: string;
    type: '1 vs 1' | '2 vs 2' | 'Todos vs Todos' | 'Individual';
    teams: Team[];
    scores: number[];
    description: string;
}

export interface State {
    teams: Team[];
    competitions: Competition[];
}
