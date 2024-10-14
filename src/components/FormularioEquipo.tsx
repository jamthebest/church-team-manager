import React, { useState } from 'react';
import { Equipo } from '../types';

interface FormularioEquipoProps {
  onAgregarEquipo: (equipo: Equipo) => void;
}

const FormularioEquipo: React.FC<FormularioEquipoProps> = ({ onAgregarEquipo }) => {
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState('#000000');

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

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Agregar Equipo</h2>
      <div className="mb-4">
        <label htmlFor="nombre" className="block mb-2">Nombre:</label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="color" className="block mb-2">Color:</label>
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
  );
};

export default FormularioEquipo;