import { type Request, type Response } from 'express';
import type { FilterListingsDTO, Listing } from '../../domain/models/Listing.ts';
import { GetActiveListingsUseCase } from '../../application/listings.use-case.ts';
import { ListingsPostgresRepository } from '../../infrastructure/repository/listings.pg.repository.ts';

const listingsRepository = new ListingsPostgresRepository();
const getActiveListingsUseCase = new GetActiveListingsUseCase(listingsRepository);

// GET /api/listings - Obtener todos los alojamientos
export const getListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: FilterListingsDTO = {};
    const result = await getActiveListingsUseCase.execute(filters);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener los alojamientos', error });
  }
};

// GET /api/listings/:id - Obtener un alojamiento por ID
export const getListingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // Lógica para buscar por ID
    res.status(200).json({ success: true, data: { id } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener el alojamiento', error });
  }
};

// POST /api/listings - Crear un nuevo alojamiento
export const createListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const newListingData: Omit<Listing, 'id'> = req.body;
    // Lógica para guardar en base de datos
    res.status(201).json({ success: true, message: 'Alojamiento creado exitosamente', data: newListingData });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error al crear el alojamiento', error });
  }
};

// PUT / /api/listings/:id - Modificar/Actualizar un alojamiento
export const updateListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: Partial<Listing> = req.body;
    // Lógica para actualizar por ID
    res.status(200).json({ success: true, message: `Alojamiento ${id} actualizado`, data: updateData });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error al actualizar el alojamiento', error });
  }
};

// DELETE /api/listings/:id - Eliminar un alojamiento
export const deleteListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // Lógica para eliminar de la base de datos
    res.status(200).json({ success: true, message: `Alojamiento ${id} eliminado exitosamente` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar el alojamiento', error });
  }
};