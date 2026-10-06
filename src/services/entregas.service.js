import { AppError } from '../utils/AppError.js';

export class EntregasService {
    constructor(entregasRepository, motoristasRepository = null) {
        this.entregasRepository = entregasRepository;
        this.motoristasRepository = motoristasRepository;
    }

    async criar({ descricao, origem, destino }) {
        if (!descricao || !origem || !destino) {
            throw new AppError('Descrição, origem e destino são obrigatórios', 400);
        }

        if (origem.trim().toLowerCase() === destino.trim().toLowerCase()) {
            throw new AppError('Origem e destino não podem ser iguais', 400);
        }

        const entregaAtiva = await this.entregasRepository.buscarAtivaPorChave(descricao, origem, destino);
        if (entregaAtiva) {
            throw new AppError('Já existe uma entrega ativa com mesma descrição, origem e destino', 409);
        }

        return await this.entregasRepository.criar({ descricao, origem, destino });
    }

    async listarTodos(filtros) {
        return await this.entregasRepository.listarTodos(filtros);
    }

    async buscarPorId(id) {
        const entrega = await this.entregasRepository.buscarPorId(id);
        if (!entrega) {
            throw new AppError('Entrega não encontrada', 404);
        }
        return entrega;
    }

    async avancar(id) {
        const entrega = await this.buscarPorId(id);

        let novoStatus;
        if (entrega.status === 'CRIADA') {
            novoStatus = 'EM_TRANSITO';
        } else if (entrega.status === 'EM_TRANSITO') {
            novoStatus = 'ENTREGUE';
        } else {
            throw new AppError('Não é possível avançar o status desta entrega', 422);
        }

        const historicoAtualizado = [
            ...(entrega.historico || []),
            {
                dataHora: new Date().toISOString(),
                status: novoStatus,
            },
        ];

        return await this.entregasRepository.atualizar(id, {
            status: novoStatus,
            historico: historicoAtualizado,
        });
    }

    async cancelar(id) {
        const entrega = await this.buscarPorId(id);

        if (entrega.status === 'ENTREGUE' || entrega.status === 'CANCELADA') {
            throw new AppError('Não é possível cancelar esta entrega', 422);
        }

        const historicoAtualizado = [
            ...(entrega.historico || []),
            {
                dataHora: new Date().toISOString(),
                status: 'CANCELADA',
            },
        ];

        return await this.entregasRepository.atualizar(id, {
            status: 'CANCELADA',
            historico: historicoAtualizado,
        });
    }

    async obterHistorico(id) {
        const entrega = await this.buscarPorId(id);
        return entrega.historico;
    }

    async atribuirMotorista(id, motoristaId) {
        if (motoristaId === undefined || motoristaId === null || motoristaId === '') {
            throw new AppError('motoristaId é obrigatório', 400);
        }

        const entrega = await this.entregasRepository.buscarPorId(id);
        if (!entrega) {
            throw new AppError('Entrega não encontrada', 404);
        }

        if (entrega.status !== 'CRIADA') {
            throw new AppError('Apenas entregas com status CRIADA podem receber motorista', 422);
        }

        const motorista = await this.motoristasRepository.buscarPorId(motoristaId);
        if (!motorista) {
            throw new AppError('Motorista não encontrado', 404);
        }

        if (motorista.status !== 'ATIVO') {
            throw new AppError('Motorista inativo não pode ser atribuído', 422);
        }

        const historicoAtualizado = [
            ...(entrega.historico || []),
            {
                dataHora: new Date().toISOString(),
                status: entrega.status,
            },
        ];

        return await this.entregasRepository.atualizar(id, {
            motoristaId: Number(motoristaId),
            historico: historicoAtualizado,
        });
    }
}