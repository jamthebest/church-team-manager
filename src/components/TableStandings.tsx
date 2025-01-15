import React, { useState } from 'react';
import { Team, Competition } from '../types';
import { Button } from 'rsuite';
import Loader from './Loader';
import Dialog from './Dialog';
import NewTeamForm, { Inputs } from './NewTeamForm';
import ResultTab from './ResultTab';

interface TableStandingsProps {
    teams: Team[];
    competitions: Competition[];
    loading: boolean;
    addResult: (competition: Competition) => Promise<void> | undefined;
    onAddTeam: (team: Team) => Promise<void> | undefined;
    onEditTeam: (team: Team) => Promise<void>;
    onDeleteTeam: (id: string) => Promise<void>;
}

const TableStandings: React.FC<TableStandingsProps> = ({
    teams,
    competitions,
    loading,
    addResult,
    onAddTeam,
    // onEditTeam,
    // onDeleteTeam,
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const calculateTotalPoints = (teamId: string) => {
        return competitions.reduce((total, currentCompetition) => {
            const index = currentCompetition.teams
                .map((team) => team.id)
                .indexOf(teamId);
            return (
                total + (index !== -1 ? currentCompetition.scores[index] : 0)
            );
        }, 0);
    };

    const sortedTeams = [...teams].sort(
        (a, b) => calculateTotalPoints(b.id) - calculateTotalPoints(a.id)
    );

    const handleSubmit = (data: Inputs) => {
        if (data.name.trim()) {
            const newTeam: Team = {
                id: Date.now().toString(),
                name: data.name.trim(),
                color: data.color,
            };
            const addTeam = onAddTeam(newTeam);
            if (addTeam) {
                addTeam.then(() => {
                    setIsDialogOpen(false);
                });
            }
        }
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4">
                <Loader isOpen={loading} />
                <div className="flex justify-between items-baseline">
                    <h2 className="text-xl font-semibold mb-4">
                        Tabla de Posiciones
                    </h2>
                    <Button
                        appearance="primary"
                        onClick={() => setIsDialogOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Agregar Equipo
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="text-left p-2">Posición</th>
                                <th className="text-left p-2">Equipo</th>
                                <th className="text-left p-2">Puntos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTeams.map((team, index) => (
                                <tr key={team.id} className="border-b">
                                    <td className="p-2">{index + 1}</td>
                                    <td className="p-2 flex items-center space-x-2">
                                        <div
                                            className="w-6 h-6 rounded-full"
                                            style={{
                                                backgroundColor: team.color,
                                            }}
                                        ></div>
                                        <span>{team.name}</span>
                                    </td>
                                    <td className="p-2">
                                        {calculateTotalPoints(team.id)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ResultTab
                competitions={competitions}
                teams={teams}
                addResult={addResult}
                loading={loading}
            />

            <Dialog
                title="Agregar Equipo"
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            >
                <NewTeamForm onSubmit={handleSubmit} />
            </Dialog>
        </>
    );
};

export default TableStandings;
