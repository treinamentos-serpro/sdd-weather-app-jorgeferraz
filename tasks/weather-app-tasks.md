# Backlog de Tarefas — Weather App

> **Entrada:** [plans/weather-app-plan.md](../plans/weather-app-plan.md)
> **Fonte da verdade de requisitos:** [specs/weather-app-spec.md](../specs/weather-app-spec.md)
>
> Cada tarefa é uma unidade **pequena, testável e verificável isoladamente**.
> Nenhuma tarefa mistura UI + dados + testes: quando isso aconteceria, ela foi
> quebrada em subtarefas.

## Legenda

| Campo | Valores | Significado |
| --- | --- | --- |
| **Tipo** | `Infra` | Configuração, bootstrap, tooling, gates de qualidade |
| | `Data` | Tipos, funções puras, services, hooks (sem JSX) |
| | `UI` | Componentes React e composição de tela |
| | `Test` | Testes unitários, de componente, integração ou E2E |
| **Prioridade** | `P0` | Bloqueia o MVP — sem isso não há produto entregável |
| | `P1` | Necessário para aceite completo da spec (a11y, E2E, hardening) |
| | `P2` | Melhoria registrada como gap no plano; não bloqueia o MVP |
| **Tamanho** | `P` | 1 arquivo, escopo trivial |
| | `M` | 1–2 arquivos com lógica relevante |
| | `G` | Evitado neste backlog — se aparecer, deve ser quebrado |

**Ordem de implementação adotada:**
`Infra → tipos → funções puras → services → hooks → componentes → integração → testes E2E → hardening`

## Índice de entregas

| Entrega | Tarefas | Objetivo |
| --- | --- | --- |
| [E0 — Fundação](#e0--fundação) | T-01 … T-03 | Aplicação roda, testes rodam, fixtures existem |
| [E1 — Contratos de tipos](#e1--contratos-de-tipos) | T-04 … T-06 | Tipos compartilhados entre camadas |
| [E2 — Funções puras (lib)](#e2--funções-puras-lib) | T-07 … T-13 | Conversão, mapeamento e formatação testáveis sem mocks |
| [E3 — Camada HTTP e services](#e3--camada-http-e-services) | T-14 … T-22 | Acesso ao Open-Meteo isolado e resiliente |
| [E4 — Hooks de estado](#e4--hooks-de-estado) | T-23 … T-28 | Orquestração de `RequestState` e unidade |
| [E5 — Shell e componentes de estado](#e5--shell-e-componentes-de-estado) | T-29 … T-34 | Loading, vazio e erro visíveis |
| [E6 — Componentes de conteúdo](#e6--componentes-de-conteúdo) | T-35 … T-46 | Busca, desambiguação, clima, previsão, unidade |
| [E7 — Integração da aplicação](#e7--integração-da-aplicação) | T-47 … T-50 | Fluxo completo montado em `App` |
| [E8 — Testes E2E](#e8--testes-e2e) | T-51 … T-57 | Fluxos ponta a ponta (Chromium + iPhone 13) |
| [E9 — Hardening e fechamento](#e9--hardening-e-fechamento) | T-58 … T-62 | Responsividade, a11y, gates e rastreabilidade |
| E10 — Primeira entrega: UI com fixture | P6.0 … P6.15 | Interface completa e navegável sem API |

## E10 — Primeira entrega: UI com fixture

> Esta entrega usa um fixture local de `WeatherData`, sem hooks, services ou
> chamadas de rede. Os estados vivem temporariamente em `App`, permitindo
> validar UI e acessibilidade antes da integração assíncrona.
>
> **Nota:** umidade, vento, precipitação, pressão e probabilidade de chuva não
> pertencem ao contrato atual. P6.0 formaliza esses campos antes de haver uma
> implementação dependente deles.

### P6.0 — Formalizar os dados adicionais da entrega

**Tipo:** Data · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** —
**Requisitos:** RF03, RF05; extensão solicitada

**Arquivos:** `specs/weather-app-spec.md`, `plans/weather-app-plan.md`

**Critérios de aceite:**

- [ ] Define umidade, vento, precipitação e pressão para `CurrentWeather`, com unidades e regra de dado ausente.
- [ ] Define probabilidade de chuva para `ForecastDay`, com unidade e regra de dado ausente.
- [ ] Atualiza o contrato da API no plano ou delimita explicitamente esses dados ao fixture desta entrega.
- [ ] Mantém Celsius como fonte de verdade e conversão na renderização.

### P6.1 — Criar tipos e fixture de clima

**Tipo:** Data · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** P6.0
**Requisitos:** RF03–RF07

**Arquivos:** `src/types/weather.ts`, `src/fixtures/weatherData.ts`

**Critérios de aceite:**

- [ ] Exporta `Unit` como `'celsius' | 'fahrenheit'` e os tipos `CurrentWeather`, `ForecastDay` e `WeatherData` segundo o plano atualizado.
- [ ] Todas as temperaturas persistidas são Celsius; não há campo em Fahrenheit.
- [ ] Exporta um `WeatherData` de cidade exemplo, clima atual completo e exatamente 5 dias cronológicos.
- [ ] O fixture contém as quatro métricas atuais e a probabilidade de chuva diária, sem rede ou `any`.

### P6.2 — Testar tipos e fixture

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** P6.1
**Requisitos:** RF03–RF05

**Arquivos:** `tests/unit/fixtures/weatherData.test.ts`

**Critérios de aceite:**

- [ ] O fixture satisfaz estaticamente `WeatherData`.
- [ ] Valida cidade, clima atual, métricas e cinco datas únicas em ordem.
- [ ] Não executa requisições de rede.

### P6.3 — Implementar `SearchBar`

**Tipo:** UI · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** —
**Requisitos:** RF01, RNF02, RNF09

**Arquivos:** `src/components/SearchBar.tsx`

**Critérios de aceite:**

- [ ] Renderiza formulário com `role="search"`, label associada ao input e botão com nome acessível em pt-BR.
- [ ] Recebe `onSearch(city: string)` e `disabled`, propagando o estado desabilitado ao input e botão.
- [ ] Enter e clique chamam `onSearch` uma vez com o valor tratado por `trim()`.
- [ ] Valor vazio ou composto só por espaços não chama `onSearch`.
- [ ] Usa Tailwind glassmorphism, foco visível e layout responsivo.

### P6.4 — Testar `SearchBar`

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** P6.3
**Requisitos:** RF01, RNF02

**Arquivos:** `tests/unit/components/SearchBar.test.tsx`

**Critérios de aceite:**

- [ ] Consulta elementos por role e label, sem `data-testid`.
- [ ] Cobre Enter, clique, trim, valor vazio e `disabled`.
- [ ] Confirma que digitar sem submeter não busca.

### P6.5 — Implementar `UnitToggle`

**Tipo:** UI · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** P6.1
**Requisitos:** RF06, RF07, RNF02

**Arquivos:** `src/components/UnitToggle.tsx`

**Critérios de aceite:**

- [ ] Recebe `unit` e `onChange(unit: Unit)` por props, sem estado duplicado.
- [ ] Renderiza `role="group"` com `aria-label` em pt-BR e dois botões: `°C` e `°F`.
- [ ] Expõe o ativo por `aria-pressed` e possui foco visível.
- [ ] Clique, Enter e Espaço acionam a unidade correspondente.

### P6.6 — Testar `UnitToggle`

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** P6.5
**Requisitos:** RF06, RNF02

**Arquivos:** `tests/unit/components/UnitToggle.test.tsx`

**Critérios de aceite:**

- [ ] Verifica grupo acessível e `aria-pressed` nos dois botões.
- [ ] Verifica `onChange` por clique, Enter e Espaço.
- [ ] Confirma que uma nova prop marca a nova unidade ativa.

### P6.7 — Implementar `CurrentWeather`

**Tipo:** UI · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** P6.1, T-08, T-10
**Requisitos:** RF03, RF05, RF07

**Arquivos:** `src/components/CurrentWeather.tsx`

**Critérios de aceite:**

- [ ] Recebe `city`, `current` e `unit`; exibe hero com cidade, temperatura grande, condição e ícone de `lib/weatherCodes`.
- [ ] Usa `formatTemperature` de `lib/temperature`; não converte nem arredonda localmente.
- [ ] Exibe umidade, vento, precipitação e pressão com rótulos e unidades.
- [ ] Código sem mapeamento aparece como `Indisponível`, nunca como número bruto.

### P6.8 — Testar `CurrentWeather`

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** P6.7
**Requisitos:** RF03, RF05, RF07

**Arquivos:** `tests/unit/components/CurrentWeather.test.tsx`

**Critérios de aceite:**

- [ ] Verifica cidade, condição, quatro métricas e temperatura em Celsius.
- [ ] Verifica temperatura convertida em Fahrenheit.
- [ ] Verifica `Indisponível` para código desconhecido.

### P6.9 — Implementar `ForecastCard`

**Tipo:** UI · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** P6.1, T-08, T-10, T-12
**Requisitos:** RF04, RF05, RF07

**Arquivos:** `src/components/ForecastCard.tsx`

**Critérios de aceite:**

- [ ] Recebe um `ForecastDay` e `unit`; exibe rótulo do dia por `lib/format`, ícone/condição e máxima/mínima por `lib/temperature`.
- [ ] Exibe probabilidade de chuva com rótulo acessível.
- [ ] Cada valor nulo aparece como `Indisponível`, sem remover o card.
- [ ] O ícone fornece alternativa textual para leitor de tela.

### P6.10 — Implementar `ForecastList`

**Tipo:** UI · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** P6.9
**Requisitos:** RF04, RNF01

**Arquivos:** `src/components/ForecastList.tsx`

**Critérios de aceite:**

- [ ] Recebe previsão e unidade por props e renderiza um `ForecastCard` por dia em ordem cronológica.
- [ ] Usa `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`.
- [ ] Mantém título e lista semanticamente acessíveis e sem rolagem horizontal em tela estreita.

### P6.11 — Testar `ForecastCard` e `ForecastList`

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** P6.10
**Requisitos:** RF04, RF05, RF07

**Arquivos:** `tests/unit/components/ForecastCard.test.tsx`, `tests/unit/components/ForecastList.test.tsx`

**Critérios de aceite:**

- [ ] Confirma data, condição, máxima, mínima e probabilidade de chuva no card.
- [ ] Confirma Fahrenheit e o tratamento de valores nulos.
- [ ] Confirma que cinco dias geram cinco cards cronológicos.

### P6.12 — Implementar os componentes de estado

**Tipo:** UI · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** —
**Requisitos:** RF08–RF10, RNF03

**Arquivos:** `src/components/states/LoadingState.tsx`, `src/components/states/ErrorState.tsx`, `src/components/states/EmptyState.tsx`

**Critérios de aceite:**

- [ ] `LoadingState` tem `role="status"` e texto em pt-BR, não apenas cor ou animação.
- [ ] `ErrorState` recebe mensagem e `onRetry`, expõe `role="alert"` e botão `Tentar novamente` quando aplicável.
- [ ] `EmptyState` contém título e dica em pt-BR.
- [ ] Os três usam visual glassmorphism, contraste e foco visível.

### P6.13 — Testar os componentes de estado

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** P6.12
**Requisitos:** RF08–RF10, RNF03

**Arquivos:** `tests/unit/components/states/LoadingState.test.tsx`, `tests/unit/components/states/ErrorState.test.tsx`, `tests/unit/components/states/EmptyState.test.tsx`

**Critérios de aceite:**

- [ ] Verifica role e texto do loading.
- [ ] Verifica role, mensagem e chamada de nova tentativa no erro.
- [ ] Verifica título e dica no estado vazio.

### P6.14 — Integrar a UI com o fixture em `App`

**Tipo:** UI · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** P6.2, P6.4, P6.6, P6.8, P6.11, P6.13
**Requisitos:** RF01, RF03–RF10, RNF01, RNF02

**Arquivos:** `src/App.tsx`

**Critérios de aceite:**

- [ ] Header contém marca, `SearchBar` e `UnitToggle`; Celsius é a unidade inicial do estado local.
- [ ] Alterna explicitamente entre `idle`, `loading`, `empty`, `error` e `success`.
- [ ] Em sucesso, usa apenas o fixture e renderiza `CurrentWeather` e `ForecastList`.
- [ ] Uma busca válida transita por loading até sucesso; busca vazia não altera o estado.
- [ ] Trocar unidade atualiza clima atual e previsão sem alterar fixture ou chamar rede.
- [ ] Permite exercitar vazio e erro de modo determinístico durante o desenvolvimento, com mensagem compreensível.

### P6.15 — Testar a integração da primeira entrega

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** P6.14
**Requisitos:** RF01, RF03–RF10

**Arquivos:** `tests/unit/App.test.tsx`

**Critérios de aceite:**

- [ ] Cobre estado inicial, busca válida até sucesso, busca vazia, vazio e erro.
- [ ] Cobre troca de unidade em temperatura atual e em um card da previsão.
- [ ] Cobre o botão de nova tentativa.
- [ ] Não executa requisições de rede em nenhum cenário.

## E0 — Fundação

### T-01 — Bootstrap da SPA React + Tailwind

**Tipo:** Infra · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** —
**Requisitos:** RNF01, RNF07, RNF10

Criar o ponto de entrada da aplicação consumido por
[index.html](../index.html) (`/src/main.tsx`), a folha de estilo com as
diretivas do Tailwind e um `App` mínimo, para que `pnpm dev` e `pnpm build`
funcionem antes de qualquer feature.

**Arquivos:** `src/main.tsx`, `src/App.tsx`, `src/index.css`

**Critérios de aceite:**

- [ ] `pnpm dev` sobe em `http://localhost:5173` e renderiza `App` no `#root` sem erros no console.
- [ ] `src/index.css` contém `@tailwind base/components/utilities` e é importado por `src/main.tsx`.
- [ ] O `body` aplica o tema dark base (`bg-night-900`, texto claro) definido em [tailwind.config.js](../tailwind.config.js).
- [ ] `pnpm build` conclui sem erro de TypeScript.
- [ ] `pnpm lint` passa sem violações.

### T-02 — Setup do ambiente de testes unitários

**Tipo:** Infra · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-01
**Requisitos:** Testing Strategy (plano)

Criar o `setupFiles` já referenciado por [vite.config.ts](../vite.config.ts)
(`./tests/setup.ts`), registrando os matchers do `@testing-library/jest-dom` e
a limpeza automática entre testes.

**Arquivos:** `tests/setup.ts`

**Critérios de aceite:**

- [ ] `pnpm test` executa sem erro de configuração, mesmo com a suíte vazia.
- [ ] `@testing-library/jest-dom/vitest` está importado e `cleanup()` roda após cada teste.
- [ ] Um teste-canário (`expect(document.body).toBeInTheDocument()`) passa usando um matcher do jest-dom.

### T-03 — Fixtures de resposta do Open-Meteo

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-02
**Requisitos:** Data Requirements, Edge Cases (resposta parcial, sem resultados)

Centralizar payloads JSON determinísticos das APIs de Geocoding e Forecast,
reutilizados pelos testes de service, de integração e E2E — evitando duplicar
mocks em cada arquivo de teste.

**Arquivos:** `tests/fixtures/openMeteo.ts`

**Critérios de aceite:**

- [ ] Exporta fixture de geocoding com **1 resultado**, com **3 resultados homônimos**, com **7 resultados** (para validar o corte em 5) e com `results` ausente/vazio.
- [ ] Exporta fixture de forecast **completa** (5 dias) e **parcial** (dia com `temperature_2m_min: null` e `weather_code: null`, e variante com apenas 3 dias).
- [ ] Todos os payloads seguem exatamente o formato documentado em [External APIs](../plans/weather-app-plan.md#external-apis).
- [ ] Nenhuma fixture faz chamada de rede real.

## E1 — Contratos de tipos

### T-04 — Tipo `City`

**Tipo:** Data · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-01
**Requisitos:** RF01, RF02, Data Requirements

**Arquivos:** `src/types/city.ts`

**Critérios de aceite:**

- [ ] `City` declara `id`, `name`, `admin1?`, `country`, `countryCode?`, `latitude`, `longitude`, `timezone`, conforme o [Data Model](../plans/weather-app-plan.md#data-model).
- [ ] Campos opcionais são exatamente aqueles que a fonte pode não fornecer (`admin1`, `countryCode`).
- [ ] `pnpm build` compila em modo strict sem `any`.

### T-05 — Tipos de clima (`Unit`, `CurrentWeather`, `ForecastDay`, `WeatherData`)

**Tipo:** Data · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-04
**Requisitos:** RF03, RF04, RF05, RF06

**Arquivos:** `src/types/weather.ts`

**Critérios de aceite:**

- [ ] `Unit` é a união literal `'celsius' | 'fahrenheit'`.
- [ ] Temperaturas são armazenadas **apenas em Celsius** (`temperatureC`, `temperatureMaxC`, `temperatureMinC`); nenhum campo em Fahrenheit existe no modelo.
- [ ] `ForecastDay` admite `null` em `weatherCode`, `temperatureMaxC` e `temperatureMinC` (dado ausente, RF05), mas **não** em `date`.
- [ ] `WeatherData` agrega `city`, `current` e `forecast: ForecastDay[]`.

### T-06 — Tipo `RequestState<T>`

**Tipo:** Data · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-01
**Requisitos:** RF08, RF09, RF10, RNF06

**Arquivos:** `src/types/requestState.ts`

**Critérios de aceite:**

- [ ] União discriminada por `status` com exatamente cinco variantes: `idle`, `loading`, `success`, `empty`, `error`.
- [ ] A variante `error` carrega `message: string` e `kind: 'network' | 'api' | 'timeout' | 'unknown'`.
- [ ] Um `switch` exaustivo sobre `status` compila sem `default` obrigatório (verificado por `never` check).

## E2 — Funções puras (lib)

### T-07 — Conversão e arredondamento de temperatura

**Tipo:** Data · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-05
**Requisitos:** RF07, Data Requirements

Implementar `celsiusToFahrenheit` e `roundTemperature` (round-half-away-from-zero)
como funções puras, sem I/O.

**Arquivos:** `src/lib/temperature.ts`

**Critérios de aceite:**

- [ ] `celsiusToFahrenheit(c)` aplica $°F = °C \times 9/5 + 32$ **sem arredondar** (mantém precisão para o chamador).
- [ ] `roundTemperature(21.5) === 22` e `roundTemperature(-21.5) === -22` (half-away-from-zero, e **não** `Math.round`).
- [ ] Nenhuma função acessa `fetch`, `Date.now()`, `window` ou qualquer estado externo.

### T-08 — `formatTemperature(temperatureC, unit)`

**Tipo:** Data · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-07
**Requisitos:** RF05, RF06, RF07, RNF07

**Arquivos:** `src/lib/temperature.ts`

**Critérios de aceite:**

- [ ] `formatTemperature(21.4, 'celsius') === '21 °C'`.
- [ ] `formatTemperature(21.4, 'fahrenheit') === '71 °F'` (70,52 arredondado).
- [ ] `formatTemperature(null, unit)` retorna o rótulo `'Indisponível'` em pt-BR para qualquer unidade, sem lançar exceção.
- [ ] O mesmo valor em Celsius produz sempre a mesma string, independentemente do componente chamador (função determinística).

### T-09 — Testes unitários de `temperature`

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-02, T-08
**Requisitos:** RF05, RF07

**Arquivos:** `tests/unit/lib/temperature.test.ts`

**Critérios de aceite:**

- [ ] Cobre conversão com valores positivo, negativo e zero (`0 °C → 32 °F`, `-40 °C → -40 °F`).
- [ ] Cobre explicitamente as fronteiras `.5` positiva e negativa (round-half-away-from-zero).
- [ ] Cobre `null` → `'Indisponível'` nas duas unidades.
- [ ] Inclui teste de consistência: a mesma temperatura em Celsius usada em dois pontos produz strings idênticas após conversão (RF07).
- [ ] Nenhum mock é utilizado.

### T-10 — Mapeamento de códigos WMO para rótulos pt-BR

**Tipo:** Data · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-01
**Requisitos:** RF03, RF05, RNF07, Data Requirements

**Arquivos:** `src/lib/weatherCodeMap.ts`

**Critérios de aceite:**

- [ ] `mapWeatherCodeToLabel(code)` retorna rótulo em pt-BR para todos os códigos WMO documentados pelo Open-Meteo (0–3, 45, 48, 51–57, 61–67, 71–77, 80–82, 85, 86, 95, 96, 99).
- [ ] Código desconhecido (ex.: `999`) retorna `undefined`.
- [ ] `mapWeatherCodeToLabel(null)` retorna `undefined`, sem lançar exceção.
- [ ] O mapa é uma constante `as const`, sem I/O nem dependência de React.

### T-11 — Testes unitários de `weatherCodeMap`

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-02, T-10
**Requisitos:** RF05

**Arquivos:** `tests/unit/lib/weatherCodeMap.test.ts`

**Critérios de aceite:**

- [ ] Verifica ao menos um código de cada família (céu limpo, névoa, chuva, neve, tempestade).
- [ ] Verifica que código desconhecido e `null` retornam `undefined`.
- [ ] Verifica que nenhum rótulo retornado é um número em formato de texto (nunca expõe código bruto ao usuário).

### T-12 — Formatação de data da previsão (fuso da cidade)

**Tipo:** Data · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-05
**Requisitos:** RF04, RF05, RNF07, Edge Case "fuso horário"

Função pura que converte a data `YYYY-MM-DD` retornada pela API (já no fuso da
cidade) em um rótulo pt-BR, **sem** reinterpretar a string no fuso do
dispositivo — evitando deslocar o dia.

> Extensão do plano: o plano prevê a exibição da data em `ForecastDayCard`, mas
> não isola a formatação. Isolá-la mantém o componente livre de lógica e
> permite testar o edge case de fuso sem renderizar DOM.

**Arquivos:** `src/lib/formatDate.ts`

**Critérios de aceite:**

- [ ] `formatForecastDate('2026-09-02')` retorna rótulo pt-BR curto (ex.: `'ter, 02/09'`).
- [ ] O resultado é idêntico independentemente do fuso do processo (validado com `TZ` simulado em UTC−11 e UTC+13): nunca desloca o dia.
- [ ] Retorna também o valor bruto `YYYY-MM-DD` para uso em `dateTime` de `<time>`.
- [ ] Não usa `new Date(string)` com parsing dependente de fuso local.

### T-13 — Testes unitários de `formatDate`

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-02, T-12
**Requisitos:** RF04, Edge Case "fuso horário"

**Arquivos:** `tests/unit/lib/formatDate.test.ts`

**Critérios de aceite:**

- [ ] Testa a mesma data com ao menos dois fusos de sistema distintos e espera saída idêntica.
- [ ] Testa virada de mês e de ano (`2026-12-31` → `2027-01-01`).
- [ ] Nenhum mock de rede é utilizado.

## E3 — Camada HTTP e services

### T-14 — Cliente HTTP com timeout e cancelamento

**Tipo:** Data · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-06
**Requisitos:** RF09, RNF04, RNF06, RNF12

Implementar `fetchJson(url, signal)`: faz `fetch` HTTPS, aplica timeout de 10s
via `AbortController` + `setTimeout`, e traduz qualquer falha para o `kind` de
erro do `RequestState`.

> Extensão do plano: evita duplicar a lógica de timeout/abort entre
> `geocodingService` e `weatherService` (a regra de 10s precisa existir em um
> único lugar testável).

**Arquivos:** `src/services/httpClient.ts`

**Critérios de aceite:**

- [ ] Rejeita com `kind: 'timeout'` quando não há resposta em **10.000 ms** (verificável com timers falsos).
- [ ] Resposta HTTP não-2xx produz `kind: 'api'`; `fetch` rejeitado produz `kind: 'network'`; JSON inválido produz `kind: 'api'`.
- [ ] Aceita um `AbortSignal` externo; abort externo **não** é classificado como `timeout`.
- [ ] Nenhuma mensagem retornada contém código HTTP bruto, URL ou stack trace (RF09).
- [ ] O timer de timeout é sempre limpo (`clearTimeout`) em sucesso e em falha.

### T-15 — Testes unitários do `httpClient`

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-02, T-14
**Requisitos:** RF09, RNF06, RNF12

**Arquivos:** `tests/unit/services/httpClient.test.ts`

**Critérios de aceite:**

- [ ] `fetch` é mockado com `vi.stubGlobal`; nenhuma requisição real é feita.
- [ ] Casos cobertos: sucesso 200, erro 500, `fetch` rejeitado, JSON malformado, timeout de 10s, abort externo.
- [ ] O teste de timeout usa `vi.useFakeTimers()` e avança exatamente 10.000 ms.
- [ ] Verifica que `clearTimeout` foi chamado no caminho de sucesso.

### T-16 — `geocodingService`: montagem e envio da requisição

**Tipo:** Data · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-14
**Requisitos:** RF01, RNF04, Edge Case "caracteres especiais"

**Arquivos:** `src/services/geocodingService.ts`

**Critérios de aceite:**

- [ ] A URL usada é `https://geocoding-api.open-meteo.com/v1/search` com `count=5`, `language=pt` e `format=json`.
- [ ] O termo é codificado via `URLSearchParams` — `"São Paulo"` e `"!!city??"` produzem URLs válidas, sem quebrar a chamada.
- [ ] Recebe e repassa um `AbortSignal` opcional para o `httpClient`.
- [ ] Não contém JSX nem importa React.

### T-17 — `geocodingService`: normalização para `City[]`

**Tipo:** Data · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-04, T-16
**Requisitos:** RF02, RF10, Data Requirements

**Arquivos:** `src/services/geocodingService.ts`

**Critérios de aceite:**

- [ ] Cada item de `results` é mapeado campo a campo para `City`, incluindo `country_code → countryCode`.
- [ ] Se a API retornar mais de 5 itens, apenas os **5 primeiros** são devolvidos, preservando a ordem original.
- [ ] `results` ausente ou array vazio retorna `[]` — tratado como estado vazio, **nunca** como erro.
- [ ] Item sem `admin1` ou sem `country_code` é mapeado com esses campos `undefined`, sem descartar o resultado.

### T-18 — Testes unitários do `geocodingService`

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-03, T-17
**Requisitos:** RF01, RF02, RF09, RF10

**Arquivos:** `tests/unit/services/geocodingService.test.ts`

**Critérios de aceite:**

- [ ] `fetch` mockado com as fixtures de T-03; nenhuma chamada real à API.
- [ ] Casos: 1 resultado, 3 homônimos, 7 resultados (espera exatamente 5), `results` vazio (espera `[]`), `results` ausente (espera `[]`).
- [ ] Casos de falha: erro HTTP → `kind: 'api'`; rede → `kind: 'network'`; timeout → `kind: 'timeout'`.
- [ ] Um teste assegura que o termo `"São Paulo"` aparece percent-encoded na URL chamada.

### T-19 — `weatherService`: montagem e envio da requisição

**Tipo:** Data · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-14
**Requisitos:** RF03, RF04, RNF04, Edge Case "fuso horário"

**Arquivos:** `src/services/weatherService.ts`

**Critérios de aceite:**

- [ ] A URL usada é `https://api.open-meteo.com/v1/forecast` com `latitude`, `longitude` da `City`, `current=temperature_2m,weather_code`, `daily=weather_code,temperature_2m_max,temperature_2m_min`, `timezone=auto` e `forecast_days=5`.
- [ ] Clima atual e previsão são obtidos em **uma única** requisição.
- [ ] Recebe e repassa um `AbortSignal` opcional.

### T-20 — `weatherService`: normalização de `current`

**Tipo:** Data · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-05, T-19
**Requisitos:** RF03

**Arquivos:** `src/services/weatherService.ts`

**Critérios de aceite:**

- [ ] `current.temperature_2m → temperatureC`, `current.weather_code → weatherCode`, `current.time → observedAt`, sem transformação de valor.
- [ ] Ausência do bloco `current` na resposta é tratada como erro `kind: 'api'` (o clima atual é obrigatório por RF03).
- [ ] Nenhum arredondamento é aplicado nesta camada (fica na apresentação).

### T-21 — `weatherService`: normalização de `daily` para `ForecastDay[]`

**Tipo:** Data · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-05, T-19
**Requisitos:** RF04, RF05, Edge Case "resposta parcial"

**Arquivos:** `src/services/weatherService.ts`

**Critérios de aceite:**

- [ ] Combina por índice `daily.time[i]`, `daily.weather_code[i]`, `daily.temperature_2m_max[i]`, `daily.temperature_2m_min[i]`.
- [ ] Valor ausente/`null` em um índice vira `null` no campo correspondente do `ForecastDay`, **sem descartar o dia**.
- [ ] Se `daily.time` tiver menos de 5 posições, retorna apenas os dias disponíveis, sem preencher artificialmente.
- [ ] Datas retornadas mantêm o formato `YYYY-MM-DD` do fuso da cidade, sem conversão para o fuso local.
- [ ] Dias retornados são únicos e em ordem cronológica crescente.

### T-22 — Testes unitários do `weatherService`

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-03, T-20, T-21
**Requisitos:** RF03, RF04, RF05, RF09

**Arquivos:** `tests/unit/services/weatherService.test.ts`

**Critérios de aceite:**

- [ ] `fetch` mockado com as fixtures de T-03; nenhuma chamada real à API.
- [ ] Caso feliz: retorna `WeatherData` com `current` preenchido e `forecast.length === 5`.
- [ ] Resposta parcial: dia com `temperature_2m_min: null` e `weather_code: null` continua presente, com campos `null`.
- [ ] Resposta com 3 dias retorna `forecast.length === 3`, sem erro.
- [ ] Falhas cobertas: HTTP 5xx (`api`), rede (`network`), timeout (`timeout`), bloco `current` ausente (`api`).
- [ ] Verifica que `timezone=auto` está presente na URL chamada.

## E4 — Hooks de estado

### T-23 — `UnitContext` + `useUnit`

**Tipo:** Data · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-05
**Requisitos:** RF06, RF07

**Arquivos:** `src/hooks/useUnit.tsx`

**Critérios de aceite:**

- [ ] Expõe `UnitProvider` e `useUnit()` retornando `{ unit, toggleUnit }`.
- [ ] O valor inicial é `'celsius'` (RF06).
- [ ] `toggleUnit()` alterna `celsius ↔ fahrenheit` e nada mais — nenhuma requisição é disparada.
- [ ] Nenhum valor é lido ou gravado em `localStorage`/`sessionStorage` (Out of Scope: sem persistência).
- [ ] `useUnit()` fora do provider lança erro descritivo em desenvolvimento.

### T-24 — Testes de `useUnit`

**Tipo:** Test · **Prioridade:** P1 · **Tamanho:** P · **Depende de:** T-02, T-23
**Requisitos:** RF06

**Arquivos:** `tests/unit/hooks/useUnit.test.tsx`

**Critérios de aceite:**

- [ ] Verifica valor padrão `'celsius'` no primeiro render.
- [ ] Verifica alternância de ida e volta com `renderHook` + `act`.
- [ ] Verifica que `localStorage.setItem` não é chamado (espião global).

### T-25 — `useCitySearch`

**Tipo:** Data · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-06, T-18
**Requisitos:** RF01, RF08, RF09, RF10, RNF05, Edge Cases "input vazio" e "buscas sucessivas"

**Arquivos:** `src/hooks/useCitySearch.ts`

**Critérios de aceite:**

- [ ] Expõe `{ state: RequestState<City[]>, search(term: string) }`, iniciando em `idle`.
- [ ] Termo vazio ou só com espaços **não** dispara requisição e não altera o estado para `loading`.
- [ ] Transições: `loading → success` (1+ cidades), `loading → empty` (lista vazia), `loading → error` (falha), com `kind` propagado do service.
- [ ] Nova busca antes da resposta anterior aborta a requisição em voo; apenas o resultado da busca **mais recente** chega ao estado.
- [ ] O hook não importa nada de `src/components/` e não contém JSX.

### T-26 — Testes de `useCitySearch`

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-02, T-25
**Requisitos:** RF01, RF08, RF09, RF10

**Arquivos:** `tests/unit/hooks/useCitySearch.test.ts`

**Critérios de aceite:**

- [ ] `geocodingService` é mockado (`vi.mock`); nenhum `fetch` real.
- [ ] Cobre `idle → loading → success`, `→ empty` e `→ error` (cada `kind`).
- [ ] Cobre termo `'   '`: o service **não** é chamado (`expect(spy).not.toHaveBeenCalled()`).
- [ ] Cobre corrida: duas buscas em sequência, a primeira resolvendo por último — o estado final corresponde à segunda busca e a primeira é abortada.

### T-27 — `useWeather`

**Tipo:** Data · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-06, T-22
**Requisitos:** RF03, RF04, RF08, RF09, RNF05

**Arquivos:** `src/hooks/useWeather.ts`

**Critérios de aceite:**

- [ ] Recebe `City | null` e expõe `RequestState<WeatherData>`; com `null` permanece em `idle` e não chama o service.
- [ ] Ao mudar a cidade, aborta a requisição anterior e reinicia o ciclo em `loading`.
- [ ] Falha do service vira `error` com `kind` correspondente; resposta parcial permanece `success`.
- [ ] Desmontar o componente aborta a requisição em voo (sem warning de atualização de estado após unmount).

### T-28 — Testes de `useWeather`

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-02, T-27
**Requisitos:** RF03, RF04, RF05, RF08, RF09

**Arquivos:** `tests/unit/hooks/useWeather.test.ts`

**Critérios de aceite:**

- [ ] `weatherService` é mockado; nenhum `fetch` real.
- [ ] Cobre `idle` com cidade `null`, `loading → success`, `loading → error` (timeout inclusive).
- [ ] Cobre troca de cidade durante requisição em voo: apenas os dados da última cidade chegam ao estado.
- [ ] Cobre resposta parcial: estado é `success` e o `ForecastDay` afetado mantém campos `null`.

## E5 — Shell e componentes de estado

### T-29 — Shell e layout base da aplicação

**Tipo:** UI · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-01
**Requisitos:** RNF01, RNF07, RNF09, RNF10

Estrutura semântica da tela única (header, `main`, footer) com o tema dark
glassmorphism e container responsivo — ainda sem lógica de dados.

**Arquivos:** `src/App.tsx`

**Critérios de aceite:**

- [ ] A página expõe um único `<h1>` em pt-BR e um `<main>` como landmark.
- [ ] Container central usa largura máxima com padding responsivo; nenhum valor fixo em `px` que quebre abaixo de 360px.
- [ ] Estilo aplicado só com utilitários Tailwind (sem CSS inline nem arquivos `.css` por componente).
- [ ] Renderiza sem erros em `pnpm dev` e passa em `pnpm lint`.

### T-30 — Componente `LoadingState`

**Tipo:** UI · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-29
**Requisitos:** RF08, RNF03, RNF09

**Arquivos:** `src/components/LoadingState.tsx`

**Critérios de aceite:**

- [ ] Renderiza `role="status"` com `aria-live="polite"` e texto visível em pt-BR (ex.: "Carregando…").
- [ ] Aceita prop opcional `label` para diferenciar busca de cidade e consulta de previsão.
- [ ] O estado não é comunicado apenas por animação/cor: há texto sempre presente (RNF03).
- [ ] Componente é puro (sem `useEffect`, sem `fetch`).

### T-31 — Componente `EmptyState`

**Tipo:** UI · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-29
**Requisitos:** RF10, RNF03, RNF07

**Arquivos:** `src/components/EmptyState.tsx`

**Critérios de aceite:**

- [ ] Suporta duas variantes por prop: `initial` (orientação para pesquisar uma cidade) e `noResults` (nenhuma cidade encontrada, sugerindo outro termo).
- [ ] Textos em pt-BR, visualmente distintos da mensagem de erro técnica.
- [ ] Não exibe dados simulados nem cidade pré-selecionada.
- [ ] Usa `role="status"` e ícone acompanhado de texto equivalente.

### T-32 — Componente `ErrorState`

**Tipo:** UI · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-06, T-29
**Requisitos:** RF09, RNF03, RNF06, RNF07, RNF09

**Arquivos:** `src/components/ErrorState.tsx`

**Critérios de aceite:**

- [ ] Recebe `kind` e renderiza mensagem em pt-BR específica para `network`, `api`, `timeout` e `unknown`.
- [ ] A mensagem de `timeout` informa tempo excedido e sugere tentar novamente (RF09/RNF12).
- [ ] Nenhuma mensagem exibe código HTTP, URL ou stack trace.
- [ ] Usa `role="alert"`, ícone com texto equivalente e não depende de cor para ser compreendida.
- [ ] Expõe ação opcional "Tentar novamente" via prop `onRetry`, acionável por teclado quando fornecida.

### T-33 — Testes de `LoadingState` e `EmptyState`

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-30, T-31
**Requisitos:** RF08, RF10, RNF03

**Arquivos:** `tests/unit/components/LoadingState.test.tsx`, `tests/unit/components/EmptyState.test.tsx`

**Critérios de aceite:**

- [ ] Consulta elementos por `getByRole('status')` e por texto acessível — nunca por classe CSS ou `data-testid`.
- [ ] Verifica as duas variantes de `EmptyState` e que seus textos são diferentes entre si.
- [ ] Verifica que o texto de carregamento existe no DOM (não apenas um spinner visual).

### T-34 — Testes de `ErrorState`

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-32
**Requisitos:** RF09, RNF03, RNF12

**Arquivos:** `tests/unit/components/ErrorState.test.tsx`

**Critérios de aceite:**

- [ ] Um caso por `kind` (`network`, `api`, `timeout`, `unknown`), verificando mensagens distintas via `getByRole('alert')`.
- [ ] Assegura que nenhuma renderização contém `/\b[45]\d{2}\b/` (código HTTP) nem a palavra `Error:`.
- [ ] Verifica que `onRetry` é chamado ao acionar o botão com `userEvent.keyboard('{Enter}')`.

## E6 — Componentes de conteúdo

### T-35 — Componente `SearchBar`

**Tipo:** UI · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-29
**Requisitos:** RF01, RNF02, RNF09, Edge Case "input vazio"

**Arquivos:** `src/components/SearchBar.tsx`

**Critérios de aceite:**

- [ ] `<form>` com `<label>` associado ao `<input>` e botão de envio com nome acessível em pt-BR.
- [ ] Envio por tecla Enter e por clique disparam o mesmo `onSearch(term)`.
- [ ] Termo vazio ou só com espaços **não** chama `onSearch`; exibe aviso acessível de campo obrigatório.
- [ ] A busca é disparada apenas no submit (sem busca a cada tecla).
- [ ] O componente não chama services diretamente — recebe `onSearch` por prop.

### T-36 — Testes de `SearchBar`

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-35
**Requisitos:** RF01, RNF02

**Arquivos:** `tests/unit/components/SearchBar.test.tsx`

**Critérios de aceite:**

- [ ] Usa `getByLabelText`/`getByRole('button')` e `userEvent`; sem `data-testid`.
- [ ] Verifica submit por Enter e por clique.
- [ ] Verifica que `"   "` não chama `onSearch` e que `"São Paulo"` chama com o termo exato.
- [ ] Verifica que digitar sem submeter não chama `onSearch`.

### T-37 — Componente `CityDisambiguationList`

**Tipo:** UI · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-04, T-29
**Requisitos:** RF02, RNF02, RNF09

**Arquivos:** `src/components/CityDisambiguationList.tsx`

**Critérios de aceite:**

- [ ] Renderiza no máximo 5 opções, na ordem recebida, cada uma com nome, região administrativa e país.
- [ ] Quando `admin1` ou `countryCode` faltam, exibe apenas os campos disponíveis, sem `undefined` na tela.
- [ ] Lista semântica (`<ul>/<li>`) com cada opção acionável por `<button>` — alcançável por Tab e acionável por Enter/Espaço, com foco visível.
- [ ] Seleção chama `onSelect(city)` com a cidade correspondente.
- [ ] Não é renderizada quando há apenas um resultado (seleção automática ocorre em T-47).

### T-38 — Testes de `CityDisambiguationList`

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-37
**Requisitos:** RF02, RNF02

**Arquivos:** `tests/unit/components/CityDisambiguationList.test.tsx`

**Critérios de aceite:**

- [ ] Verifica que 7 cidades recebidas renderizam exatamente 5 itens (`getAllByRole('listitem')`).
- [ ] Verifica ordem preservada e presença de nome, região e país em cada item.
- [ ] Verifica seleção por clique e por teclado (`Tab` + `Enter`), com `onSelect` recebendo a cidade certa.
- [ ] Verifica cidade sem `admin1`: a string `undefined` não aparece no DOM.

### T-39 — Componente `CurrentWeather`

**Tipo:** UI · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-08, T-10, T-23
**Requisitos:** RF03, RF05, RF07, RNF03

**Arquivos:** `src/components/CurrentWeather.tsx`

**Critérios de aceite:**

- [ ] Exibe nome da cidade, temperatura formatada por `formatTemperature(temperatureC, unit)` e a condição textual de `mapWeatherCodeToLabel`.
- [ ] Código WMO sem mapeamento exibe "Indisponível" — nunca o número bruto.
- [ ] Lê a unidade via `useUnit()`; não recebe temperatura já convertida por prop.
- [ ] Ícone de condição, quando presente, é acompanhado de texto equivalente (`aria-hidden` no ícone).
- [ ] Não dispara nenhuma requisição ao trocar a unidade.

### T-40 — Testes de `CurrentWeather`

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-39
**Requisitos:** RF03, RF05, RF07

**Arquivos:** `tests/unit/components/CurrentWeather.test.tsx`

**Critérios de aceite:**

- [ ] Verifica valores exibidos correspondentes aos dados de entrada em Celsius.
- [ ] Verifica que, dentro de um `UnitProvider` em Fahrenheit, o valor exibido é o convertido e arredondado.
- [ ] Verifica código WMO desconhecido → "Indisponível".

### T-41 — Componente `ForecastDayCard`

**Tipo:** UI · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-08, T-10, T-12, T-23
**Requisitos:** RF05, RF07, RNF03

**Arquivos:** `src/components/ForecastDayCard.tsx`

**Critérios de aceite:**

- [ ] Exibe data (via `formatForecastDate`, dentro de `<time dateTime="YYYY-MM-DD">`), condição, mínima e máxima.
- [ ] Campo `null` exibe "Indisponível" **apenas no campo afetado**; o card do dia continua sendo renderizado.
- [ ] Temperaturas usam `formatTemperature` com a unidade do contexto.
- [ ] Mínima e máxima têm rótulos textuais distintos ("Mín."/"Máx."), não diferenciadas apenas por posição ou cor.

### T-42 — Testes de `ForecastDayCard`

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-41
**Requisitos:** RF05, RF07

**Arquivos:** `tests/unit/components/ForecastDayCard.test.tsx`

**Critérios de aceite:**

- [ ] Caso completo: data, condição, mín. e máx. presentes.
- [ ] Caso `temperatureMinC: null`: exibe "Indisponível" na mínima e mantém a máxima correta.
- [ ] Caso `weatherCode: null`: condição "Indisponível", sem número no DOM.
- [ ] Caso Fahrenheit: valores convertidos e arredondados corretamente.

### T-43 — Componente `ForecastList`

**Tipo:** UI · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-41
**Requisitos:** RF04, RF05, RNF01, Edge Case "resposta parcial"

**Arquivos:** `src/components/ForecastList.tsx`

**Critérios de aceite:**

- [ ] Renderiza um `ForecastDayCard` por item, em ordem cronológica, dentro de lista semântica com título acessível.
- [ ] Com 5 dias, renderiza exatamente 5 cards, sem datas duplicadas.
- [ ] Com menos de 5 dias, renderiza os disponíveis **e** exibe um aviso em pt-BR de que a janela completa não pôde ser obtida.
- [ ] Layout empilha em telas estreitas e distribui em colunas a partir de `sm:`, sem rolagem horizontal.

### T-44 — Testes de `ForecastList`

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-43
**Requisitos:** RF04, Edge Case "resposta parcial"

**Arquivos:** `tests/unit/components/ForecastList.test.tsx`

**Critérios de aceite:**

- [ ] 5 dias → 5 itens e nenhuma data repetida.
- [ ] 3 dias → 3 itens **e** aviso de janela incompleta visível.
- [ ] 5 dias → aviso de janela incompleta **não** está no DOM.

### T-45 — Componente `UnitToggle`

**Tipo:** UI · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-23
**Requisitos:** RF06, RF07, RNF02, RNF09, Edge Case "alternar sem cidade"

**Arquivos:** `src/components/UnitToggle.tsx`

**Critérios de aceite:**

- [ ] Controle com nome acessível em pt-BR e estado atual exposto por `aria-pressed` (ou `role="switch"` + `aria-checked`).
- [ ] Acionável por clique, Enter e Espaço, com foco visível.
- [ ] Funciona sem cidade selecionada, sem lançar erro.
- [ ] Chama apenas `toggleUnit()` do contexto; não conhece `WeatherData` nem services.

### T-46 — Testes de `UnitToggle`

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-45
**Requisitos:** RF06, RNF02

**Arquivos:** `tests/unit/components/UnitToggle.test.tsx`

**Critérios de aceite:**

- [ ] Estado inicial reflete `celsius` no atributo ARIA.
- [ ] Acionamento por teclado alterna o estado e o rótulo acessível.
- [ ] Renderizado sem dados de clima, não lança erro e permanece operável.

## E7 — Integração da aplicação

### T-47 — `App`: fluxo de busca, estados e seleção de cidade

**Tipo:** UI · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-25, T-33, T-34, T-36, T-38
**Requisitos:** RF01, RF02, RF08, RF09, RF10

**Arquivos:** `src/App.tsx`

**Critérios de aceite:**

- [ ] `SearchBar` está ligada a `useCitySearch`; `status === 'loading'` renderiza `LoadingState`.
- [ ] `status === 'empty'` renderiza `EmptyState` variante `noResults`; `idle` sem cidade renderiza variante `initial`.
- [ ] `status === 'error'` renderiza `ErrorState` com o `kind` correspondente.
- [ ] Exatamente 1 resultado → cidade selecionada automaticamente, sem exibir a lista.
- [ ] 2 a 5 resultados → `CityDisambiguationList` exibida; selecionar uma opção define a cidade e oculta a lista.

### T-48 — `App`: exibição de clima atual e previsão

**Tipo:** UI · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-27, T-39, T-43, T-47
**Requisitos:** RF03, RF04, RF08, RF09

**Arquivos:** `src/App.tsx`

**Critérios de aceite:**

- [ ] Cidade selecionada aciona `useWeather`; enquanto carrega, exibe `LoadingState` no lugar do conteúdo.
- [ ] `success` renderiza `CurrentWeather` e `ForecastList` da cidade selecionada.
- [ ] `error` na previsão renderiza `ErrorState`, mantendo a busca operável (interface não trava).
- [ ] Selecionar outra cidade substitui completamente os dados exibidos, sem misturar cidades.

### T-49 — `App`: `UnitProvider` e `UnitToggle` globais

**Tipo:** UI · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-45, T-48
**Requisitos:** RF06, RF07

**Arquivos:** `src/main.tsx`, `src/App.tsx`

**Critérios de aceite:**

- [ ] `UnitProvider` envolve toda a árvore; `UnitToggle` fica sempre visível, inclusive no estado inicial.
- [ ] Alternar a unidade atualiza clima atual e os cinco dias **simultaneamente**, no mesmo render.
- [ ] Alternar a unidade não dispara nenhuma chamada a services (verificável por espião).

### T-50 — Teste de integração do `App` com services mockados

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-03, T-49
**Requisitos:** RF01–RF10

**Arquivos:** `tests/unit/App.test.tsx`

**Critérios de aceite:**

- [ ] `geocodingService` e `weatherService` mockados com as fixtures de T-03; nenhum `fetch` real.
- [ ] Fluxo feliz: buscar → aguardar → ver temperatura atual e 5 dias.
- [ ] Fluxo de desambiguação: 3 resultados → selecionar o segundo → dados da cidade correta exibidos.
- [ ] Fluxo vazio e fluxo de erro renderizam `EmptyState`/`ErrorState` corretos.
- [ ] Troca de unidade: valores em °C e °F conferidos no clima atual **e** em um dia da previsão, com `weatherService` chamado apenas uma vez.

## E8 — Testes E2E

### T-51 — Infraestrutura E2E: interceptação de rede com fixtures

**Tipo:** Infra · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-03, T-49
**Requisitos:** RNF13, Testing Strategy

Helper de `page.route` para responder às URLs do Open-Meteo com payloads
determinísticos (sucesso, vazio, erro, timeout), reutilizado por todos os
cenários E2E.

**Arquivos:** `tests/e2e/support/mockOpenMeteo.ts`

**Critérios de aceite:**

- [ ] Intercepta `**/geocoding-api.open-meteo.com/**` e `**/api.open-meteo.com/**`.
- [ ] Suporta cenários: `success`, `empty`, `manyResults`, `partialForecast`, `serverError`, `networkError`, `timeout`.
- [ ] Nenhum teste E2E acessa a API real (verificável: rota não interceptada falha o teste).
- [ ] Reaproveita as fixtures de T-03 em vez de duplicar payloads.

### T-52 — E2E: fluxo principal (busca → dados → troca de unidade)

**Tipo:** Test · **Prioridade:** P0 · **Tamanho:** M · **Depende de:** T-51
**Requisitos:** RF01, RF03, RF04, RF05, RF06, RF07, RNF13

**Arquivos:** `tests/e2e/weather-flow.spec.ts`

**Critérios de aceite:**

- [ ] Roda nos dois projetos configurados em [playwright.config.ts](../playwright.config.ts) (`chromium` e `mobile` / iPhone 13).
- [ ] Busca uma cidade com resultado único → clima atual e exatamente 5 dias visíveis.
- [ ] Aciona o toggle → o valor do clima atual e o de um dia da previsão mudam para °F no mesmo passo.
- [ ] Seletores baseados em papéis/rótulos acessíveis (`getByRole`, `getByLabel`).

### T-53 — E2E: desambiguação de cidades homônimas

**Tipo:** Test · **Prioridade:** P1 · **Tamanho:** M · **Depende de:** T-51
**Requisitos:** RF02, RNF13

**Arquivos:** `tests/e2e/disambiguation.spec.ts`

**Critérios de aceite:**

- [ ] Cenário `manyResults` exibe exatamente 5 opções com nome, região e país.
- [ ] Selecionar a terceira opção exibe o clima da cidade correspondente (nome conferido na tela).
- [ ] A lista some após a seleção.

### T-54 — E2E: estado vazio

**Tipo:** Test · **Prioridade:** P1 · **Tamanho:** P · **Depende de:** T-51
**Requisitos:** RF10, Edge Case "cidade inexistente"

**Arquivos:** `tests/e2e/empty-state.spec.ts`

**Critérios de aceite:**

- [ ] Busca sem correspondência exibe a mensagem orientativa de estado vazio.
- [ ] Nenhum dado de clima ou previsão é exibido no estado vazio.
- [ ] A mensagem exibida é diferente da mensagem de erro técnico (asserção explícita).

### T-55 — E2E: erro de API e timeout

**Tipo:** Test · **Prioridade:** P1 · **Tamanho:** M · **Depende de:** T-51
**Requisitos:** RF09, RNF06, RNF12

**Arquivos:** `tests/e2e/error-state.spec.ts`

**Critérios de aceite:**

- [ ] Cenário `serverError` exibe mensagem compreensível em pt-BR, sem código HTTP visível.
- [ ] Cenário `timeout` exibe a mensagem de tempo excedido **até 12s** após o submit (margem sobre os 10s de RNF12).
- [ ] Após o erro, o indicador de carregamento não permanece na tela e o campo de busca continua utilizável.

### T-56 — E2E: navegação exclusivamente por teclado

**Tipo:** Test · **Prioridade:** P1 · **Tamanho:** M · **Depende de:** T-51
**Requisitos:** RNF02, RNF09

**Arquivos:** `tests/e2e/keyboard-a11y.spec.ts`

**Critérios de aceite:**

- [ ] Fluxo completo (buscar → escolher cidade homônima → alternar unidade) executado apenas com `Tab`, `Enter` e `Space`.
- [ ] Cada elemento interativo alcançado tem indicador de foco visível (asserção de estilo de foco).
- [ ] A ordem de foco segue a ordem visual dos elementos.

### T-57 — E2E: responsividade em viewport mobile e 320px

**Tipo:** Test · **Prioridade:** P1 · **Tamanho:** M · **Depende de:** T-51
**Requisitos:** RNF01, RNF10, RNF13

**Arquivos:** `tests/e2e/responsive.spec.ts`

**Critérios de aceite:**

- [ ] Executa o fluxo principal no projeto `mobile` (iPhone 13, 390×844).
- [ ] Em viewport de 320px de largura, `document.documentElement.scrollWidth <= clientWidth` (sem rolagem horizontal).
- [ ] Busca, seleção de cidade e toggle de unidade permanecem visíveis e clicáveis em 320px.

## E9 — Hardening e fechamento

### T-58 — Ajuste fino de responsividade (320px–1440px)

**Tipo:** UI · **Prioridade:** P1 · **Tamanho:** M · **Depende de:** T-57
**Requisitos:** RNF01, RNF10

**Arquivos:** `src/components/*.tsx`, `src/App.tsx`

**Critérios de aceite:**

- [ ] Nenhuma rolagem horizontal em 320, 390, 768, 1024 e 1440px.
- [ ] Alvos de toque com no mínimo 44×44 px nos controles principais.
- [ ] Truncamento/quebra adequada para nomes longos de cidade (sem estourar o container).
- [ ] Apenas utilitários Tailwind responsivos (`sm:`, `md:`, `lg:`), sem media queries manuais.

### T-59 — Checklist de acessibilidade por componente

**Tipo:** UI · **Prioridade:** P1 · **Tamanho:** M · **Depende de:** T-50
**Requisitos:** RNF02, RNF03, RNF09 — fecha o **gap 3** do [Plan Review](../plans/weather-app-plan.md#plan-review)

**Arquivos:** `src/components/*.tsx`, `tasks/weather-app-tasks.md` (registro do checklist)

**Critérios de aceite:**

- [ ] Cada componente tem rótulos ARIA e ordem de foco documentados e implementados.
- [ ] Contraste de texto ≥ 4.5:1 no tema dark, verificado nos textos principais e de estado.
- [ ] Nenhuma informação depende só de cor (loading, erro, vazio, mín./máx.).
- [ ] Anúncio de mudanças de estado via `aria-live` sem verbosidade excessiva (uma região por área).

### T-60 — Orçamento de bundle e verificação de RNF08

**Tipo:** Infra · **Prioridade:** P2 · **Tamanho:** P · **Depende de:** T-49
**Requisitos:** RNF08 — fecha o **gap 2** do [Plan Review](../plans/weather-app-plan.md#plan-review)

**Arquivos:** `package.json`, `README.md`

**Critérios de aceite:**

- [ ] Tamanho do bundle de produção (`pnpm build`) registrado como linha de base, com meta explícita em KB (gzip).
- [ ] Carregamento medido em 4G simulado exibe conteúdo ou estado de carregamento em até 3s.
- [ ] Nenhuma dependência de runtime além de `react`/`react-dom` foi adicionada.

### T-61 — Gate de qualidade final

**Tipo:** Infra · **Prioridade:** P0 · **Tamanho:** P · **Depende de:** T-50, T-52
**Requisitos:** Checklist do `.github/copilot-instructions.md`

**Critérios de aceite:**

- [ ] `pnpm lint` sem violações.
- [ ] `pnpm build` sem erros de TypeScript strict.
- [ ] `pnpm test` com toda a suíte verde.
- [ ] `pnpm test:e2e` verde nos projetos `chromium` e `mobile`.

### T-62 — Revisão de rastreabilidade spec ↔ testes

**Tipo:** Test · **Prioridade:** P1 · **Tamanho:** P · **Depende de:** T-61
**Requisitos:** Acceptance Criteria (spec)

**Arquivos:** `tasks/weather-app-tasks.md`

**Critérios de aceite:**

- [ ] Cada critério de aceite Given/When/Then de RF01–RF10 aponta para ao menos um teste automatizado existente.
- [ ] A tabela de [Rastreabilidade](#rastreabilidade-spec--tarefas) é atualizada com o arquivo de teste que cobre cada requisito.
- [ ] Qualquer critério sem cobertura vira uma nova tarefa `T-NN` neste backlog.

## Rastreabilidade (spec → tarefas)

### Requisitos funcionais

| Requisito | Tarefas de implementação | Tarefas de teste |
| --- | --- | --- |
| **RF01** — Busca de cidade por nome | T-16, T-25, T-35, T-47 | T-18, T-26, T-36, T-50, T-52 |
| **RF02** — Desambiguação de homônimas | T-04, T-17, T-37, T-47 | T-18, T-38, T-50, T-53 |
| **RF03** — Clima atual | T-05, T-19, T-20, T-39, T-48 | T-22, T-28, T-40, T-50, T-52 |
| **RF04** — Previsão de cinco dias | T-05, T-12, T-21, T-43, T-48 | T-13, T-22, T-44, T-50, T-52 |
| **RF05** — Dados de cada dia (parciais) | T-05, T-08, T-10, T-12, T-21, T-41, T-43 | T-09, T-11, T-22, T-42, T-44, T-52 |
| **RF06** — Alternância de unidade | T-05, T-08, T-23, T-45, T-49 | T-24, T-46, T-50, T-52 |
| **RF07** — Consistência da unidade | T-07, T-08, T-39, T-41, T-49 | T-09, T-40, T-42, T-50, T-52 |
| **RF08** — Estados de carregamento | T-06, T-25, T-27, T-30, T-47, T-48 | T-26, T-28, T-33, T-50 |
| **RF09** — Mensagens de erro | T-06, T-14, T-32, T-47, T-48 | T-15, T-18, T-22, T-26, T-34, T-55 |
| **RF10** — Estados vazios/iniciais | T-06, T-17, T-31, T-47 | T-18, T-26, T-33, T-50, T-54 |

### Requisitos não funcionais

| Requisito | Tarefas | Observação |
| --- | --- | --- |
| RNF01 (responsivo) | T-01, T-29, T-43, T-57, T-58 | — |
| RNF02 (teclado, rótulos) | T-35, T-37, T-45, T-56, T-59 | — |
| RNF03 (não depender de cor) | T-30, T-31, T-32, T-41, T-59 | — |
| RNF04 (HTTPS) | T-14, T-16, T-19 | URLs `https://` fixas no service |
| RNF05 (não bloquear interação) | T-25, T-27, T-48 | Requisições assíncronas + abort |
| RNF06 (resiliência) | T-06, T-14, T-32 | — |
| RNF07 (pt-BR) | T-08, T-10, T-12, T-31, T-32 | — |
| RNF08 (3s em 4G) | T-60 | ⚠️ **P2** — gap herdado do plano, sem meta numérica até T-60 |
| RNF09 (WCAG 2.1 AA) | T-32, T-37, T-45, T-56, T-59 | — |
| RNF10 (320–1440px) | T-57, T-58 | — |
| RNF11 (99,5% disponibilidade) | — | ❌ **Sem tarefa**: decisão operacional/infra de hospedagem, fora do escopo do app (registrado no plano como não bloqueante) |
| RNF12 (timeout 10s) | T-14, T-32 | T-15, T-55 validam |
| RNF13 (Chromium + iPhone 13) | T-51, T-52, T-57 | Projetos já configurados no Playwright |

### Edge cases

| Edge case | Tarefas |
| --- | --- |
| Cidade inexistente | T-17, T-31, T-47, T-54 |
| Input vazio | T-25, T-35, T-36 |
| Caracteres especiais | T-16, T-18 |
| Falha de API | T-14, T-32, T-55 |
| Timeout | T-14, T-15, T-55 |
| Geocoding sem resultados | T-17, T-31, T-54 |
| Resposta parcial (campos `null` / <5 dias) | T-21, T-41, T-43, T-44 |
| Homônimas em países/estados diferentes | T-37, T-53 |
| Buscas sucessivas (respostas fora de ordem) | T-25, T-27, T-26, T-28 |
| Alternância de unidade sem cidade | T-45, T-46 |
| Fuso da cidade ≠ fuso do dispositivo | T-12, T-13, T-19, T-21 |
| Viewport de 320px | T-57, T-58 |
| Navegação só por teclado | T-37, T-45, T-56 |

### Requisitos sem tarefa correspondente

| Item | Situação |
| --- | --- |
| **RNF11** (disponibilidade 99,5%) | Sem tarefa neste backlog — depende de decisão de hospedagem/monitoramento, e "monitoramento e observabilidade em produção" está em **Out of Scope** na spec. Deve virar tarefa se um alvo de deploy for definido. |
| **RNF08** (3s em 4G) | Coberto apenas parcialmente por **T-60 (P2)**: sem meta numérica de bundle definida até que a tarefa seja executada — gap herdado do [Plan Review](../plans/weather-app-plan.md#plan-review). |
| **Open Questions** da spec (campos extras do clima atual) | Sem tarefa por decisão explícita: fora do escopo do MVP (RF03 define o piso mínimo). |

## Priorização e tamanho

| Prioridade | Tarefas | Total |
| --- | --- | --- |
| **P0** | T-01 … T-23, T-25 … T-52, T-61 | 52 |
| **P1** | T-24, T-53, T-54, T-55, T-56, T-57, T-58, T-59, T-62 | 9 |
| **P2** | T-60 | 1 |

| Tamanho | Tarefas |
| --- | --- |
| **P** (1 arquivo, trivial) | T-02, T-04, T-05, T-06, T-07, T-08, T-11, T-12, T-13, T-16, T-17, T-19, T-20, T-24, T-30, T-31, T-33, T-40, T-43, T-44, T-45, T-46, T-49, T-54, T-60, T-61, T-62 |
| **M** (1–2 arquivos com lógica) | T-01, T-03, T-09, T-10, T-14, T-15, T-18, T-21, T-22, T-23, T-25, T-26, T-27, T-28, T-29, T-32, T-34, T-35, T-36, T-37, T-38, T-39, T-41, T-42, T-47, T-48, T-50, T-51, T-52, T-53, T-55, T-56, T-57, T-58, T-59 |
| **G** | Nenhuma — toda tarefa candidata a `G` foi quebrada (ex.: `weatherService` virou T-19/T-20/T-21; cada componente tem tarefa de teste separada) |

## Sequência de entrega em fatias verticais

Cada fatia produz algo **visível e demonstrável**, mesmo antes de a aplicação
estar completa.

```mermaid
flowchart LR
    F1["Fatia 1<br/>App no ar + estados"] --> F2["Fatia 2<br/>Buscar e escolher cidade"]
    F2 --> F3["Fatia 3<br/>Clima atual"]
    F3 --> F4["Fatia 4<br/>Previsão de 5 dias"]
    F4 --> F5["Fatia 5<br/>Alternância de unidade"]
    F5 --> F6["Fatia 6<br/>E2E + hardening"]
```

| Fatia | Tarefas | O que fica visível ao final |
| --- | --- | --- |
| **1 — Esqueleto no ar** | T-01, T-02, T-03, T-06, T-29, T-30, T-31, T-32, T-33, T-34 | Aplicação abre com tema dark, mostra a orientação inicial (RF10) e os componentes de loading/erro já testados |
| **2 — Buscar e escolher cidade** | T-04, T-14, T-15, T-16, T-17, T-18, T-25, T-26, T-35, T-36, T-37, T-38, T-47 | Busca real no Open-Meteo, com lista de desambiguação, estado vazio e erro funcionando ponta a ponta (RF01, RF02, RF08–RF10) |
| **3 — Clima atual** | T-05, T-07, T-08, T-09, T-10, T-11, T-19, T-20, T-21, T-22, T-23, T-27, T-28, T-39, T-40, T-48 | Cidade selecionada mostra temperatura e condição reais (RF03) |
| **4 — Previsão de 5 dias** | T-12, T-13, T-41, T-42, T-43, T-44 | Cinco dias com data, condição, mín./máx. e tratamento de dado ausente (RF04, RF05) |
| **5 — Alternância de unidade** | T-24, T-45, T-46, T-49, T-50 | Toggle °C/°F atualizando tudo simultaneamente, sem novo request (RF06, RF07) — MVP funcionalmente completo |
| **6 — Validação e hardening** | T-51 … T-62 | Suíte E2E nos dois viewports, acessibilidade, responsividade e gates de qualidade verdes |

> **Menor entrega demonstrável:** ao fim da **Fatia 2** já existe valor visível
> (busca real + desambiguação + estados). A **Fatia 5** encerra o MVP com todos
> os RF01–RF10 atendidos; a **Fatia 6** fecha os RNF.
