import type { CreateListingDTO, FilterListingsDTO, Listing } from '../models/Listing.ts';

export interface IListingRepository {
  findActiveListings(filters: FilterListingsDTO): Promise<{ data: Listing[]; total: number }>;
  findById(id: string): Promise<Listing | null>;
  create(data: CreateListingDTO): Promise<Listing>;
  softDelete(id: string, deletedBy: string): Promise<void>;
}