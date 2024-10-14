import React, { useState } from 'react';
import { Equipo, Competencia, Estado } from './types';
import TabEquipos from './components/TabEquipos';
import TabCompetencias from './components/TabCompetencias';
import TabResultados from './components/TabResultados';
import TabPosiciones from './components/TabPosiciones';

function App() {
  const [estado, setEstado] = useState<Estado>({
    equipos: [],
    competencias: [],
  });

  const [tabActiva, setTabActiva] = useState<'equipos' | 'competencias' | 'resultados' | 'posiciones'>('equipos');

  const agregarEquipo = (equipo: Equipo) => {
    setEstado((prevEstado) => ({
      ...prevEstado,
      equipos: [...prevEstado.equipos, equipo],
    }));
  };

  const editarEquipo = (equipoEditado: Equipo) => {
    setEstado((prevEstado) => ({
      ...prevEstado,
      equipos: prevEstado.equipos.map((equipo) =>
        equipo.id === equipoEditado.id ? equipoEditado : equipo
      ),
    }));
  };

  const borrarEquipo = (id: string) => {
    setEstado((prevEstado) => ({
      ...prevEstado,
      equipos: prevEstado.equipos.filter((equipo) => equipo.id !== id),
      competencias: prevEstado.competencias.filter((competencia) => 
        !competencia.equipos.includes(id)
      ),
    }));
  };

  const agregarCompetencia = (competencia: Competencia) => {
    setEstado((prevEstado) => ({
      ...prevEstado,
      competencias: [...prevEstado.competencias, competencia],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Mini campamento SET 2024</h1>
      <div className="mb-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {['equipos', 'competencias', 'resultados', 'posiciones'].map((tab) => (
              <button
                key={tab}
                className={`py-2 px-3 sm:px-4 text-center border-b-2 font-medium text-sm sm:text-base whitespace-nowrap ${
                  tabActiva === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setTabActiva(tab as any)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>
      {tabActiva === 'equipos' && (
        <TabEquipos
          equipos={estado.equipos}
          onAgregarEquipo={agregarEquipo}
          onEditarEquipo={editarEquipo}
          onBorrarEquipo={borrarEquipo}
        />
      )}
      {tabActiva === 'competencias' && (
        <TabCompetencias
          equipos={estado.equipos}
          onAgregarCompetencia={agregarCompetencia}
        />
      )}
      {tabActiva === 'resultados' && (
        <TabResultados
          competencias={estado.competencias}
          equipos={estado.equipos}
        />
      )}
      {tabActiva === 'posiciones' && (
        <TabPosiciones
          equipos={estado.equipos}
          competencias={estado.competencias}
        />
      )}
    </div>
  );
}

export default App;