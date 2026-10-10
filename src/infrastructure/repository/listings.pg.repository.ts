import type { Prisma } from '../../generated/prisma/index.js';
import type { IListingRepository } from '../../domain/repository/IListings.repository.ts';
import type { CreateListingDTO, FilterListingsDTO, Listing } from '../../domain/models/Listing.ts';
import { prisma } from './client.ts';

type ListingWithRelations = Prisma.listingsGetPayload<{
  include: {
    listing_categorias: { include: { categorias: true } };
    listing_comodidades: { include: { comodidades: true } };
  };
}>;

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
};

const toDomainListing = (listing: ListingWithRelations): Listing => ({
  id: listing.id,
  nombre: listing.nombre,
  ubicacion: listing.ubicacion,
  precioPorNoche: Number(listing.precio_por_noche),
  moneda: listing.moneda ?? undefined,
  capacidad: {
    huespedes: listing.capacidad_huespedes,
    habitaciones: listing.capacidad_habitaciones,
    camas: listing.capacidad_camas,
    banos: listing.capacidad_banos,
  },
  comodidades: listing.listing_comodidades.map(({ comodidades }) => comodidades.nombre),
  clima: {
    tipo: listing.clima_tipo ?? '',
    temperaturaMedia: listing.clima_temperatura_media ?? '',
  },
  calificacion: {
    puntuacion: Number(listing.calificacion_puntuacion ?? 0),
    resenasConteo: listing.calificacion_resenas_conteo ?? 0,
  },
  fotos: toStringArray(listing.fotos),
  tieneVideo: listing.tiene_video ?? false,
  opcionReserva: listing.opcion_reserva,
  cancelacionGratuita: listing.cancelacion_gratuita ?? false,
  categorias: listing.listing_categorias.map(({ categorias }) => categorias.nombre),
});

export class ListingsPostgresRepository implements IListingRepository {
  // 1. OBTENER LISTADO CON FILTROS Y PAGINACIÓN
  async findActiveListings(filters?: FilterListingsDTO): Promise<{ data: Listing[]; total: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.listingsWhereInput = {
      state: 'ACTIVO', // OBLIGATORIO: Solo traer cabañas activas
      ...(filters?.ubicacion && { ubicacion: { contains: filters.ubicacion, mode: 'insensitive' } }),
      ...(filters?.huespedes && { capacidad_huespedes: { gte: filters.huespedes } }),
    };

    const [data, total] = await Promise.all([
      prisma.listings.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          listing_categorias: { include: { categorias: true } },
          listing_comodidades: { include: { comodidades: true } },
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.listings.count({ where: whereClause }),
    ]);

    return { data: data.map(toDomainListing), total };
  }

  // 2. BUSCAR POR ID
  async findById(id: string): Promise<Listing | null> {
    const listing = await prisma.listings.findFirst({
      where: { id, state: 'ACTIVO' },
      include: {
        listing_categorias: { include: { categorias: true } },
        listing_comodidades: { include: { comodidades: true } },
      },
    });

    return listing ? toDomainListing(listing) : null;
  }

  // 3. CREAR NUEVO ALOJAMIENTO
  async create(dto: CreateListingDTO): Promise<Listing> {
    const { categoria_ids = [], comodidad_ids = [], ...listingData } = dto;

    const listing = await prisma.listings.create({
      data: {
        ...listingData,
        fotos: listingData.fotos ? JSON.stringify(listingData.fotos) : '[]',
        videos: listingData.videos ? JSON.stringify(listingData.videos) : '[]',
        listing_categorias: {
          create: categoria_ids.map((id) => ({ categoria_id: id })),
        },
        listing_comodidades: {
          create: comodidad_ids.map((id) => ({ comodidad_id: id })),
        },
      },
    });

    return listing as unknown as Listing;
  }

  // 4. ELIMINACIÓN LÓGICA (SOFT DELETE)
  async softDelete(id: string, deletedBy: string): Promise<void> {
    await prisma.listings.update({
      where: { id },
      data: {
        state: 'ELIMINADO',
        deleted_by: deletedBy,
        deleted_at: new Date(),
      },
    });
  }
}