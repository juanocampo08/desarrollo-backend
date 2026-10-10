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

// DTO para recibir los datos al crear una cabaña
export interface CreateListingDTO {
  nombre: string;
  ubicacion: string;
  precio_por_noche: number;
  moneda?: string;
  capacidad_huespedes: number;
  capacidad_habitaciones: number;
  capacidad_camas: number;
  capacidad_banos: number;
  clima_tipo?: string;
  clima_temperatura_media?: string;
  fotos?: string[];
  videos?: string[];
  tiene_video?: boolean;
  opcion_reserva?: string;
  cancelacion_gratuita?: boolean;
  categoria_ids?: number[];
  comodidad_ids?: number[];
  created_by?: string;
}

// DTO para los filtros de búsqueda en la URL
export interface FilterListingsDTO {
  page?: number;
  limit?: number;
  ubicacion?: string;
  minPrecio?: number;
  maxPrecio?: number;
  huespedes?: number;
}