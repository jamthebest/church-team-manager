import React, { useState, useEffect, useCallback } from 'react';
import { Competition, Team } from '../types';
import { InputNumber, InputGroup } from 'rsuite';
import Loader from './Loader';

interface CompetitionTabProps {
    teams: Team[];
    loading: boolean;
    onAddCompetition: (newCompetition: Competition) => void;
}

const CompetitionsTab: React.FC<CompetitionTabProps> = ({
    teams,
    loading,
    onAddCompetition: onAddCompetition,
}) => {
    const [type, setType] = useState<Competition['type']>('1 vs 1');
    const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
    const [scores, setScores] = useState<number[]>([]);
    const [description, setDescription] = useState('');

    const resetFrom = useCallback(() => {
        if (type === 'Todos vs Todos') {
            setSelectedTeams(teams.map((team) => team.id));
        } else {
            setSelectedTeams([]);
        }
        if (type === 'Todos vs Todos') {
            setScores(teams.map(() => 0));
        } else if (type === '2 vs 2' || type === '1 vs 1') {
            setScores([0, 0]);
        } else {
            setScores([0]);
        }
    }, [type, teams]);

    useEffect(() => {
        resetFrom();
    }, [resetFrom]);

    useEffect(() => {
        if (!loading) {
            resetFrom();
            setDescription('');
        }
    }, [loading, resetFrom]);

    const updateScore = (index: number, value: number) => {
        const updatedScores = [...scores];
        updatedScores[index] = Number(value) || 0;
        setScores(updatedScores);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let finalPoints = [...scores];

        if (type === '2 vs 2' && selectedTeams.length === 4) {
            finalPoints = [scores[0], scores[0], scores[1], scores[1]];
        }

        const newCompetition: Competition = {
            id: Date.now().toString(),
            type: type,
            teams: teams.filter((team) => selectedTeams.includes(team.id)),
            scores: finalPoints,
            description: description.trim(),
        };
        onAddCompetition(newCompetition);
    };

    const getTeamById = (id: string) =>
        teams.find((team) => team.id === id || team.name === id);

    const availableTeams = useCallback(
        (teamId: string) => {
            return teams.filter(
                (team) =>
                    (!selectedTeams.includes(team.id) &&
                        !selectedTeams.includes(team.name)) ||
                    team.id === teamId ||
                    team.name === teamId
            );
        },
        [teams, selectedTeams]
    );

    const renderCompetitionForm = () => {
        switch (type) {
            case '1 vs 1':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[0, 1].map((index) => (
                                <div key={index}>
                                    <label className="block mb-1">
                                        Equipo {index + 1}:
                                    </label>
                                    <select
                                        value={
                                            getTeamById(selectedTeams[index])
                                                ?.id || ''
                                        }
                                        onChange={(e) => {
                                            const duplicatedTeams = [
                                                ...selectedTeams,
                                            ];
                                            const selectedTeam = getTeamById(
                                                e.target.value
                                            );
                                            if (selectedTeam) {
                                                duplicatedTeams[index] =
                                                    selectedTeam.id;
                                            }
                                            setSelectedTeams(duplicatedTeams);
                                        }}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="">
                                            Seleccionar equipo
                                        </option>
                                        {availableTeams(
                                            selectedTeams[index]
                                        ).map((selectedTeam) => (
                                            <option
                                                key={selectedTeam.id}
                                                value={selectedTeam.id}
                                            >
                                                {selectedTeam.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[0, 1].map((index) => {
                                const team = getTeamById(selectedTeams[index]);
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-2"
                                    >
                                        {team && (
                                            <div
                                                className="w-6 h-6 rounded-full"
                                                style={{
                                                    backgroundColor: team.color,
                                                }}
                                            ></div>
                                        )}
                                        <label
                                            className="block"
                                            style={{ minWidth: 150 }}
                                        >
                                            Puntos{' '}
                                            {team?.name ||
                                                `Equipo ${index + 1}`}
                                            :
                                        </label>
                                        <InputGroup>
                                            <InputGroup.Button
                                                disabled={scores[index] === 0}
                                                onClick={() => {
                                                    updateScore(
                                                        index,
                                                        scores[index] - 1
                                                    );
                                                }}
                                            >
                                                -
                                            </InputGroup.Button>
                                            <InputNumber
                                                className={
                                                    'custom-input-number'
                                                }
                                                value={scores[index]}
                                                min={0}
                                                onChange={(
                                                    val: string | number | null
                                                ) => {
                                                    updateScore(
                                                        index,
                                                        !isNaN(Number(val))
                                                            ? Number(val)
                                                            : 0
                                                    );
                                                }}
                                            />
                                            <InputGroup.Button
                                                onClick={() => {
                                                    updateScore(
                                                        index,
                                                        scores[index] + 1
                                                    );
                                                }}
                                            >
                                                +
                                            </InputGroup.Button>
                                        </InputGroup>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            case '2 vs 2':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {[0, 1, 2, 3].map((index) => (
                                <div key={index}>
                                    <label className="block mb-1">
                                        Equipo {index + 1}:
                                    </label>
                                    <select
                                        value={
                                            getTeamById(selectedTeams[index])
                                                ?.id || ''
                                        }
                                        onChange={(e) => {
                                            const clonedTeams = [
                                                ...selectedTeams,
                                            ];
                                            const selectedTeam = getTeamById(
                                                e.target.value
                                            );
                                            if (selectedTeam) {
                                                clonedTeams[index] =
                                                    selectedTeam.id;
                                            }
                                            setSelectedTeams(clonedTeams);
                                        }}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="">
                                            Seleccionar equipo
                                        </option>
                                        {availableTeams(
                                            selectedTeams[index]
                                        ).map((team) => (
                                            <option
                                                key={team.id}
                                                value={team.id}
                                            >
                                                {team.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[0, 1].map((index) => {
                                const team1 = getTeamById(
                                    selectedTeams[index * 2]
                                );
                                const team2 = getTeamById(
                                    selectedTeams[index * 2 + 1]
                                );
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-2"
                                    >
                                        {team1 && (
                                            <div
                                                className="w-6 h-6 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        team1.color,
                                                }}
                                            ></div>
                                        )}
                                        {team2 && (
                                            <div
                                                className="w-6 h-6 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        team2.color,
                                                }}
                                            ></div>
                                        )}
                                        <label
                                            className="block"
                                            style={{ minWidth: 150 }}
                                        >
                                            Puntos{' '}
                                            {team1?.name ||
                                                `Equipo ${index * 2 + 1}`}{' '}
                                            y{' '}
                                            {team2?.name ||
                                                `Equipo ${index * 2 + 2}`}
                                            :
                                        </label>
                                        <InputGroup>
                                            <InputGroup.Button
                                                disabled={scores[index] === 0}
                                                onClick={() => {
                                                    updateScore(
                                                        index,
                                                        scores[index] - 1
                                                    );
                                                }}
                                            >
                                                -
                                            </InputGroup.Button>
                                            <InputNumber
                                                className={
                                                    'custom-input-number'
                                                }
                                                value={scores[index]}
                                                min={0}
                                                onChange={(
                                                    val: string | number | null
                                                ) => {
                                                    updateScore(
                                                        index,
                                                        !isNaN(Number(val))
                                                            ? Number(val)
                                                            : 0
                                                    );
                                                }}
                                            />
                                            <InputGroup.Button
                                                onClick={() => {
                                                    updateScore(
                                                        index,
                                                        scores[index] + 1
                                                    );
                                                }}
                                            >
                                                +
                                            </InputGroup.Button>
                                        </InputGroup>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            case 'Todos vs Todos':
                return (
                    <div className="space-y-4">
                        {teams.map((team, index) => (
                            <div
                                key={team.id}
                                className="flex items-center space-x-4"
                            >
                                <label className="flex items-center space-x-2">
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: team.color }}
                                    ></div>
                                    <span style={{ minWidth: 100 }}>
                                        {team.name}
                                    </span>
                                </label>
                                <div className="flex items-center space-x-2">
                                    <label>Puntos:</label>
                                    <InputGroup>
                                        <InputGroup.Button
                                            disabled={scores[index] === 0}
                                            onClick={() => {
                                                updateScore(
                                                    index,
                                                    scores[index] - 1
                                                );
                                            }}
                                        >
                                            -
                                        </InputGroup.Button>
                                        <InputNumber
                                            className={'custom-input-number'}
                                            value={scores[index]}
                                            min={0}
                                            onChange={(
                                                val: string | number | null
                                            ) => {
                                                updateScore(
                                                    index,
                                                    !isNaN(Number(val))
                                                        ? Number(val)
                                                        : 0
                                                );
                                            }}
                                        />
                                        <InputGroup.Button
                                            onClick={() => {
                                                updateScore(
                                                    index,
                                                    scores[index] + 1
                                                );
                                            }}
                                        >
                                            +
                                        </InputGroup.Button>
                                    </InputGroup>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'Individual':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1">Equipo:</label>
                            <select
                                value={getTeamById(selectedTeams[0])?.id || ''}
                                onChange={(e) => {
                                    const selectedTeam = getTeamById(
                                        e.target.value
                                    );
                                    if (selectedTeam) {
                                        setSelectedTeams([selectedTeam.id]);
                                    }
                                }}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Seleccionar equipo</option>
                                {teams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center space-x-2">
                            {selectedTeams[0] && (
                                <div
                                    className="w-6 h-6 rounded-full"
                                    style={{
                                        backgroundColor: getTeamById(
                                            selectedTeams[0]
                                        )?.color,
                                    }}
                                ></div>
                            )}
                            <label className="block" style={{ minWidth: 150 }}>
                                Puntos{' '}
                                {getTeamById(selectedTeams[0])?.name ||
                                    'Equipo'}
                                :
                            </label>
                            <InputGroup>
                                <InputGroup.Button
                                    disabled={scores[0] === 0}
                                    onClick={() => {
                                        updateScore(0, scores[0] - 1);
                                    }}
                                >
                                    -
                                </InputGroup.Button>
                                <InputNumber
                                    className={'custom-input-number'}
                                    value={scores[0]}
                                    min={0}
                                    onChange={(val: string | number | null) => {
                                        updateScore(
                                            0,
                                            !isNaN(Number(val))
                                                ? Number(val)
                                                : 0
                                        );
                                    }}
                                />
                                <InputGroup.Button
                                    onClick={() => {
                                        updateScore(0, scores[0] + 1);
                                    }}
                                >
                                    +
                                </InputGroup.Button>
                            </InputGroup>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <Loader isOpen={loading} />
            <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl font-semibold">Agregar Competencia</h2>
                <div>
                    <label htmlFor="type" className="block mb-1">
                        Tipo de Competencia:
                    </label>
                    <select
                        id="type"
                        value={type}
                        onChange={(e) => {
                            const newType = e.target
                                .value as Competition['type'];
                            setType(newType);
                        }}
                        className="w-full p-2 border rounded"
                    >
                        <option value="1 vs 1">1 vs 1</option>
                        <option value="2 vs 2">2 vs 2</option>
                        <option value="Todos vs Todos">Todos vs Todos</option>
                        <option value="Individual">Individual</option>
                    </select>
                </div>
                {renderCompetitionForm()}
                <div>
                    <label htmlFor="description" className="block mb-1">
                        Descripción:
                    </label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Agregar Competencia
                </button>
            </form>
        </div>
    );
};

export default CompetitionsTab;
