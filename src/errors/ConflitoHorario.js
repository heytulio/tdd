class ConflitoHorarioError extends Error {
  constructor(message, errorCode = 500, sugestoes) {
    super(message);
    this.name = "Conflito Horario";
    this.errorCode = errorCode;
    this.sugestoes = sugestoes;
  }
}

module.exports = ConflitoHorarioError;
