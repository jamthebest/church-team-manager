import React, { useMemo, useState } from 'react';
import { Competition, Team } from '../types';
import { Button, IconButton } from 'rsuite';
import Dialog from './Dialog';
import { Pencil } from 'lucide-react';
import CompetitionForm from './Competition/CompetitionForm';
import Loader from './Loader';

interface ResultsTabProps {
    competitions: Competition[];
    teams: Team[];
    loading: boolean;
    addResult: (competition: Competition) => Promise<void> | undefined;
    updateResult: (competition: Competition) => Promise<void> | undefined;
    deleteResult: (id: string) => Promise<void>;
}

const ResultTab: React.FC<ResultsTabProps> = ({
    addResult,
    updateResult,
    deleteResult,
    competitions,
    loading,
    teams,
}) => {
    const [teamFilter, setTeamFilterValue] = useState<string>('');
    const [filterType, setFilterType] = useState<string>('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCompetition, setEditingCompetition] =
        useState<Competition | null>(null);

    const filteredCompetitions = useMemo(() => {
        return competitions.filter((competition) => {
            const isTeamFilterSatisfied = teamFilter
                ? competition.teams.map((team) => team.id).includes(teamFilter)
                : true;
            const isFilterTypeRule = filterType
                ? competition.type === filterType
                : true;
            return isTeamFilterSatisfied && isFilterTypeRule;
        });
    }, [competitions, teamFilter, filterType]);

    const getTeamById = (id: string) =>
        teams.find((team) => team.id === id || team.name === id);

    const onAddCompetition = (competition: Competition) => {
        const result = addResult(competition);
        if (result) {
            result.then(() => {
                setIsDialogOpen(false);
                setEditingCompetition(null);
            });
        }
    };

    const onUpdateCompetition = (competition: Competition) => {
        const result = updateResult(competition);
        if (result) {
            result.then(() => {
                setIsDialogOpen(false);
                setEditingCompetition(null);
            });
        }
    };

    const onDeleteCompetition = (id: string) => {
        const result = deleteResult(id);
        return result.then(() => {
            setIsDialogOpen(false);
            setEditingCompetition(null);
        });
    };

    return (
        <>
            <div className="bg-white/70 border border-white/60 rounded-lg shadow-lg p-4 sm:p-6">
                <div className="flex justify-between items-baseline">
                    <h2 className="text-xl font-semibold mb-4">
                        Resultados de Competencias
                    </h2>
                    <Button
                        appearance="primary"
                        onClick={() => setIsDialogOpen(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Agregar Competencia
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="teamFilter" className="block mb-1">
                            Filtrar por Equipo:
                        </label>
                        <select
                            id="teamFilter"
                            value={teamFilter}
                            onChange={(e) => setTeamFilterValue(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Todos</option>
                            {teams.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="filterType" className="block mb-1">
                            Filtrar por Tipo:
                        </label>
                        <select
                            id="filterType"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Todos</option>
                            <option value="1 vs 1">1 vs 1</option>
                            <option value="2 vs 2">2 vs 2</option>
                            <option value="Todos vs Todos">
                                Todos vs Todos
                            </option>
                            <option value="Individual">Individual</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100/60">
                                <th className="text-left p-2">Tipo</th>
                                <th className="text-left p-2">Descripción</th>
                                <th className="text-left p-2">
                                    Equipos y Puntos
                                </th>
                                <th className="text-left p-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCompetitions.map((competition) => (
                                <tr key={competition.id} className="border-b">
                                    <td className="p-2">{competition.type}</td>
                                    <td className="p-2">
                                        {competition.description}
                                    </td>
                                    <td className="p-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {competition.teams.map(
                                                (currentTeam, index) => {
                                                    const team = getTeamById(
                                                        currentTeam.id
                                                    );
                                                    return (
                                                        <div
                                                            key={currentTeam.id}
                                                            className="flex items-center space-x-1"
                                                        >
                                                            <div
                                                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                                                style={{
                                                                    backgroundColor:
                                                                        team?.color,
                                                                }}
                                                            >
                                                                {
                                                                    competition
                                                                        .scores[
                                                                        index
                                                                    ]
                                                                }
                                                            </div>
                                                            <span>
                                                                {team?.name}
                                                            </span>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <IconButton
                                            circle
                                            size="xs"
                                            appearance="ghost"
                                            icon={<Pencil size={12} />}
                                            onClick={() => {
                                                setEditingCompetition(
                                                    competitions.find(
                                                        (x) =>
                                                            x.id ===
                                                            competition.id
                                                    ) ?? null
                                                );
                                                setIsDialogOpen(true);
                                            }}
                                        ></IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog
                title={
                    editingCompetition
                        ? 'Editar Competencia'
                        : 'Nueva Competencia'
                }
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setEditingCompetition(null);
                }}
            >
                <Loader isOpen={loading} />
                <CompetitionForm
                    teams={teams}
                    competition={editingCompetition}
                    onDelete={onDeleteCompetition}
                    onSubmit={(data) => {
                        if (editingCompetition) {
                            onUpdateCompetition({
                                ...data,
                                id: editingCompetition.id,
                            });
                        } else {
                            onAddCompetition({
                                ...data,
                                id: '',
                            });
                        }
                    }}
                />
            </Dialog>
        </>
    );
};

export default ResultTab;
