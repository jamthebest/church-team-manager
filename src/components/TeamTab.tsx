import React, { useEffect, useState } from 'react';
import { Team } from '../types';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { defaultColors } from '../constants';
import Circle from '@uiw/react-color-circle';
import Loader from './Loader';

interface TeamTabProps {
    teams: Team[];
    loading: boolean;
    onAddTeam: (team: Team) => void;
    onEditTeam: (team: Team) => void;
    onDeleteTeam: (id: string) => void;
}

const TeamTab: React.FC<TeamTabProps> = ({
    teams,
    loading,
    onAddTeam,
    onEditTeam,
    onDeleteTeam,
}) => {
    const [teamName, setTeamName] = useState('');
    const [color, setColor] = useState('');
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);

    useEffect(() => {
        setTeamName('');
        setColor('');
    }, [teams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (teamName.trim()) {
            const newTeam: Team = {
                id: Date.now().toString(),
                name: teamName.trim(),
                color,
            };
            onAddTeam(newTeam);
        }
    };

    const startEditing = (team: Team) => {
        setEditingTeam(team);
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
            <Loader isOpen={loading} />
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-xl font-semibold">Agregar Equipo</h2>
                    <div>
                        <label htmlFor="nombre" className="block mb-1">
                            Nombre:
                        </label>
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
                        <label htmlFor="color" className="block mb-1">
                            Color:
                        </label>
                        <Circle
                            colors={defaultColors}
                            color={color}
                            pointProps={{
                                style: {
                                    marginRight: 20,
                                    height: 20,
                                    width: 20,
                                },
                            }}
                            onChange={(color) => {
                                setColor(color.hex);
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Agregar Equipo
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Equipos Agregados
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {teams.map((selectedTeam) => (
                        <li
                            key={selectedTeam.id}
                            className="border rounded p-3"
                        >
                            {editingTeam?.id === selectedTeam.id ? (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={editingTeam.name}
                                        onChange={(e) =>
                                            setEditingTeam({
                                                ...editingTeam,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full p-1 border rounded"
                                    />
                                    <Circle
                                        colors={defaultColors}
                                        color={editingTeam.color}
                                        pointProps={{
                                            style: {
                                                marginRight: 20,
                                                height: 20,
                                                width: 20,
                                            },
                                        }}
                                        onChange={(color) => {
                                            setEditingTeam({
                                                ...editingTeam,
                                                color: color.hex,
                                            });
                                        }}
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() =>
                                                updateTeam(editingTeam)
                                            }
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
                                        <div
                                            className="w-6 h-6 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    selectedTeam.color,
                                            }}
                                        ></div>
                                        <span>{selectedTeam.name}</span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() =>
                                                startEditing(selectedTeam)
                                            }
                                            className="text-blue-500 hover:text-blue-700"
                                            title="Editar equipo"
                                        >
                                            <Pencil size={20} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                onDeleteTeam(selectedTeam.id)
                                            }
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
