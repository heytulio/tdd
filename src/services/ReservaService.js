const HorarioInvalidoError = require("../errors/HorarioInvalido.js");

class ReservaService {
  constructor() {
    this.reservas = [];
  }

  criarReserva(sala, dataInicio, dataFim, usuario, numeroPessoas) {
    // Validar todas as entradas ANTES de criar a reserva
    this._validarSala(sala);
    this._validarDatas(dataInicio, dataFim);
    this._validarUsuario(usuario);
    this._validarNumeroPessoas(numeroPessoas);
    this._verificarConflitoHorario(sala, dataInicio, dataFim);
    this._validarCapacidadeDaSala(sala, numeroPessoas);

    // Criar reserva
    const reserva = {
      id: this._gerarId(),
      sala,
      dataInicio,
      dataFim,
      usuario,
      numeroPessoas,
      status: "ATIVA",
    };

    this.reservas.push(reserva);

    return {
      reserva,
      mensagem: "Reserva realizada com sucesso",
    };
  }

  cancelarReserva(idReserva) {
    // Busca reserva pelo ID
    const reserva = this._buscarReservaPorId(idReserva);

    // Se não existir, lança erro
    if (!reserva) {
      throw new Error("Reserva não encontrada");
    }

    // Atualiza status
    reserva.status = "CANCELADA";

    return reserva;
  }

  listarReservas() {
    return this.reservas;
  }

  // ===== MÉTODOS PRIVADOS DE VALIDAÇÃO =====

  _validarSala(sala) {
    if (!sala || !sala.nome || !sala.capacidade) {
      throw new Error("Sala inválida");
    }
  }

  _validarDatas(dataInicio, dataFim) {
    if (!(dataInicio instanceof Date) || isNaN(dataInicio.getTime())) {
      throw new Error("Data de início inválida");
    }
    if (!(dataFim instanceof Date) || isNaN(dataFim.getTime())) {
      throw new Error("Data de término inválida");
    }

    if (dataInicio.getTime() >= dataFim.getTime()) {
      throw new HorarioInvalidoError(
        "Horario invalido inserido, data inicial deve ser anterior a data final"
      );
    }
  }

  _validarUsuario(usuario) {
    if (!usuario || typeof usuario !== "string" || usuario.trim() === "") {
      throw new Error("Usuário é obrigatório");
    }
  }

  _validarNumeroPessoas(numeroPessoas) {
    if (
      !numeroPessoas ||
      numeroPessoas <= 0 ||
      !Number.isInteger(numeroPessoas)
    ) {
      throw new Error("Número de pessoas deve ser um inteiro positivo");
    }
  }

  _verificarConflitoHorario(sala, dataInicio, dataFim) {
    for (const r of this.reservas) {
      const mesmaSala = r.sala.nome === sala.nome;
      const sobrepoe = dataInicio < r.dataFim && dataFim > r.dataInicio;

      if (mesmaSala && sobrepoe) {
        throw new Error("Já existe reserva neste horário para esta sala");
      }
    }
  }

  _validarCapacidadeDaSala(sala, numeroPessoas) {
    if (numeroPessoas > sala.capacidade) {
      throw new Error("Número de pessoas excede a capacidade da sala");
    }
  }

  // buscar por ID para cancelar reserva
  _buscarReservaPorId(idReserva) {
    return this.reservas.find((r) => r.id === idReserva);
  }

  _gerarId() {
    return `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = ReservaService;
