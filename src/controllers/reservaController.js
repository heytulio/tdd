const ReservaService = require("../services/ReservaService");

module.exports = new (class ReservaController {
  constructor() {
    this.reservaService = new ReservaService();
  }
  listAll = (req, res) => {
    try {
      const reservas = this.reservaService.listarReservas();
      return res.status(200).json(reservas);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar reservas" });
    }
  };

  addReserva = (req, res) => {
    try {
      const { sala, dataInicio, dataFim, usuario, numeroPessoas } = req.body;

      const inicioConvertido = new Date(dataInicio);
      const fimConvertido = new Date(dataFim);

      const resultado = this.reservaService.criarReserva(
        sala,
        inicioConvertido,
        fimConvertido,
        usuario,
        numeroPessoas
      );

      return res.status(201).json(resultado);
    } catch (error) {
      if (error.name === "Conflito Horario") {
        return res.status(409).json({
          error: error.message,
          sugestao: error.sugestoes,
        });
      }
      return res.status(400).json({ error: error.message });
    }
  };

  removeReserva = (req, res) => {
    try {
      const { id } = req.body;

      const reservaCancelada = this.reservaService.cancelarReserva(id);

      return res.status(200).json({
        message: "Reserva cancelada com sucesso",
        reserva: reservaCancelada,
      });
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  };

  getById = (req, res) => {
    try {
      const { id } = req.body;
      const reserva = this.reservaService._buscarReservaPorId(id);

      return res.status(200).json({
        reserva: reserva,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };
})();
