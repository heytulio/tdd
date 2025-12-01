class HorarioInvalidoError extends Error {
  constructor(message, errorCode = 500) {
    super(message);
    this.name = "HorarioInvalido";
    this.errorCode = errorCode;
  }
}

module.exports = HorarioInvalidoError;
