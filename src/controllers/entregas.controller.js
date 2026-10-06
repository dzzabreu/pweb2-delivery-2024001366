export class EntregasController {
    constructor(service) {
        this.service = service;
    }

    criar = async (req, res, next) => {
        try {
            const entrega = await this.service.criar(req.body);
            res.status(201).json(entrega);
        } catch (err) {
            next(err);
        }
    };

    listar = async (req, res, next) => {
        try {
            const { status } = req.query;
            const entregas = await this.service.listarTodos(status);
            res.status(200).json(entregas);
        } catch (err) {
            next(err);
        }
    };

    buscarPorId = async (req, res, next) => {
        try {
            const { id } = req.params;
            const entrega = await this.service.buscarPorId(id);
            res.status(200).json(entrega);
        } catch (err) {
            next(err);
        }
    };

    avancar = async (req, res, next) => {
        try {
            const { id } = req.params;
            const entrega = await this.service.avancar(id);
            res.status(200).json(entrega);
        } catch (err) {
            next(err);
        }
    };

    cancelar = async (req, res, next) => {
        try {
            const { id } = req.params;
            const entrega = await this.service.cancelar(id);
            res.status(200).json(entrega);
        } catch (err) {
            next(err);
        }
    };

    obterHistorico = async (req, res, next) => {
        try {
            const { id } = req.params;
            const historico = await this.service.obterHistorico(id);
            res.status(200).json(historico);
        } catch (err) {
            next(err);
        }
    };

    atribuirMotorista = async (req, res, next) => {
        try {
            const { id } = req.params;
            const b = req.body || {};
            const q = req.query || {};

            let motoristaId = b.motoristaId ?? b.motorista_id ?? b.idMotorista ?? b.id_motorista ?? b.motorista ?? b.id ?? q.motoristaId ?? q.motorista_id ?? q.motorista;

            if (typeof motoristaId === 'object' && motoristaId !== null) {
                motoristaId = motoristaId.id;
            }

            const entrega = await this.service.atribuirMotorista(id, motoristaId);
            res.status(200).json(entrega);
        } catch (err) {
            next(err);
        }
    };
}