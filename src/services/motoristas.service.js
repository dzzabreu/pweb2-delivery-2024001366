import { AppError } from '../utils/AppError.js';

export class MotoristasService {
    constructor(motoristasRepository, entregasRepository) {
        this.motoristasRepository = motoristasRepository;
        this.entregasRepository = entregasRepository;
    }

    async criar({ nome, cpf, placaVeiculo }) {
        if (!nome || !cpf) {
            throw new AppError('Nome e CPF são obrigatórios', 400);
        }

        const motoristaExistente = await this.motoristasRepository.buscarPorCpf(cpf);
        if (motoristaExistente) {
            throw new AppError('CPF já cadastrado', 409);
        }

        return await this.motoristasRepository.criar({ nome, cpf, placaVeiculo });
    }

    async listarTodos() {
        return await this.motoristasRepository.listarTodos();
    }

    async buscarPorId(id) {
        const motorista = await this.motoristasRepository.buscarPorId(id);
        if (!motorista) {
            throw new AppError('Motorista não encontrado', 404);
        }
        return motorista;
    }

    async listarEntregasDoMotorista(id, status) {
        
        await this.buscarPorId(id);

        return await this.entregasRepository.listarTodos({
            motoristaId: Number(id),
            status,
        });
    }
}