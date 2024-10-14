import React from 'react';
import { Equipo, Competencia } from '../types';

interface TabPosicionesProps {
  equipos: Equipo[];
  competencias: Competencia[];
}

const TabPosiciones: React.FC<TabPosicionesProps> = ({ equipos, competencias }) => {
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
            {equiposOrdenados.map((equipo, index) => (
              <tr key={equipo.id} className="border-b">
                <td className="p-2">{index + 1}</td>
                <td className="p-2 flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: equipo.color }}></div>
                  <span>{equipo.nombre}</span>
                </td>
                <td className="p-2">{calcularPuntosTotales(equipo.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabPosiciones;