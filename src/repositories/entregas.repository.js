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
            resultado = resultado.filter((e) => e.motoristaId === Number(motoristaIdFilter));
        }

        return resultado;
    }

    async buscarPorId(id) {
        return this.database.entregas.find((e) => e.id === Number(id)) ?? null;
    }

    async buscarAtivaPorChave(descricao, origem, destino) {
        return (this.database.entregas.find((e) => e.descricao === descricao && e.origem === origem && e.destino === destino && e.status !== 'ENTREGUE' && e.status !== 'CANCELADA') ?? null);
    }

    async criar(dados) {
        const novaEntrega = {
            id: this.database.proximoId++,
            ...dados,
            motoristaId: null,
        };

        this.database.entregas.push(novaEntrega);

        return novaEntrega;
    }

    async atualizar(id, dados) {
        const indice = this.database.entregas.findIndex((e) => e.id === Number(id));
        if (indice === -1) return null;

        this.database.entregas[indice] = {
            ...this.database.entregas[indice],
            ...dados,
            id: Number(id),
        };

        return this.database.entregas[indice];
    }
}