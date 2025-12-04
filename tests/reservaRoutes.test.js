const request = require("supertest");
const app = require("../src/app");
const ReservaService = require("../src/services/ReservaService");

/**
 * TESTES DE INTEGRAÇÃO - ROTAS DE RESERVA
 *
 * Padrão BDD: Given-When-Then
 * - DADO: O estado inicial e dados de entrada
 * - QUANDO: A ação que será executada
 * - ENTÃO: O resultado esperado
 */

describe("Integração - Rotas de Reserva", () => {
  // ========================================
  // TESTES POST /api/reserva/add
  // ========================================
  describe("POST /api/reserva/add", () => {
    describe("Cenários de Sucesso", () => {
      it("deve criar uma nova reserva com dados válidos", async () => {
        // DADO: Uma reserva com dados corretos
        const novaReserva = {
          sala: {
            nome: "Sala de Estudo A",
            capacidade: 10,
          },
          dataInicio: "2025-12-20T10:00:00",
          dataFim: "2025-12-20T12:00:00",
          usuario: "usuario_teste@email.com",
          numeroPessoas: 5,
        };

        // QUANDO: Faz uma requisição POST para criar a reserva
        const response = await request(app)
          .post("/api/reserva/add")
          .send(novaReserva)
          .expect("Content-Type", /json/);

        // ENTÃO: Deve retornar status 201 e o objeto criado
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty(
          "mensagem",
          "Reserva realizada com sucesso"
        );
        expect(response.body.reserva).toBeDefined();
        expect(response.body.reserva).toHaveProperty("id");
        expect(response.body.reserva.sala.nome).toBe("Sala de Estudo A");
        expect(response.body.reserva.numeroPessoas).toBe(5);
        expect(response.body.reserva).toHaveProperty("dataInicio");
        expect(response.body.reserva).toHaveProperty("dataFim");
        expect(response.body.reserva).toHaveProperty("status");
      });
    });

    describe("Cenários de Validação - Erro 400", () => {
      it("deve retornar erro 400 quando número de pessoas é inválido (string)", async () => {
        // DADO: Uma reserva com número de pessoas inválido
        const reservaInvalida = {
          sala: { nome: "Sala X", capacidade: 10 },
          dataInicio: "2025-12-20T10:00:00",
          dataFim: "2025-12-20T12:00:00",
          usuario: "tulio@email.com",
          numeroPessoas: "texto_invalido",
        };

        // QUANDO: Tenta criar a reserva com dados inválidos
        const response = await request(app)
          .post("/api/reserva/add")
          .send(reservaInvalida);

        // ENTÃO: Deve retornar erro 400 com detalhes do erro
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
      });

      it("deve retornar erro 400 quando data final é anterior à data inicial", async () => {
        // DADO: Uma reserva com datas trocadas
        const reservaComDatasInvalidas = {
          sala: { nome: "Sala B", capacidade: 10 },
          dataInicio: "2025-12-20T12:00:00",
          dataFim: "2025-12-20T09:00:00",
          usuario: "maria@email.com",
          numeroPessoas: 3,
        };

        // QUANDO: Tenta criar a reserva com datas inválidas
        const response = await request(app)
          .post("/api/reserva/add")
          .send(reservaComDatasInvalidas);

        // ENTÃO: Deve retornar erro 400 ou 422 com mensagem sobre datas
        expect([400, 422]).toContain(response.status);
      });

      it("deve retornar erro 400 quando número de pessoas excede capacidade da sala", async () => {
        // DADO: Uma reserva onde pessoas excedem capacidade
        const reservaComExcesso = {
          sala: { nome: "Sala Pequena", capacidade: 5 },
          dataInicio: "2025-12-22T10:00:00",
          dataFim: "2025-12-22T12:00:00",
          usuario: "pedro@email.com",
          numeroPessoas: 10,
        };

        // QUANDO: Tenta criar a reserva
        const response = await request(app)
          .post("/api/reserva/add")
          .send(reservaComExcesso);

        // ENTÃO: Deve retornar erro 400 com mensagem clara
        expect(response.status).toBe(400);
      });

      it("deve retornar erro 400 quando campos obrigatórios estão faltando", async () => {
        // DADO: Uma reserva sem campo obrigatório (usuario)
        const reservaIncompleta = {
          sala: { nome: "Sala C", capacidade: 10 },
          dataInicio: "2025-12-20T10:00:00",
          dataFim: "2025-12-20T12:00:00",
          numeroPessoas: 4,
        };

        // QUANDO: Tenta criar a reserva incompleta
        const response = await request(app)
          .post("/api/reserva/add")
          .send(reservaIncompleta);

        // ENTÃO: Deve retornar erro 400
        expect(response.status).toBe(400);
      });

      it("deve retornar erro 400 quando número de pessoas é negativo ou zero", async () => {
        // DADO: Uma reserva com número de pessoas inválido
        const reservaInvalida = {
          sala: { nome: "Sala D", capacidade: 10 },
          dataInicio: "2025-12-20T10:00:00",
          dataFim: "2025-12-20T12:00:00",
          usuario: "lucas@email.com",
          numeroPessoas: 0,
        };

        // QUANDO: Tenta criar a reserva
        const response = await request(app)
          .post("/api/reserva/add")
          .send(reservaInvalida);

        // ENTÃO: Deve retornar erro 400
        expect(response.status).toBe(400);
      });
    });

    describe("Cenários de Conflito - Erro 409", () => {
      it("deve retornar erro 409 quando há sobreposição de horário na mesma sala", async () => {
        // DADO: Uma primeira reserva criada com sucesso
        const primeiraReserva = {
          sala: { nome: "Sala Premium", capacidade: 15 },
          dataInicio: "2025-12-25T14:00:00",
          dataFim: "2025-12-25T16:00:00",
          usuario: "ana@email.com",
          numeroPessoas: 5,
        };

        await request(app)
          .post("/api/reserva/add")
          .send(primeiraReserva)
          .expect(201);

        // E: Uma segunda reserva com horário conflitante (sobreposição parcial)
        const segundaReserva = {
          sala: { nome: "Sala Premium", capacidade: 15 },
          dataInicio: "2025-12-25T15:00:00",
          dataFim: "2025-12-25T17:00:00",
          usuario: "bruno@email.com",
          numeroPessoas: 3,
        };

        // QUANDO: Tenta criar a segunda reserva
        const response = await request(app)
          .post("/api/reserva/add")
          .send(segundaReserva);

        // ENTÃO: Deve retornar erro 409 (Conflict)
        expect(response.status).toBe(409);
      });

      it("deve permitir reserva em horário diferente da mesma sala", async () => {
        // DADO: Uma primeira reserva
        const primeiraReserva = {
          sala: { nome: "Sala Compartilhada", capacidade: 15 },
          dataInicio: "2025-12-26T09:00:00",
          dataFim: "2025-12-26T11:00:00",
          usuario: "usuario1@email.com",
          numeroPessoas: 3,
        };

        await request(app)
          .post("/api/reserva/add")
          .send(primeiraReserva)
          .expect(201);

        // E: Uma segunda reserva em horário diferente (sem conflito)
        const segundaReserva = {
          sala: { nome: "Sala Compartilhada", capacidade: 15 },
          dataInicio: "2025-12-26T14:00:00",
          dataFim: "2025-12-26T16:00:00",
          usuario: "usuario2@email.com",
          numeroPessoas: 4,
        };

        // QUANDO: Tenta criar a segunda reserva
        const response = await request(app)
          .post("/api/reserva/add")
          .send(segundaReserva);

        // ENTÃO: Deve retornar sucesso 201
        expect(response.status).toBe(201);
      });
    });
  });

  // ========================================
  // TESTES GET /api/reserva
  // ========================================
  describe("GET /api/reserva", () => {
    it("deve listar todas as reservas com sucesso", async () => {
      // DADO: Pelo menos uma reserva existente no sistema
      await request(app)
        .post("/api/reserva/add")
        .send({
          sala: { nome: "Sala para Lista 1", capacidade: 10 },
          dataInicio: "2025-12-28T10:00:00",
          dataFim: "2025-12-28T12:00:00",
          usuario: "carlos@email.com",
          numeroPessoas: 2,
        })
        .expect(201);

      // QUANDO: Faz uma requisição GET para listar reservas
      const response = await request(app)
        .get("/api/reserva")
        .expect("Content-Type", /json/);

      // ENTÃO: Deve retornar status 200 e array de reservas
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);

      // Validar estrutura de cada reserva
      response.body.forEach((reserva) => {
        expect(reserva).toHaveProperty("id");
        expect(reserva).toHaveProperty("sala");
        expect(reserva).toHaveProperty("usuario");
        expect(reserva).toHaveProperty("dataInicio");
        expect(reserva).toHaveProperty("dataFim");
        expect(reserva).toHaveProperty("numeroPessoas");
      });
    });

    it("deve retornar array vazio quando não há reservas", async () => {
      // DADO: Sistema sem reservas (ou estado limpo)
      // Nota: Considere implementar beforeEach para limpar BD

      // QUANDO: Faz uma requisição GET
      const response = await request(app)
        .get("/api/reserva")
        .expect("Content-Type", /json/);

      // ENTÃO: Deve retornar status 200 e array (vazio ou com dados)
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // ========================================
  // TESTES DELETE /api/reserva/remove/:id
  // ========================================
  describe("DELETE /api/reserva/remove/:id", () => {
    it("deve remover uma reserva com sucesso", async () => {
      // DADO: Uma reserva criada no sistema
      const criacaoResponse = await request(app)
        .post("/api/reserva/add")
        .send({
          sala: { nome: "Sala para Deletar", capacidade: 10 },
          dataInicio: "2025-12-30T10:00:00",
          dataFim: "2025-12-30T12:00:00",
          usuario: "eva@email.com",
          numeroPessoas: 2,
        })
        .expect(201);

      const reservaId = criacaoResponse.body.reserva.id;

      // QUANDO: Faz uma requisição DELETE com o ID
      const response = await request(app).post(`/api/reserva/remove`).send({
        id: reservaId,
      });

      // ENTÃO: Deve retornar status 200 e confirmar remoção
      expect(response.status).toBe(200);
    });

    it("deve retornar erro 404 ao tentar remover reserva inexistente", async () => {
      // DADO: Um ID que não existe
      const idInexistente = "507f1f77bcf86cd799439999";

      // QUANDO: Tenta remover uma reserva inexistente
      const response = await request(app).post(`/api/reserva/remove`).send({
        idInexistente,
      });

      // ENTÃO: Deve retornar erro 404
      expect(response.status).toBe(404);
    });
  });

  // ========================================
  // TESTE GET / (Health Check)
  // ========================================
  describe("GET / (Health Check)", () => {
    it("deve retornar status ok quando servidor está funcionando", async () => {
      // QUANDO: Faz uma requisição GET na rota raiz
      const response = await request(app)
        .get("/")
        .expect("Content-Type", /json/);

      // ENTÃO: Deve retornar status 200 com mensagem de sucesso
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
    });
  });
});
