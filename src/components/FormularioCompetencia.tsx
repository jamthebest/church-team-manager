import React, { useState } from 'react';
import { Competencia, Equipo } from '../types';

interface FormularioCompetenciaProps {
  onAgregarCompetencia: (competencia: Competencia) => void;
  equipos: Equipo[];
}

const FormularioCompetencia: React.FC<FormularioCompetenciaProps> = ({ onAgregarCompetencia, equipos }) => {
  const [tipo, setTipo] = useState<Competencia['tipo']>('1vs1');
  const [equiposSeleccionados, setEquiposSeleccionados] = useState<string[]>([]);
  const [puntos, setPuntos] = useState<number[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (equiposSeleccionados.length > 0 && puntos.length === equiposSeleccionados.length) {
      const nuevaCompetencia: Competencia = {
        id: Date.now().toString(),
        tipo,
        equipos: equiposSeleccionados,
        puntos,
      };
      onAgregarCompetencia(nuevaCompetencia);
      setEquiposSeleccionados([]);
      setPuntos([]);
    }
  };

  const handleEquipoChange = (equipoId: string) => {
    setEquiposSeleccionados((prev) =>
      prev.includes(equipoId)
        ? prev.filter((id) => id !== equipoId)
        : [...prev, equipoId]
    );
    setPuntos(new Array(equiposSeleccionados.length).fill(0));
  };

  const handlePuntosChange = (index: number, valor: number) => {
    setPuntos((prev) => {
      const nuevoPuntos = [...prev];
      nuevoPuntos[index] = valor;
      return nuevoPuntos;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Agregar Competencia</h2>
      <div className="mb-4">
        <label htmlFor="tipo" className="block mb-2">Tipo de Competencia:</label>
        <select
          id="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value as Competencia['tipo'])}
          className="w-full p-2 border rounded"
        >
          <option value="1vs1">1 vs 1</option>
          <option value="2vs2">2 vs 2</option>
          <option value="todosVsTodos">Todos vs Todos</option>
          <option value="arbitraria">Arbitraria</option>
        </select>
      </div>
      <div className="mb-4">
        <p className="mb-2">Seleccionar Equipos:</p>
        {equipos.map((equipo) => (
          <label key={equipo.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={equiposSeleccionados.includes(equipo.id)}
              onChange={() => handleEquipoChange(equipo.id)}
              className="mr-2"
            />
            <span style={{ color: equipo.color }}>{equipo.nombre}</span>
          </label>
        ))}
      </div>
      {equiposSeleccionados.length > 0 && (
        <div className="mb-4">
          <p className="mb-2">Puntos:</p>
          {equiposSeleccionados.map((equipoId, index) => {
            const equipo = equipos.find((e) => e.id === equipoId);
            return (
              <div key={equipoId} className="flex items-center mb-2">
                <span style={{ color: equipo?.color }} className="mr-2">{equipo?.nombre}:</span>
                <input
                  type="number"
                  value={puntos[index] || 0}
                  onChange={(e) => handlePuntosChange(index, parseInt(e.target.value) || 0)}
                  className="w-20 p-1 border rounded"
                  min="0"
                />
              </div>
            );
          })}
        </div>
      )}
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Agregar Competencia
      </button>
    </form>
  );
};

export default FormularioCompetencia;