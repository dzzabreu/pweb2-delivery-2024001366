# Delivery Tracker — Exercício do Capítulo 4

> **Programação Web II — IFAL/Maceió.** Este é o **projeto do semestre** (avaliado). No Cap. 4 você
> inicia a **Delivery Tracker API** com **arquitetura em camadas** e, depois, **Repository Pattern +
> injeção de dependência**. A correção é **automática** (autograder de conformidade) + arquitetura.

## Como usar este repositório

1. Clique em **"Use this template"** e crie **`pweb2-delivery-<matricula>`** (ex.: `pweb2-delivery-20231012345`).
   Este é o repositório que você usará o **semestre inteiro** (evolui a cada capítulo).
2. Clone, instale e rode:
   ```bash
   npm install
   npm start                                        # http://localhost:3000
   # em outro terminal — autograder:
   npm run check                                    # = BASE_URL=http://localhost:3000 node autograder/check.mjs
   ```
3. A cada `git push`, o **GitHub Actions** roda o autograder e mostra a nota na aba **Actions**
   (resumo do job). O `autograder/check.mjs` é **aberto** — leia para saber exatamente o que se espera.

## O que implementar (em `src/`)

```
src/
├── controllers/   # traduz HTTP ↔ service (sem regra de negócio)
├── services/      # TODA a regra de negócio
├── repositories/  # só acesso a dados
├── database/      # persistência SIMULADA em memória (sem banco real, sem ORM)
├── routes/        # composição das dependências (injeção) + monta em /api
└── utils/
```

- **Regra de negócio só no Service.** Injeção de dependência no **composition root** (`src/routes`).
- O `server.js` só configura o app (já traz o `GET /api/health` exigido — não remova).

## Duas etapas (ver os enunciados completos)

- **Atividade 05 — Entregas em camadas:** CRUD de `/api/entregas`, ciclo de status
  (`CRIADA → EM_TRANSITO → ENTREGUE`/`CANCELADA`), histórico. Meta: checagens de **Entregas** verdes.
- **Atividade 06 — Motoristas + Contratos + DI:** `/api/motoristas`, atribuição de motorista,
  contratos de repository (JSDoc) e composição num ponto único. Meta: **122/122**.

> O critério de **inversão de dependência** é verificado pelo professor **trocando o repository por
> um Mock** que respeita o contrato — programe contra o contrato desde o início.

## Contrato (resumo)

- Base `/api` · JSON · erro `{ "erro": "..." }` · `GET /api/health` → `{ "status": "ok" }`.
- Status: `201` criar · `400` entrada inválida · `404` não encontrado · `409` unicidade
  (duplicata/CPF) · `422` regra de estado (transição/atribuição inválida).
- Execução: `npm start`, respeita `process.env.PORT`, branch `main`.

Faça **um commit por avanço** (Conventional Commits, ex.: `feat(entregas): valida origem ≠ destino`).
Bom trabalho! 🚀

---

## Status da Atividade 05 (Entregas) — Concluída

Módulo de entregas totalmente implementado com arquitetura em camadas (Controller, Service, Repository) e injeção de dependência.

### Exemplos de Requisições Manuais (cURL)

```bash
# 1. Criar uma nova entrega
curl -X POST http://localhost:3000/api/entregas \
  -H "Content-Type: application/json" \
  -d '{"descricao": "Pacote de Livros", "origem": "Maceió", "destino": "Recife"}'

# 2. Listar todas as entregas
curl http://localhost:3000/api/entregas

# 3. Filtrar entregas por status
curl "http://localhost:3000/api/entregas?status=CRIADA"

# 4. Buscar entrega por ID
curl http://localhost:3000/api/entregas/1

# 5. Avançar status da entrega (CRIADA -> EM_TRANSITO -> ENTREGUE)
curl -X PATCH http://localhost:3000/api/entregas/1/avancar

# 6. Obter histórico da entrega
curl http://localhost:3000/api/entregas/1/historico

# 7. Cancelar entrega
curl -X PATCH http://localhost:3000/api/entregas/1/cancelar

```

## Status da Atividade 06 (Motoristas) — Concluída

Módulo de motoristas, atribuição de entregas, filtros combinados e injeção de dependências totalmente implementados com 100% de aprovação no autograder (**122/122 pontos**).

### Exemplos de Requisições Manuais (cURL)

```bash
# 1. Cadastrar um novo motorista
curl -X POST http://localhost:3000/api/motoristas \
  -H "Content-Type: application/json" \
  -d '{"nome": "Carlos Silva", "cpf": "12345678900", "placaVeiculo": "ABC-1234"}'

# 2. Listar todos os motoristas
curl http://localhost:3000/api/motoristas

# 3. Buscar motorista por ID
curl http://localhost:3000/api/motoristas/1

# 4. Atribuir motorista a uma entrega
curl -X PATCH http://localhost:3000/api/entregas/1/atribuir \
  -H "Content-Type: application/json" \
  -d '{"motoristaId": 1}'

# 5. Listar entregas atreladas a um motorista
curl http://localhost:3000/api/motoristas/1/entregas

# 6. Filtrar entregas de um motorista por status
curl "http://localhost:3000/api/motoristas/1/entregas?status=CRIADA"

```