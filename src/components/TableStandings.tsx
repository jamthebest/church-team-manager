import React from 'react';
import { Team, Competition } from '../types';

interface TableStandingsProps {
  teams: Team[];
  competitions: Competition[];
}

const TableStandings: React.FC<TableStandingsProps> = ({ teams, competitions }) => {
  const calculateTotalPoints = (teamId: string) => {
    return competitions.reduce((total, currentCompetition) => {
      const index = currentCompetition.teams.indexOf(teamId);
      return total + (index !== -1 ? currentCompetition.scores[index] : 0);
    }, 0);
  };

  const sortedTeams = [...teams].sort((a, b) => 
    calculateTotalPoints(b.id) - calculateTotalPoints(a.id)
  );

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-xl font-semibold mb-4">Tabla de Posiciones</h2>
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
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: team.color }}></div>
                  <span>{team.name}</span>
                </td>
                <td className="p-2">{calculateTotalPoints(team.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableStandings;