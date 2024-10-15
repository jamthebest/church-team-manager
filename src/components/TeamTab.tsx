import React, { useState } from 'react';
import { Team } from '../types';
import { Pencil, Trash2, Check, X } from 'lucide-react';

interface TeamTabProps {
  teams: Team[];
  onAddTeam: (team: Team) => void;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (id: string) => void;
}

const TeamTab: React.FC<TeamTabProps> = ({ teams, onAddTeam, onEditTeam, onDeleteTeam }) => {
  const [teamName, setTeamName] = useState('');
  const [color, setColor] = useState('#000000');
  const [editingTeam, setEditingTeam] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName.trim()) {
      const newTeam: Team = {
        id: Date.now().toString(),
        name: teamName.trim(),
        color,
      };
      onAddTeam(newTeam);
      setTeamName('');
      setColor('#000000');
    }
  };

  const startEditing = (id: string) => {
    setEditingTeam(id);
  };

  const cancelTeamEditing = () => {
    setEditingTeam(null);
  };

  const updateTeam = (teamToUpdate: Team) => {
    onEditTeam(teamToUpdate);
    setEditingTeam(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold">Agregar Equipo</h2>
          <div>
            <label htmlFor="nombre" className="block mb-1">Nombre:</label>
            <input
              type="text"
              id="nombre"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="color" className="block mb-1">Color:</label>
            <input
              type="color"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full p-1 border rounded"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Agregar Equipo
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">Equipos Agregados</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {teams.map((selectedTeam) => (
            <li key={selectedTeam.id} className="border rounded p-3">
              {editingTeam === selectedTeam.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={selectedTeam.name}
                    onChange={(e) => onEditTeam({ ...selectedTeam, name: e.target.value })}
                    className="w-full p-1 border rounded"
                  />
                  <input
                    type="color"
                    value={selectedTeam.color}
                    onChange={(e) => onEditTeam({ ...selectedTeam, color: e.target.value })}
                    className="w-full p-1 border rounded"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => updateTeam(selectedTeam)}
                      className="text-green-500 hover:text-green-700"
                      title="Guardar cambios"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={cancelTeamEditing}
                      className="text-red-500 hover:text-red-700"
                      title="Cancelar edición"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: selectedTeam.color }}></div>
                    <span>{selectedTeam.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(selectedTeam.id)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Editar equipo"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => onDeleteTeam(selectedTeam.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Borrar equipo"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeamTab;