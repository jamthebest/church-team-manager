export interface Equipo {
  id: string;
  nombre: string;
  color: string;
}

export interface Competencia {
  id: string;
  tipo: '1vs1' | '2vs2' | 'todosVsTodos' | 'arbitraria';
  equipos: string[];
  puntos: number[];
  descripcion: string;
}

export interface Estado {
  equipos: Equipo[];
  competencias: Competencia[];
}