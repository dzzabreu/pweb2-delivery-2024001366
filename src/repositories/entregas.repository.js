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
 * @property {(filtros?: { status?: string, motoristaId?: number }) => Entrega[]} listarTodos
 * @property {(id: number) => Entrega|null} buscarPorId
 * @property {(dados: { descricao: string, origem: string, destino: string }) => Entrega} criar
 * @property {(id: number, dados: Partial<Entrega>) => Entrega} atualizar
 */

export class EntregasRepository {
    constructor(database) {
        this.database = database;
    }

    async listarTodos(status) {
        if(status) {
            return this.database.entregas.filter((e) => e.status === status);
        }
        return this.database.entregas;
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