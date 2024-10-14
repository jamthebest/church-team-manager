import React from 'react';
import { Equipo, Competencia } from '../types';

interface TablaEquiposProps {
  equipos: Equipo[];
  competencias: Competencia[];
}

const TablaEquipos: React.FC<TablaEquiposProps> = ({ equipos, competencias }) => {
  const calcularPuntosTotales = (equipoId: string) => {
    return competencias.reduce((total, competencia) => {
      const index = competencia.equipos.indexOf(equipoId);
      return total + (index !== -1 ? competencia.puntos[index] : 0);
    }, 0);
  };

  const equiposOrdenados = [...equipos].sort((a, b) => 
    calcularPuntosTotales(b.id) - calcularPuntosTotales(a.id)
  );

  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Tabla de Posiciones</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Posición</th>
            <th className="text-left">Equipo</th>
            <th className="text-left">Puntos</th>
          </tr>
        </thead>
        <tbody>
          {equiposOrdenados.map((equipo, index) => (
            <tr key={equipo.id}>
              <td>{index + 1}</td>
              <td>
                <span style={{ color: equipo.color }}>{equipo.nombre}</span>
              </td>
              <td>{calcularPuntosTotales(equipo.id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaEquipos;