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
        | 'Todos vs Todos'
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
    Equipo5?: string;
    Puntos5?: number;
    Equipo6?: string;
    Puntos6?: number;
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

const API_URL = '/api';
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
                            if (result.Equipo5 && result.Puntos5) {
                                teams.push(result.Equipo5);
                                scores.push(result.Puntos5 ?? 0);
                            }
                            if (result.Equipo6 && result.Puntos6) {
                                teams.push(result.Equipo6);
                                scores.push(result.Puntos6 ?? 0);
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

    const catchError = (response: Error, callback: () => void) => {
        if (response.message === 'Failed to fetch') {
            callback();
        } else {
            setError(response.message);
        }
    };

    const addTeam = (newTeam: Team) => {
        if (teams.length >= 6) {
            setError('No se pueden agregar más de 6 equipos');
            return;
        }
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
            })
            .catch((e) => {
                catchError(e, () => setTeams([...teams, newTeam]));
            });
    };

    const manageUpdateSuccess = async (editedTeam: Team) => {
        const currentTeam = teams.find(
            (team) => team.id === editedTeam.id && team.name !== editedTeam.name
        );
        await new Promise<void>(() => {
            if (!currentTeam) return;
            return Promise.all(
                results
                    .filter((result) => result.teams.includes(currentTeam.name))
                    .map((currentResult) => {
                        const newTeams = currentResult.teams.map((team) =>
                            team === currentTeam.name ? editedTeam.name : team
                        );
                        return updateResult({
                            ...currentResult,
                            teams: newTeams,
                        });
                    })
            );
        }).then(() => {
            setTeams(
                teams.map((curTeam) =>
                    curTeam.id === editedTeam.id ? editedTeam : curTeam
                )
            );
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
                id: editedTeam.id,
                key: API_KEY,
                action: 'update',
                sheet: 'Equipos',
            }),
        })
            .then((response) => response.json())
            .then((response: ApiResponse) => {
                if (response.result === 'Success') {
                    manageUpdateSuccess(editedTeam);
                } else {
                    setError('Error al actualizar el equipo');
                }
            })
            .catch((e) => {
                catchError(e, () => manageUpdateSuccess(editedTeam));
            });
    };

    const deleteTeam = (id: string) => {
        fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
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
            })
            .catch((e) => {
                catchError(e, () =>
                    setTeams(teams.filter((team) => team.id !== id))
                );
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
            Equipo5: newResult.teams[4],
            Puntos5: newResult.scores[4],
            Equipo6: newResult.teams[5],
            Puntos6: newResult.scores[5],
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
            })
            .catch((e) => {
                catchError(e, () => setResults([...results, newResult]));
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
            Equipo5: editedResult.teams[4],
            Puntos5: editedResult.scores[4],
            Equipo6: editedResult.teams[5],
            Puntos6: editedResult.scores[5],
        };
        fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...result,
                id: editedResult.id,
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
            })
            .catch((e) => {
                catchError(e, () =>
                    setResults(
                        results.map((currResult) =>
                            currResult.id === editedResult.id
                                ? editedResult
                                : currResult
                        )
                    )
                );
            });
    };

    const deleteResult = (id: string) => {
        fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
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
            })
            .catch((e) => {
                catchError(e, () =>
                    setResults(results.filter((result) => result.id !== id))
                );
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
            })
            .catch((e) => {
                catchError(e, () => setScores(newScores));
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
