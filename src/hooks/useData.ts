import { useState } from 'react';
import { Competition, Team } from '../types';

export const tabName = 'Equipos';

export interface ApiTeamRequest {
    id?: string;
    name: string;
    color: string;
}

export interface ApiTeamResponse {
    id: string;
    name: string;
    color: string;
    Point: ApiPointResponse[];
}

export interface ApiPointResponse {
    id: string;
    teamId: string;
    competitionId: string;
    points: number;
}

export interface ApiResultRequest {
    id?: string;
    type: '1 vs 1' | '2 vs 2' | 'Todos vs Todos' | 'Individual';
    description: string;
    teams: string[];
    points: number[];
}

export interface ApiResultResponse {
    id: string;
    type: '1 vs 1' | '2 vs 2' | 'Todos vs Todos' | 'Individual';
    description: string;
    date: Date;
    teams: ApiTeamResponse[];
    points: ApiPointResponse[];
}

export interface ApiScore {
    ID: string;
    Posicion: number;
    Equipo: string;
    Puntos: number;
}

export interface ApiError {
    result: 'Error';
    error: string;
}

// const API_URL = '/api';
const API_URL = import.meta.env.VITE_API_URL;
const TEAM_PATH = 'team';
const RESULT_PATH = 'competition';

const useData = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [results, setResults] = useState<Competition[]>([]);
    const [scores, setScores] = useState<ApiScore[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);

    const clearMessages = () => {
        setError(null);
        setMessage(null);
    };

    const loadData = () => {
        setLoading(true);
        // fetch teams
        fetch(`${API_URL}/${TEAM_PATH}`)
            .then((response) => response.json())
            .then((data: ApiTeamResponse[]) => {
                const newScores: ApiScore[] = data
                    .reduce((acc, team) => {
                        const totalPoints = team.Point.reduce(
                            (total, point) => total + point.points,
                            0
                        );
                        acc.push({
                            ID: team.id,
                            Posicion: 0,
                            Equipo: team.name,
                            Puntos: totalPoints,
                        });
                        return acc;
                    }, [] as ApiScore[])
                    .sort((a, b) => b.Puntos - a.Puntos)
                    .map((team, index) => ({
                        ...team,
                        Posicion: index + 1,
                    }));
                setTeams(
                    data.map((team) => ({
                        id: team.id ?? '',
                        name: team.name,
                        color: team.color,
                    }))
                );
                setScores(newScores);
                return fetch(`${API_URL}/${RESULT_PATH}`);
            })
            .then((response) => response.json())
            .then((data: ApiResultResponse[]) => {
                const newResults = data.map((result) => {
                    const teams: Team[] = result.teams.map((team) => {
                        return {
                            id: team.id,
                            name: team.name,
                            color: team.color,
                        };
                    });
                    const scores = result.points.map((point) => point.points);
                    return {
                        id: result.id ?? '',
                        type: result.type,
                        description: result.description,
                        teams,
                        scores,
                    };
                });
                setResults(newResults);
            })
            .finally(() => {
                console.log('Data loaded');
                setLoading(false);
            });
    };

    const addTeam = (newTeam: Team) => {
        if (teams.length >= 6) {
            setError('No se pueden agregar más de 6 equipos');
            return;
        }
        const team: ApiTeamRequest = {
            name: newTeam.name,
            color: newTeam.color,
        };

        setLoading(true);
        fetch(`${API_URL}/${TEAM_PATH}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(team),
        })
            .then((response) => response.json())
            .then((response: ApiTeamResponse) => {
                if (response.id) {
                    setTeams([...teams, { ...newTeam, id: response.id }]);
                    setMessage('Equipo agregado correctamente');
                } else {
                    setError('Error al agregar el equipo');
                }
            })
            .catch((e) => {
                console.error(e);
                setError('Error al agregar el equipo');
            })
            .finally(() => setLoading(false));
    };

    const updateTeam = (editedTeam: Team) => {
        const team: ApiTeamRequest = {
            id: editedTeam.id,
            name: editedTeam.name,
            color: editedTeam.color,
        };

        setLoading(true);
        fetch(`${API_URL}/${TEAM_PATH}/${editedTeam.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(team),
        })
            .then((response) => response.json())
            .then((response: ApiTeamResponse) => {
                if (response.id) {
                    setTeams(
                        teams.map((currTeam) =>
                            currTeam.id === editedTeam.id
                                ? editedTeam
                                : currTeam
                        )
                    );
                    setMessage('Equipo actualizado correctamente');
                } else {
                    setError('Error al actualizar el equipo');
                }
            })
            .catch((e) => {
                console.error(e);
                setError('Error al actualizar el equipo');
            })
            .finally(() => setLoading(false));
    };

    const deleteTeam = (id: string) => {
        setLoading(true);
        fetch(`${API_URL}/${TEAM_PATH}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((response: ApiTeamResponse) => {
                if (response.id) {
                    setTeams(teams.filter((team) => team.id !== id));
                    setMessage('Equipo eliminado correctamente');
                } else {
                    setError('Error al eliminar el equipo');
                }
            })
            .catch((e) => {
                console.error(e);
                setError('Error al eliminar el equipo');
            })
            .finally(() => setLoading(false));
    };

    const addResult = (newResult: Competition) => {
        const result: ApiResultRequest = {
            type: newResult.type,
            description: newResult.description,
            teams: newResult.teams.map((team) => team.name),
            points: newResult.scores,
        };

        setLoading(true);
        fetch(`${API_URL}/${RESULT_PATH}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(result),
        })
            .then((response) => response.json())
            .then((response: ApiResultResponse) => {
                if (response.id) {
                    setResults([...results, { ...newResult, id: response.id }]);
                    setMessage('Resultado agregado correctamente');
                } else {
                    setError('Error al agregar el resultado');
                }
            })
            .catch((e) => {
                console.error(e);
                setError('Error al agregar el resultado');
            })
            .finally(() => setLoading(false));
    };

    const updateResult = async (
        editedResult: Competition,
        comeFromTeam = false
    ) => {
        const result: ApiResultRequest = {
            id: editedResult.id,
            type: editedResult.type,
            description: editedResult.description,
            teams: editedResult.teams.map((team) => team.name),
            points: editedResult.scores,
        };

        setLoading(true);
        return fetch(`${API_URL}/${RESULT_PATH}/${editedResult.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(result),
        })
            .then((response) => response.json())
            .then((response: ApiResultResponse) => {
                if (response.id) {
                    setResults(
                        results.map((currResult) =>
                            currResult.id === editedResult.id
                                ? editedResult
                                : currResult
                        )
                    );
                    setMessage('Resultado actualizado correctamente');
                } else {
                    setError('Error al actualizar el resultado');
                }
            })
            .catch((e) => {
                console.error(e);
                setError('Error al actualizar el resultado');
            })
            .finally(() => setLoading(comeFromTeam));
    };

    const deleteResult = (id: string) => {
        setLoading(true);
        fetch(`${API_URL}/${RESULT_PATH}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((response: ApiResultResponse) => {
                if (response.id) {
                    setResults(results.filter((result) => result.id !== id));
                    setMessage('Resultado eliminado correctamente');
                } else {
                    setError('Error al eliminar el resultado');
                }
            })
            .catch((e) => {
                console.error(e);
                setError('Error al eliminar el resultado');
            })
            .finally(() => setLoading(false));
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
        loadData,
        clearMessages,
        error,
        message,
        loading,
    };
};

export default useData;
