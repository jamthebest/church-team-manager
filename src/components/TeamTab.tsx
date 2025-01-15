import React, { useState } from 'react';
import { Team } from '../types';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { defaultColors } from '../constants';
import Circle from '@uiw/react-color-circle';
import Loader from './Loader';
import Dialog from './Dialog';
import NewTeamForm, { Inputs } from './NewTeamForm';
import { Button } from 'rsuite';

interface TeamTabProps {
    teams: Team[];
    loading: boolean;
    onAddTeam: (team: Team) => Promise<void> | undefined;
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
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold mb-4">
                        Equipos Agregados
                    </h2>
                    <Button
                        appearance="primary"
                        onClick={() => setIsDialogOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Agregar Equipo
                    </Button>
                </div>
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

            <Dialog
                title="Agregar Equipo"
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            >
                <NewTeamForm onSubmit={handleSubmit} />
            </Dialog>
        </div>
    );
};

export default TeamTab;
