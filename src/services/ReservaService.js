class ReservaService {
  constructor() {
    this.reservas = [];
  }

  criarReserva(sala, dataInicio, dataFim, usuario, numeroPessoas) {
    // Gerar ID único simples
    const id = `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Criar objeto de reserva
    const reserva = {
      id,
      sala,
      dataInicio,
      dataFim,
      usuario,
      numeroPessoas,
      status: 'ATIVA'
    };

    // Armazenar reserva
    this.reservas.push(reserva);

    // Retornar reserva e mensagem de confirmação
    return {
      reserva,
      mensagem: 'Reserva realizada com sucesso'
    };
  }

  listarReservas() {
    return this.reservas;
  }
}

module.exports = ReservaService;
