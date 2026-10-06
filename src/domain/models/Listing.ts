export interface Listing {
  id: string;
  nombre: string;
  ubicacion: string;
  precioPorNoche: number;
  moneda?: string;
  capacidad: {
    huespedes: number;
    habitaciones: number;
    camas: number;
    banos: number;
  };
  comodidades: string[];
  clima: {
    tipo: string;
    temperaturaMedia: string;
  };
  calificacion: {
    puntuacion: number;
    resenasConteo: number;
  };
  fotos: string[];
  tieneVideo: boolean;
  opcionReserva: string;
  cancelacionGratuita: boolean;
  categorias: string[];
}