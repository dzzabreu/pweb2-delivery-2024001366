/**
 * @typedef {Object} Entrega
 * @property {number} id
 * @property {string} descricao
 * @property {string} origem
 * @property {string} destino
 * @property {string} status
 * @property {number|null} motoristaId
 * @property {Array} historico
 */

/**
 * Contrato IEntregasRepository
 * @typedef {Object} IEntregasRepository
 * @property {(filtros?: { status?: string, motoristaId?: number }|string) => Promise<Entrega[]>} listarTodos
 * @property {(id: number) => Promise<Entrega|null>} buscarPorId
 * @property {(descricao: string, origem: string, destino: string) => Promise<Entrega|null>} buscarAtivaPorChave
 * @property {(dados: Object) => Promise<Entrega>} criar
 * @property {(id: number, dados: Partial<Entrega>) => Promise<Entrega|null>} atualizar
 */

export class EntregasRepository {
    constructor(database) {
        this.database = database;
    }

    async listarTodos(filtros = {}) {
        let statusFilter;
        let motoristaIdFilter;

        if (typeof filtros === 'string') {
            statusFilter = filtros;
        } else if (typeof filtros === 'object' && filtros !== null) {
            statusFilter = filtros.status;
            motoristaIdFilter = filtros.motoristaId;
        }

        let resultado = this.database.entregas;

        if (statusFilter) {
            resultado = resultado.filter((e) => e.status === statusFilter);
        }

        if (motoristaIdFilter !== undefined && motoristaIdFilter !== null) {
            resultado = resultado.filter((e) => e.motoristaId !== null && e.motoristaId !== undefined && String(e.motoristaId) === String(motoristaIdFilter));
        }

        return resultado;
    }

    async buscarPorId(id) {
        return this.database.entregas.find((e) => String(e.id) === String(id)) ?? null;
    }

    async buscarAtivaPorChave(descricao, origem, destino) {
        return (this.database.entregas.find((e) => e.descricao === descricao && e.origem === origem && e.destino === destino && e.status !== 'ENTREGUE' && e.status !== 'CANCELADA') ?? null);
    }

    async criar(dados) {
        const id = this.database.proximoId ?? this.database.proximoEntregaId ?? (this.database.entregas.length + 1);
        if ('proximoId' in this.database) this.database.proximoId++;
        if ('proximoEntregaId' in this.database) this.database.proximoEntregaId++;

        const novaEntrega = {
            id: this.database.proximoId++,
            ...dados,
            status: 'CRIADA',
            motoristaId: null,
            historico: [
                {
                    dataHora: new Date().toISOString(),
                    status: 'CRIADA',
                },
            ],
        };

        this.database.entregas.push(novaEntrega);

        return novaEntrega;
    }

    async atualizar(id, dados) {
        const indice = this.database.entregas.findIndex((e) => String(e.id) === String(id));
        if (indice === -1) return null;

        this.database.entregas[indice] = {
            ...this.database.entregas[indice],
            ...dados,
            id: this.database.entregas[indice].id,
        };

        return this.database.entregas[indice];
    }
}