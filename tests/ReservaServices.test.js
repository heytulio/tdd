const ReservaService = require('../src/services/ReservaService');
const Sala = require('../src/models/Sala');

describe('ReservaService - Funcionalidade 1: Criar reserva válida', () => {
  let reservaService;
  let sala101;

  beforeEach(() => {
    // DADO: Preparar estado limpo antes de cada teste
    reservaService = new ReservaService();
    sala101 = new Sala('Sala 101', 6);
  });

  describe('Cenário: Criar reserva válida em sala disponível', () => {
    test('deve criar reserva válida e retornar confirmação com status ATIVA', () => {
      // DADO: dados válidos para reserva
      const dataInicio = new Date('2025-12-10T14:00:00');
      const dataFim = new Date('2025-12-10T16:00:00');
      const usuario = 'João Silva';
      const numeroPessoas = 4;

      // QUANDO: aluno solicita a reserva
      const resultado = reservaService.criarReserva(
        sala101,
        dataInicio,
        dataFim,
        usuario,
        numeroPessoas
      );

      // ENTÃO: sistema deve retornar reserva com status ATIVA
      expect(resultado).toBeDefined();
      expect(resultado).toHaveProperty('reserva');
      expect(resultado).toHaveProperty('mensagem');
      
      // Verificar a reserva criada
      const { reserva } = resultado;
      expect(reserva).toHaveProperty('id');
      expect(reserva.id).toMatch(/^RES-/);
      expect(reserva.sala).toBe(sala101);
      expect(reserva.dataInicio).toEqual(dataInicio);
      expect(reserva.dataFim).toEqual(dataFim);
      expect(reserva.usuario).toBe(usuario);
      expect(reserva.numeroPessoas).toBe(numeroPessoas);
      expect(reserva.status).toBe('ATIVA');
      
      // Verificar mensagem de confirmação
      expect(resultado.mensagem).toBe('Reserva realizada com sucesso');
    });

    test('deve adicionar a reserva na lista de reservas do sistema', () => {
      // DADO
      const dataInicio = new Date('2025-12-10T14:00:00');
      const dataFim = new Date('2025-12-10T16:00:00');

      // QUANDO
      reservaService.criarReserva(sala101, dataInicio, dataFim, 'João Silva', 4);

      // ENTÃO: reserva deve aparecer na lista
      const reservas = reservaService.listarReservas();
      expect(reservas).toHaveLength(1);
      expect(reservas[0].sala.nome).toBe('Sala 101');
    });
  });
});
