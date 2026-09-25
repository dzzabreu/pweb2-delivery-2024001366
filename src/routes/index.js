import { Router } from 'express';
import { Database } from '../database/database.js';
import { EntregasRepository } from '../repositories/entregas.repository.js';
import { EntregasService } from '../services/entregas.service.js';
import { EntregasController } from '../controllers/entregas.controller.js';
import { mapearRotasEntregas } from './entregas.routes.js';

const router = Router();

// Composition Root
const database = new Database();
const entregasRepository = new EntregasRepository(database);
const entregasService = new EntregasService(entregasRepository);
const entregasController = new EntregasController(entregasService);


router.use('/entregas', mapearRotasEntregas(entregasController));

export default router;