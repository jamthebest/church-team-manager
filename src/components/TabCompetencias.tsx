import React, { useState, useMemo, useEffect } from 'react';
import { Competencia, Equipo } from '../types';

interface TabCompetenciasProps {
  equipos: Equipo[];
  onAgregarCompetencia: (competencia: Competencia) => void;
}

const TabCompetencias: React.FC<TabCompetenciasProps> = ({
  equipos,
  onAgregarCompetencia,
}) => {
  const [tipo, setTipo] = useState<Competencia['tipo']>('1vs1');
  const [equiposSeleccionados, setEquiposSeleccionados] = useState<string[]>([]);
  const [puntos, setPuntos] = useState<number[]>([]);
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (tipo === 'todosVsTodos') {
      setEquiposSeleccionados(equipos.map((team) => team.id));
    } else {
      setEquiposSeleccionados([]);
    }
    setPuntos([]);
  }, [tipo, equipos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let puntosFinales = [...puntos];
    
    if (tipo === '2vs2' && equiposSeleccionados.length === 4) {
      puntosFinales = [puntos[0], puntos[0], puntos[1], puntos[1]];
    }

    if (
      equiposSeleccionados.length > 0 &&
      puntosFinales.length === equiposSeleccionados.length &&
      descripcion.trim()
    ) {
      const nuevaCompetencia: Competencia = {
        id: Date.now().toString(),
        tipo,
        equipos: equiposSeleccionados,
        puntos: puntosFinales,
        descripcion: descripcion.trim(),
      };
      onAgregarCompetencia(nuevaCompetencia);
      setEquiposSeleccionados([]);
      setPuntos([]);
      setDescripcion('');
    }
  };

  const getEquipoById = (id: string) =>
    equipos.find((equipo) => equipo.id === id);

  const equiposDisponibles = useMemo(() => {
    return equipos.filter(
      (equipo) => !equiposSeleccionados.includes(equipo.id)
    );
  }, [equipos, equiposSeleccionados]);

  const renderFormularioCompetencia = () => {
    switch (tipo) {
      case '1vs1':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[0, 1].map((index) => (
                <div key={index}>
                  <label className="block mb-1">Equipo {index + 1}:</label>
                  <select
                    value={equiposSeleccionados[index] || ''}
                    onChange={(e) => {
                      const newEquipos = [...equiposSeleccionados];
                      newEquipos[index] = e.target.value;
                      setEquiposSeleccionados(newEquipos);
                    }}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Seleccionar equipo</option>
                    {(index === 0 ? equipos : equiposDisponibles).map(
                      (equipo) => (
                        <option key={equipo.id} value={equipo.id}>
                          {equipo.nombre}
                        </option>
                      )
                    )}
                  </select>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[0, 1].map((index) => {
                const equipo = getEquipoById(equiposSeleccionados[index]);
                return (
                  <div key={index} className="flex items-center space-x-2">
                    {equipo && (
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: equipo.color }}
                      ></div>
                    )}
                    <label className="block">
                      Puntos {equipo?.nombre || `Equipo ${index + 1}`}:
                    </label>
                    <input
                      type="number"
                      value={puntos[index] || 0}
                      onChange={(e) => {
                        const newPuntos = [...puntos];
                        newPuntos[index] = parseInt(e.target.value) || 0;
                        setPuntos(newPuntos);
                      }}
                      className="w-20 p-1 border rounded"
                      min="0"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      case '2vs2':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index}>
                  <label className="block mb-1">Equipo {index + 1}:</label>
                  <select
                    value={equiposSeleccionados[index] || ''}
                    onChange={(e) => {
                      const newEquipos = [...equiposSeleccionados];
                      newEquipos[index] = e.target.value;
                      setEquiposSeleccionados(newEquipos);
                    }}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Seleccionar equipo</option>
                    {(index === 0 ? equipos : equiposDisponibles).map(
                      (equipo) => (
                        <option key={equipo.id} value={equipo.id}>
                          {equipo.nombre}
                        </option>
                      )
                    )}
                  </select>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[0, 1].map((index) => {
                const equipo1 = getEquipoById(equiposSeleccionados[index * 2]);
                const equipo2 = getEquipoById(equiposSeleccionados[index * 2 + 1]);
                return (
                  <div key={index} className="flex items-center space-x-2">
                    {equipo1 && (
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: equipo1.color }}
                      ></div>
                    )}
                    {equipo2 && (
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: equipo2.color }}
                      ></div>
                    )}
                    <label className="block">
                      Puntos {equipo1?.nombre || `Equipo ${index * 2 + 1}`} y{' '}
                      {equipo2?.nombre || `Equipo ${index * 2 + 2}`}:
                    </label>
                    <input
                      type="number"
                      value={puntos[index] || 0}
                      onChange={(e) => {
                        const newPuntos = [...puntos];
                        newPuntos[index] = parseInt(e.target.value) || 0;
                        setPuntos(newPuntos);
                      }}
                      className="w-20 p-1 border rounded"
                      min="0"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'todosVsTodos':
        return (
          <div className="space-y-4">
            {equipos.map((equipo, index) => (
              <div key={equipo.id} className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: equipo.color }}
                  ></div>
                  <span>{equipo.nombre}</span>
                </label>
                <div className="flex items-center space-x-2">
                  <label>Puntos:</label>
                  <input
                    type="number"
                    value={puntos[index] || 0}
                    onChange={(e) => {
                      const newPuntos = [...puntos];
                      newPuntos[index] = parseInt(e.target.value) || 0;
                      setPuntos(newPuntos);
                    }}
                    className="w-20 p-1 border rounded"
                    min="0"
                  />
                </div>
              </div>
            ))}
          </div>
        );
      case 'arbitraria':
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Equipo:</label>
              <select
                value={equiposSeleccionados[0] || ''}
                onChange={(e) => setEquiposSeleccionados([e.target.value])}
                className="w-full p-2 border rounded"
              >
                <option value="">Seleccionar equipo</option>
                {equipos.map((equipo) => (
                  <option key={equipo.id} value={equipo.id}>
                    {equipo.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              {equiposSeleccionados[0] && (
                <div
                  className="w-6 h-6 rounded-full"
                  style={{
                    backgroundColor: getEquipoById(equiposSeleccionados[0])
                      ?.color,
                  }}
                ></div>
              )}
              <label className="block">
                Puntos{' '}
                {getEquipoById(equiposSeleccionados[0])?.nombre || 'Equipo'}:
              </label>
              <input
                type="number"
                value={puntos[0] || 0}
                onChange={(e) => setPuntos([parseInt(e.target.value) || 0])}
                className="w-20 p-1 border rounded"
                min="0"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold">Agregar Competencia</h2>
        <div>
          <label htmlFor="tipo" className="block mb-1">
            Tipo de Competencia:
          </label>
          <select
            id="tipo"
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value as Competencia['tipo']);
              setEquiposSeleccionados([]);
              setPuntos([]);
            }}
            className="w-full p-2 border rounded"
          >
            <option value="1vs1">1 vs 1</option>
            <option value="2vs2">2 vs 2</option>
            <option value="todosVsTodos">Todos vs Todos</option>
            <option value="arbitraria">Arbitraria</option>
          </select>
        </div>
        {renderFormularioCompetencia()}
        <div>
          <label htmlFor="descripcion" className="block mb-1">
            Descripción:
          </label>
          <input
            type="text"
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Agregar Competencia
        </button>
      </form>
    </div>
  );
};

export default TabCompetencias;