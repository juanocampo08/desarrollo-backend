import {Router} from "express";
import { createListing, deleteListing, getListingById, getListings, updateListing } from "../controllers/listings.controller.ts";

const router: Router = Router()

// Rutas base para /api/listings

// Obtener todos los alojamientos
router.get('/', getListings);

// Obtener un alojamiento específico por ID
router.get('/:id', getListingById);

// Crear un nuevo alojamiento
router.post('/', createListing);

// Modificar/Actualizar un alojamiento por ID
router.put('/:id', updateListing); // También se puede usar router.patch('/:id', updateListing) para actualizaciones parciales

// Eliminar un alojamiento por ID
router.delete('/:id', deleteListing);
export default router