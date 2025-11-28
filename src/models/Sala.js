class Sala {
  constructor(nome, capacidade) {
    if (!nome || typeof nome !== 'string') {
      throw new Error('Nome da sala é obrigatório');
    }
    if (!capacidade || capacidade <= 0) {
      throw new Error('Capacidade deve ser maior que zero');
    }
    
    this.nome = nome;
    this.capacidade = capacidade;
  }
}

module.exports = Sala;
