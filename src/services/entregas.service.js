import { AppError } from '../utils/AppError.js';

export class EntregasService {
    constructor(repository) {
        this.repository = repository;
    }

    async criar({ descricao, origem, destino }) {
        if (!descricao || !origem || !destino) {
            throw new AppError('Campos obrigatórios: descricao, origem e destino', 400);
        }

        if (origem === destino) {
            throw new AppError('A origem deve ser diferente do destino', 400);
        }

        const duplicata = await this.repository.buscarAtivaPorChave(descricao, origem, destino);
        if (duplicata) {
            throw new AppError('Já existe uma entrega ativa com a mesma descrição, origem e destino', 409);
        }

        const novaEntregaData = {
            descricao,
            origem,
            destino,
            status: 'CRIADA',
            historico: [
                {
                    data: new Date().toISOString(),
                    descricao: 'Entrega criada',
                },
            ],
        };

        return this.repository.criar(novaEntregaData);
    }

    async listarTodos(status) {
        return this.repository.listarTodos(status);
    }

    async buscarPorId(id) {
        const entrega = await this.repository.buscarPorId(id);
        if (!entrega) {
            throw new AppError('Entrega não encontrada', 404);
        }
        return entrega;
    }

    async avancar(id) {
        const entrega = await this.buscarPorId(id);

        let novoStatus = '';
        if (entrega.status === 'CRIADA') {
            novoStatus = 'EM_TRANSITO';
        } else if (entrega.status === 'EM_TRANSITO') {
            novoStatus = 'ENTREGUE';
        } else {
            throw new AppError('Transição de status inválida', 422);
        }

        const novoHistorico = [
            ...entrega.historico,
            {
                data: new Date().toISOString(),
                descricao: `Status alterado para ${novoStatus}`,
            },
        ];

        return this.repository.atualizar(id, {
            status: novoStatus,
            historico: novoHistorico,
        });
    }

    async cancelar(id) {
        const entrega = await this.buscarPorId(id);

        if (entrega.status === 'ENTREGUE' || entrega.status === 'CANCELADA') {
            throw new AppError('Não é possível cancelar uma entrega entregue ou já cancelada', 422);
        }

        const novoHistorico = [
            ...entrega.historico,
            {
                data: new Date().toISOString(),
                descricao: 'Entrega cancelada',
            },
        ];

        return this.repository.atualizar(id, {
            status: 'CANCELADA',
            historico: novoHistorico,
        });
    }

    async obterHistorico(id) {
        const entrega = await this.buscarPorId(id);
        return entrega.historico;
    }
}