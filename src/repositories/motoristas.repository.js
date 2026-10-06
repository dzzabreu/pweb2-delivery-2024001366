/**
 * @typedef {Object} Motorista
 * @property {number} id
 * @property {string} nome
 * @property {string} cpf
 * @property {string|null} [placaVeiculo]
 * @property {'ATIVO'|'INATIVO'} status
 */

/**
 * Contrato IMotoristasRepository
 * @typedef {Object} IMotoristasRepository
 * @property {() => Motorista[]} listarTodos
 * @property {(id: number) => Motorista|null} buscarPorId
 * @property {(cpf: string) => Motorista|null} buscarPorCpf
 * @property {(dados: { nome: string, cpf: string, placaVeiculo?: string }) => Motorista} criar
 */

export class MotoristasRepository {
    constructor(database) {
        this.database = database;
    }

    async listarTodos() {
        return this.database.motoristas;
    }

    async buscarPorId(id) {
        return this.database.motoristas.find((m) => String(m.id) === String(id)) ?? null;
    }

    async buscarPorCpf(cpf) {
        return this.database.motoristas.find((m) => String(m.cpf).trim() === String(cpf).trim()) ?? null;
    }

    async criar({ nome, cpf, placaVeiculo}) {
        const id = this.database.proximoMotoristaId ?? (this.database.motoristas.length + 1);
        if ('proximoMotoristaId' in this.database) this.database.proximoMotoristaId++;

        const novoMotorista = {
            id,
            nome,
            cpf,
            placaVeiculo: placaVeiculo || null,
            status: 'ATIVO',
        };

        this.database.motoristas.push(novoMotorista);
        return novoMotorista;
    }
}