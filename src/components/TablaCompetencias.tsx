import React, { useState } from 'react';
import { Competencia, Equipo } from '../types';

interface TablaCompetenciasProps {
  competencias: Competencia[];
  equipos: Equipo[];
}

const TablaCompetencias: React.FC<TablaCompetenciasProps> = ({ competencias, equipos }) => {
  const [filtroEquipo, setFiltroEquipo] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<string>('');

  const competenciasFiltradas = competencias.filter((competencia) => {
    const cumpleFiltroEquipo = filtroEquipo ? competencia.equipos.includes(filtroEquipo) : true;
    const cumpleFiltroTipo = filtroTipo ? competencia.tipo === filtroTipo : true;
    return cumpleFiltroEquipo && cumpleFiltroTipo;
  });

  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Tabla de Competencias</h2>
      <div className="mb-4 flex space-x-4">
        <div>
          <label htmlFor="filtroEquipo" className="block mb-2">Filtrar por Equipo:</label>
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
          <label htmlFor="filtroTipo" className="block mb-2">Filtrar por Tipo:</label>
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
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Tipo</th>
            <th className="text-left">Equipos</th>
            <th className="text-left">Puntos</th>
          </tr>
        </thead>
        <tbody>
          {competenciasFiltradas.map((competencia) => (
            <tr key={competencia.id}>
              <td>{competencia.tipo}</td>
              <td>
                {competencia.equipos.map((equipoId) => {
                  const equipo = equipos.find((e) => e.id === equipoId);
                  return (
                    <span key={equipoId} style={{ color: equipo?.color }} className="mr-2">
                      {equipo?.nombre}
                    </span>
                  );
                })}
              </td>
              <td>
                {competencia.puntos.map((puntos, index) => (
                  <span key={index} className="mr-2">
                    {puntos}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaCompetencias;