const ReservaService = require("../src/services/ReservaService");
const Sala = require("../src/models/Sala");

describe("ReservaService", () => {
  let reservaService;
  let sala101;

  beforeEach(() => {
    // DADO: Preparar estado limpo antes de cada teste
    reservaService = new ReservaService();
    sala101 = new Sala("Sala 101", 6);
  });

  describe("Funcionalidade 1: Criar reserva válida", () => {
    describe("Cenário: Criar reserva válida em sala disponível", () => {
      test("deve criar reserva válida e retornar confirmação com status ATIVA", () => {
        // DADO: dados válidos para reserva
        const dataInicio = new Date("2025-12-10T14:00:00");
        const dataFim = new Date("2025-12-10T16:00:00");
        const usuario = "João Silva";
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
        expect(resultado).toHaveProperty("reserva");
        expect(resultado).toHaveProperty("mensagem");

        // Verificar a reserva criada
        const { reserva } = resultado;
        expect(reserva).toHaveProperty("id");
        expect(reserva.id).toMatch(/^RES-/);
        expect(reserva.sala).toBe(sala101);
        expect(reserva.dataInicio).toEqual(dataInicio);
        expect(reserva.dataFim).toEqual(dataFim);
        expect(reserva.usuario).toBe(usuario);
        expect(reserva.numeroPessoas).toBe(numeroPessoas);
        expect(reserva.status).toBe("ATIVA");

        // Verificar mensagem de confirmação
        expect(resultado.mensagem).toBe("Reserva realizada com sucesso");
      });

      test("deve adicionar a reserva na lista de reservas do sistema", () => {
        // DADO
        const dataInicio = new Date("2025-12-10T14:00:00");
        const dataFim = new Date("2025-12-10T16:00:00");

        // QUANDO
        reservaService.criarReserva(
          sala101,
          dataInicio,
          dataFim,
          "João Silva",
          4
        );

        // ENTÃO: reserva deve aparecer na lista
        const reservas = reservaService.listarReservas();
        expect(reservas).toHaveLength(1);
        expect(reservas[0].sala.nome).toBe("Sala 101");
      });
    });

    describe("Validações ao criar reserva", () => {
      const dataInicio = new Date("2025-12-10T14:00:00");
      const dataFim = new Date("2025-12-10T16:00:00");

      test("deve lançar erro quando sala for nula", () => {
        expect(() => {
          reservaService.criarReserva(
            null,
            dataInicio,
            dataFim,
            "João Silva",
            4
          );
        }).toThrow("Sala inválida");
      });

      test("deve lançar erro quando sala não tiver nome", () => {
        const salaInvalida = { capacidade: 6 };

        expect(() => {
          reservaService.criarReserva(
            salaInvalida,
            dataInicio,
            dataFim,
            "João Silva",
            4
          );
        }).toThrow("Sala inválida");
      });

      test("deve lançar erro quando data de início for inválida", () => {
        expect(() => {
          reservaService.criarReserva(
            sala101,
            "data-invalida",
            dataFim,
            "João Silva",
            4
          );
        }).toThrow("Data de início inválida");
      });

      test("deve lançar erro quando data de término for inválida", () => {
        expect(() => {
          reservaService.criarReserva(
            sala101,
            dataInicio,
            "data-invalida",
            "João Silva",
            4
          );
        }).toThrow("Data de término inválida");
      });

      test("deve lançar erro quando usuário for vazio", () => {
        expect(() => {
          reservaService.criarReserva(sala101, dataInicio, dataFim, "", 4);
        }).toThrow("Usuário é obrigatório");
      });

      test("deve lançar erro quando usuário for apenas espaços em branco", () => {
        expect(() => {
          reservaService.criarReserva(sala101, dataInicio, dataFim, "   ", 4);
        }).toThrow("Usuário é obrigatório");
      });

      test("deve lançar erro quando usuário for nulo", () => {
        expect(() => {
          reservaService.criarReserva(sala101, dataInicio, dataFim, null, 4);
        }).toThrow("Usuário é obrigatório");
      });

      test("deve lançar erro quando número de pessoas for zero", () => {
        expect(() => {
          reservaService.criarReserva(
            sala101,
            dataInicio,
            dataFim,
            "João Silva",
            0
          );
        }).toThrow("Número de pessoas deve ser um inteiro positivo");
      });

      test("deve lançar erro quando número de pessoas for negativo", () => {
        expect(() => {
          reservaService.criarReserva(
            sala101,
            dataInicio,
            dataFim,
            "João Silva",
            -5
          );
        }).toThrow("Número de pessoas deve ser um inteiro positivo");
      });

      test("deve lançar erro quando número de pessoas for decimal", () => {
        expect(() => {
          reservaService.criarReserva(
            sala101,
            dataInicio,
            dataFim,
            "João Silva",
            3.5
          );
        }).toThrow("Número de pessoas deve ser um inteiro positivo");
      });

      test("deve lançar erro quando número de pessoas for nulo", () => {
        expect(() => {
          reservaService.criarReserva(
            sala101,
            dataInicio,
            dataFim,
            "João Silva",
            null
          );
        }).toThrow("Número de pessoas deve ser um inteiro positivo");
      });
    });
  });

  describe("Ciclo 2: Impedir Horario Invertido", () => {
    test("deve lançar erro quando data início é posterior à data fim", () => {
      // DADO: Dados inválidos (horário invertido)
      const dataInicio = new Date("2025-12-10T16:00:00");
      const dataFim = new Date("2025-12-10T14:00:00");
      const usuario = "João Silva";
      const numeroPessoas = 4;

      // QUANDO/ENTÃO: Deve lançar erro
      expect(() => {
        reservaService.criarReserva(
          sala101,
          dataInicio,
          dataFim,
          usuario,
          numeroPessoas
        );
      }).toThrow(
        "Horario invalido inserido, data inicial deve ser anterior a data final"
      );
    });

    test("deve lançar erro quando data início é igual à data fim", () => {
      // DADO: Dados inválidos (mesma hora)
      const dataInicio = new Date("2025-12-10T14:00:00");
      const dataFim = new Date("2025-12-10T14:00:00");
      const usuario = "João Silva";
      const numeroPessoas = 4;

      // QUANDO/ENTÃO: Deve lançar erro
      expect(() => {
        reservaService.criarReserva(
          sala101,
          dataInicio,
          dataFim,
          usuario,
          numeroPessoas
        );
      }).toThrow(
        "Horario invalido inserido, data inicial deve ser anterior a data final"
      );
    });

    test("deve criar reserva quando data fim é posterior à data início", () => {
      // DADO: Dados válidos
      const dataInicio = new Date("2025-12-10T14:00:00");
      const dataFim = new Date("2025-12-10T16:00:00");
      const usuario = "João Silva";
      const numeroPessoas = 4;

      // QUANDO: Criar reserva
      const resultado = reservaService.criarReserva(
        sala101,
        dataInicio,
        dataFim,
        usuario,
        numeroPessoas
      );

      // ENTÃO: Deve criar com sucesso
      expect(resultado.reserva.status).toBe("ATIVA");
      expect(resultado.mensagem).toBe("Reserva realizada com sucesso");
    });
  });
});
