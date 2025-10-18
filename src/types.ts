import { AvailableColors, AvailableCompetitionTypes } from './constants';

export interface Team {
    id: string;
    name: string;
    color: AvailableColors;
}

export interface Competition {
    id: string;
    type: AvailableCompetitionTypes;
    teams: Team[];
    scores: number[];
    description: string;
}

export interface State {
    teams: Team[];
    competitions: Competition[];
}
