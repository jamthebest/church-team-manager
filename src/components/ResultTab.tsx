import React, { useMemo, useState } from 'react';
import { Competition, Team } from '../types';

interface ResultsTabProps {
    competitions: Competition[];
    teams: Team[];
}

const ResultTab: React.FC<ResultsTabProps> = ({ competitions, teams }) => {
    const [teamFilter, setTeamFilterValue] = useState<string>('');
    const [filterType, setFilterType] = useState<string>('');

    const filteredCompetitions = useMemo(() => {
        return competitions.filter((competition) => {
            const isTeamFilterSatisfied = teamFilter
                ? competition.teams
                      .map((team) => team.id)
                      .includes(teamFilter)
                : true;
            const isFilterTypeRule = filterType
                ? competition.type === filterType
                : true;
            return isTeamFilterSatisfied && isFilterTypeRule;
        });
    }, [competitions, teamFilter, filterType]);

    const getTeamById = (id: string) =>
        teams.find((team) => team.id === id || team.name === id);

    return (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">
                Resultados de Competencias
            </h2>
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
                        <option value="Todos vs Todos">Todos vs Todos</option>
                        <option value="Individual">Individual</option>
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="text-left p-2">Tipo</th>
                            <th className="text-left p-2">Descripción</th>
                            <th className="text-left p-2">Equipos y Puntos</th>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResultTab;
