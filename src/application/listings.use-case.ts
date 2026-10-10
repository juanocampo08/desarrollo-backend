import type { IListingRepository } from '../domain/repository/IListings.repository.ts';
import type { CreateListingDTO, FilterListingsDTO } from '../domain/models/Listing.ts';

export class GetActiveListingsUseCase {
  constructor(private listingsRepository: IListingRepository) {}

  async execute(filters: FilterListingsDTO) {
    const { data, total } = await this.listingsRepository.findActiveListings(filters);

    return {
      listings: data,
      pagination: {
        total,
        page: filters.page || 1,
        limit: filters.limit || 10,
        totalPages: Math.ceil(total / (filters.limit || 10)),
      },
    };
  }
}

export class CreateListingUseCase {
  constructor(private listingsRepository: IListingRepository) {}

  async execute(dto: CreateListingDTO) {
    if (dto.precio_por_noche <= 0) {
      throw new Error('El precio por noche debe ser mayor a 0');
    }

    if (dto.capacidad_huespedes < 1) {
      throw new Error('La capacidad mínima debe ser de al menos 1 huésped');
    }

    return await this.listingsRepository.create(dto);
  }
}