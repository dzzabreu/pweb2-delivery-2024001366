import { Router } from 'express';

export function mapearRotasEntregas(controller) {
    const router = Router();

    router.post('/', controller.criar);
    router.get('/', controller.listar);
    router.get('/:id', controller.buscarPorId);
    router.patch('/:id/avancar', controller.avancar);
    router.patch('/:id/cancelar', controller.cancelar);
    router.get('/:id/historico', controller.obterHistorico);

    return router;
}