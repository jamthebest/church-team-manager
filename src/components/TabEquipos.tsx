import React, { useState } from 'react';
import { Equipo } from '../types';
import { Pencil, Trash2, Check, X } from 'lucide-react';

interface TabEquiposProps {
  equipos: Equipo[];
  onAgregarEquipo: (equipo: Equipo) => void;
  onEditarEquipo: (equipo: Equipo) => void;
  onBorrarEquipo: (id: string) => void;
}

const TabEquipos: React.FC<TabEquiposProps> = ({ equipos, onAgregarEquipo, onEditarEquipo, onBorrarEquipo }) => {
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState('#000000');
  const [equipoEditando, setEquipoEditando] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim()) {
      const nuevoEquipo: Equipo = {
        id: Date.now().toString(),
        nombre: nombre.trim(),
        color,
      };
      onAgregarEquipo(nuevoEquipo);
      setNombre('');
      setColor('#000000');
    }
  };

  const iniciarEdicion = (id: string) => {
    setEquipoEditando(id);
  };

  const cancelarEdicion = () => {
    setEquipoEditando(null);
  };

  const guardarEdicion = (equipo: Equipo) => {
    onEditarEquipo(equipo);
    setEquipoEditando(null);
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
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
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
          {equipos.map((equipo) => (
            <li key={equipo.id} className="border rounded p-3">
              {equipoEditando === equipo.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={equipo.nombre}
                    onChange={(e) => onEditarEquipo({ ...equipo, nombre: e.target.value })}
                    className="w-full p-1 border rounded"
                  />
                  <input
                    type="color"
                    value={equipo.color}
                    onChange={(e) => onEditarEquipo({ ...equipo, color: e.target.value })}
                    className="w-full p-1 border rounded"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => guardarEdicion(equipo)}
                      className="text-green-500 hover:text-green-700"
                      title="Guardar cambios"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={cancelarEdicion}
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
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: equipo.color }}></div>
                    <span>{equipo.nombre}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => iniciarEdicion(equipo.id)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Editar equipo"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => onBorrarEquipo(equipo.id)}
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

export default TabEquipos;