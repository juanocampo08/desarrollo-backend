import express, { type Express, type Request, type Response } from 'express';
import  listingRoutes from './interface/routers/listing.router.ts';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!, Como andamosss');
});


// Middleware para parsear JSON en el req.body
app.use(express.json());

// Montar las rutas en el prefijo /api/listings
app.use('/api/listings', listingRoutes);

const PORT = process.env["PORT"] || 3001
app.listen(PORT, () => {
    console.log(`Api running: http://localhost:${PORT}`)
});