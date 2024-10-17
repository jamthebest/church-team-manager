import { useState } from 'react';
import { Competition, Team } from '../types';

export const tabName = 'Equipos';

export interface ApiTeam {
    ID?: string;
    Nombre: string;
    Color: string;
}

export interface ApiResult {
    ID?: string;
    'Tipo de competencia':
        | '1 vs 1'
        | '2 vs 2'
        | 'Todos Vs Todos'
        | 'Arbitraria';
    Descripcion: string;
    Equipo1: string;
    Puntos1: number;
    Equipo2?: string;
    Puntos2?: number;
    Equipo3?: string;
    Puntos3?: number;
    Equipo4?: string;
    Puntos4?: number;
}

export interface ApiScore {
    Posicion: string;
    Equipo: string;
    Puntos: number;
}

export interface ApiResponse {
    result: 'Success' | 'Error';
    data: { ID: string } | null;
}

export interface ApiError {
    result: 'Error';
    error: string;
}

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const useData = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [results, setResults] = useState<Competition[]>([]);
    const [scores, setScores] = useState<ApiScore[]>([]);
    const [error, setError] = useState<string | null>(null);

    const loadData = () => {
        fetch(`${API_URL}?key=${API_KEY}`)
            .then((response) => response.json())
            .then(
                (data: {
                    Equipos: ApiTeam[];
                    Resultados: ApiResult[];
                    Posiciones: ApiScore[];
                }) => {
                    setTeams(
                        data.Equipos.map((team) => ({
                            id: team.ID ?? '',
                            name: team.Nombre,
                            color: team.Color,
                        }))
                    );
                    setResults(
                        data.Resultados.map((result) => {
                            const teams = [result.Equipo1];
                            const scores = [result.Puntos1];

                            if (result.Equipo2 && result.Puntos2) {
                                teams.push(result.Equipo2);
                                scores.push(result.Puntos2 ?? 0);
                            }
                            if (result.Equipo3 && result.Puntos3) {
                                teams.push(result.Equipo3);
                                scores.push(result.Puntos3 ?? 0);
                            }
                            if (result.Equipo4 && result.Puntos4) {
                                teams.push(result.Equipo4);
                                scores.push(result.Puntos4 ?? 0);
                            }
                            return {
                                id: result.ID ?? '',
                                type: result['Tipo de competencia'],
                                description: result.Descripcion,
                                teams,
                                scores,
                            };
                        })
                    );
                    setScores(data.Posiciones);
                }
            );
    };

    const addTeam = (newTeam: Team) => {
        const team: ApiTeam = {
            Nombre: newTeam.name,
            Color: newTeam.color,
        };
        fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...team,
                key: API_KEY,
                action: 'create',
                sheet: 'Equipos',
            }),
        })
            .then((response) => response.json())
            .then((response: ApiResponse) => {
                if (response.result === 'Success') {
                    setTeams([...teams, newTeam]);
                } else {
                    setError('Error al agregar el equipo');
                }
            });
    };

    const updateTeam = (editedTeam: Team) => {
        const team: ApiTeam = {
            ID: editedTeam.id,
            Nombre: editedTeam.name,
            Color: editedTeam.color,
        };
        fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...team,
                key: API_KEY,
                action: 'update',
                sheet: 'Equipos',
            }),
        })
            .then((response) => response.json())
            .then((response: ApiResponse) => {
                if (response.result === 'Success') {
                    setTeams(
                        teams.map((curTeam) =>
                            curTeam.id === editedTeam.id ? editedTeam : curTeam
                        )
                    );
                } else {
                    setError('Error al actualizar el equipo');
                }
            });
    };

    const deleteTeam = (id: string) => {
        fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ID: id,
                key: API_KEY,
                action: 'delete',
                sheet: 'Equipos',
            }),
        })
            .then((response) => response.json())
            .then((response: ApiResponse) => {
                if (response.result === 'Success') {
                    setTeams(teams.filter((team) => team.id !== id));
                } else {
                    setError('Error al eliminar el equipo');
                }
            });
    };

    const addResult = (newResult: Competition) => {
        const result: ApiResult = {
            'Tipo de competencia': newResult.type,
            Descripcion: newResult.description,
            Equipo1: newResult.teams[0],
            Puntos1: newResult.scores[0],
            Equipo2: newResult.teams[1],
            Puntos2: newResult.scores[1],
            Equipo3: newResult.teams[2],
            Puntos3: newResult.scores[2],
            Equipo4: newResult.teams[3],
            Puntos4: newResult.scores[3],
        };
        fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...result,
                key: API_KEY,
                action: 'create',
                sheet: 'Resultados',
            }),
        })
            .then((response) => response.json())
            .then((response: ApiResponse) => {
                if (response.result === 'Success') {
                    setResults([...results, newResult]);
                } else {
                    setError('Error al agregar el resultado');
                }
            });
    };

    const updateResult = (editedResult: Competition) => {
        const result: ApiResult = {
            ID: editedResult.id,
            'Tipo de competencia': editedResult.type,
            Descripcion: editedResult.description,
            Equipo1: editedResult.teams[0],
            Puntos1: editedResult.scores[0],
            Equipo2: editedResult.teams[1],
            Puntos2: editedResult.scores[1],
            Equipo3: editedResult.teams[2],
            Puntos3: editedResult.scores[2],
            Equipo4: editedResult.teams[3],
            Puntos4: editedResult.scores[3],
        };
        fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...result,
                key: API_KEY,
                action: 'update',
                sheet: 'Resultados',
            }),
        })
            .then((response) => response.json())
            .then((response: ApiResponse) => {
                if (response.result === 'Success') {
                    setResults(
                        results.map((currResult) =>
                            currResult.id === editedResult.id
                                ? editedResult
                                : currResult
                        )
                    );
                } else {
                    setError('Error al actualizar el resultado');
                }
            });
    };

    const deleteResult = (id: string) => {
        fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ID: id,
                key: API_KEY,
                action: 'delete',
                sheet: 'Resultados',
            }),
        })
            .then((response) => response.json())
            .then((response: ApiResponse) => {
                if (response.result === 'Success') {
                    setResults(results.filter((result) => result.id !== id));
                } else {
                    setError('Error al eliminar el resultado');
                }
            });
    };

    const updateScoreTable = (newScores: ApiScore[]) => {
        fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: API_KEY,
                action: 'update',
                sheet: 'Posiciones v2',
                data: newScores,
            }),
        })
            .then((response) => response.json())
            .then((response: ApiResponse) => {
                if (response.result === 'Success') {
                    setScores(newScores);
                } else {
                    setError('Error al actualizar la tabla de posiciones');
                }
            });
    };

    return {
        teams,
        results,
        scores,
        addTeam,
        updateTeam,
        deleteTeam,
        addResult,
        updateResult,
        deleteResult,
        updateScoreTable,
        loadData,
        error,
    };
};

export default useData;
