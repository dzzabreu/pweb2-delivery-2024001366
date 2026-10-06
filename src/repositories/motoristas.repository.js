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