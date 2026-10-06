export class MotoristasController {
    constructor(service) {
        this.service = service;
    }

    criar = async (req, res, next) => {
        try {
            const motorista = await this.service.criar(req.body);
            res.status(201).json(motorista);
        } catch (err) {
            next(err);
        }
    };

    listar = async (req, res, next) => {
        try {
            const motoristas = await this.service.listarTodos();
            res.status(200).json(motoristas);
        } catch (err) {
            next(err);
        }
    };

    buscarPorId = async (req, res, next) => {
        try {
            const { id } = req.params;
            const motorista = await this.service.buscarPorId(id);
            res.status(200).json(motorista);
        } catch (err) {
            next(err);
        }
    };

    listarEntregas = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { status } = req.query;
            const entregas = await this.service.listarEntregasDoMotorista(id, status);
            res.status(200).json(entregas);
        } catch (err) {
            next(err);
        }
    };
}