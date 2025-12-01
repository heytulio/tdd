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

  _gerarId() {
    return `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = ReservaService;
