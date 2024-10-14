import React, { useState } from 'react';
import { Competencia, Equipo } from '../types';

interface TabResultadosProps {
  competencias: Competencia[];
  equipos: Equipo[];
}

const TabResultados: React.FC<TabResultadosProps> = ({ competencias, equipos }) => {
  const [filtroEquipo, setFiltroEquipo] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<string>('');

  const competenciasFiltradas = competencias.filter((competencia) => {
    const cumpleFiltroEquipo = filtroEquipo ? competencia.equipos.includes(filtroEquipo) : true;
    const cumpleFiltroTipo = filtroTipo ? competencia.tipo === filtroTipo : true;
    return cumpleFiltroEquipo && cumpleFiltroTipo;
  });

  const getEquipoById = (id: string) => equipos.find(equipo => equipo.id === id);

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-xl font-semibold mb-4">Resultados de Competencias</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="filtroEquipo" className="block mb-1">Filtrar por Equipo:</label>
          <select
            id="filtroEquipo"
            value={filtroEquipo}
            onChange={(e) => setFiltroEquipo(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Todos</option>
            {equipos.map((equipo) => (
              <option key={equipo.id} value={equipo.id}>{equipo.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filtroTipo" className="block mb-1">Filtrar por Tipo:</label>
          <select
            id="filtroTipo"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Todos</option>
            <option value="1vs1">1 vs 1</option>
            <option value="2vs2">2 vs 2</option>
            <option value="todosVsTodos">Todos vs Todos</option>
            <option value="arbitraria">Arbitraria</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2">Tipo</th>
              <th className="text-left p-2">Descripción</th>
              <th className="text-left p-2">Equipos y Puntos</th>
            </tr>
          </thead>
          <tbody>
            {competenciasFiltradas.map((competencia) => (
              <tr key={competencia.id} className="border-b">
                <td className="p-2">{competencia.tipo}</td>
                <td className="p-2">{competencia.descripcion}</td>
                <td className="p-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {competencia.equipos.map((equipoId, index) => {
                      const equipo = getEquipoById(equipoId);
                      return (
                        <div key={equipoId} className="flex items-center space-x-1">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: equipo?.color }}>
                            {competencia.puntos[index]}
                          </div>
                          <span>{equipo?.nombre}</span>
                        </div>
                      );
                    })}
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

export default TabResultados;