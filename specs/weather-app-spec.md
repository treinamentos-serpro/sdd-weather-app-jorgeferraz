# Especificação de Produto — Weather App

## Overview

O Weather App é uma aplicação web responsiva que permite ao usuário pesquisar
uma cidade pelo nome e consultar o clima atual e a previsão dos próximos cinco
dias (hoje + quatro dias seguintes). Os dados de geocodificação e previsão são
obtidos do Open-Meteo, sem necessidade de autenticação ou API key. A primeira
versão (MVP) não inclui cadastro de usuários, persistência em servidor,
geolocalização automática, favoritos ou alertas meteorológicos.

A interface é apresentada em pt-BR, com Celsius como unidade padrão de
temperatura e alternância disponível para Fahrenheit. O produto deve funcionar
bem tanto em desktop quanto em dispositivos móveis, com atenção a
acessibilidade (WCAG 2.1 AA) e resiliência a falhas da API externa.

Público-alvo: pessoas que precisam decidir rapidamente como se vestir ou se
planejar (Mariana), viajantes que comparam a previsão de vários dias em uma
cidade de destino (Rafael) e usuários que consultam o clima da própria cidade
rotineiramente e dependem de uma interface simples e acessível (Joana).

## Data Requirements

Contrato de dados mínimo exigido do provedor (Open-Meteo) para atender aos
requisitos funcionais. Não descreve implementação, apenas os dados e regras
de precisão necessários para testabilidade.

- Geocodificação (por nome de cidade): para cada resultado, nome da cidade,
  região administrativa (estado/província), país, latitude, longitude e
  fuso horário (quando disponíveis). No máximo 5 resultados são
  considerados por busca; resultados adicionais retornados pela fonte são
  descartados.
- Clima atual: temperatura (°C), código de condição meteorológica (WMO),
  umidade relativa (%), velocidade do vento (km/h), precipitação (mm) e
  pressão de superfície (hPa), para a latitude/longitude e fuso horário da
  cidade selecionada.
- Previsão diária: para cada um dos 5 dias (hoje + 4 seguintes): data (no
  fuso horário local da cidade), código de condição meteorológica (WMO),
  temperatura máxima, temperatura mínima e probabilidade de precipitação
  (%). Métricas ausentes são comunicadas como indisponíveis no campo afetado,
  sem omitir o clima atual ou o dia inteiro.
- Mapeamento de condições: todo código de condição meteorológica (WMO)
  retornado pela API é mapeado para um rótulo textual em pt-BR; um código
  sem mapeamento correspondente é tratado como dado ausente (ver Resposta
  Parcial em Edge Cases), nunca exibido como código numérico bruto ao
  usuário.
- Conversão e arredondamento de temperatura: a conversão usa
  $°F = °C \times 9/5 + 32$ e $°C = (°F - 32) \times 5/9$; todo valor de
  temperatura exibido na interface é arredondado ao inteiro mais próximo
  (round-half-away-from-zero), de forma consistente entre clima atual e
  previsão.

## Functional Requirements

### RF01 — Busca de cidade por nome

O usuário deve poder pesquisar uma cidade digitando seu nome em um campo de
busca.

**Critérios de aceite:**
- **Given** o campo de busca está vazio ou contém apenas espaços, **When** o
  usuário tenta enviar a busca, **Then** a aplicação não dispara uma
  requisição de geocodificação.
- **Given** o usuário digitou o nome de uma cidade existente no campo de
  busca, **When** ele envia a busca, **Then** a aplicação consulta o serviço
  de geocodificação e exibe os resultados correspondentes.
- **Given** o usuário digitou um termo contendo caracteres especiais, acentos
  ou pontuação (ex.: "São Paulo", "Ribeirão Preto", "!!city??"), **When** ele
  envia a busca, **Then** a aplicação envia o termo devidamente tratado
  (sem quebrar a requisição) ao serviço de geocodificação e trata a resposta
  normalmente, seja com resultados ou com o estado vazio de RF10.

### RF02 — Desambiguação de cidades homônimas

A aplicação deve apresentar uma lista de opções quando a busca retornar mais
de uma localidade correspondente, exibindo nome, estado/região administrativa
e país (e, quando indisponíveis, os campos que a fonte fornecer) para permitir
identificação inequívoca.

**Critérios de aceite:**
- **Given** a busca retornou duas ou mais cidades com nomes iguais ou
  semelhantes, **When** os resultados são exibidos, **Then** a aplicação
  apresenta uma lista de até 5 opções (ver Data Requirements), na mesma
  ordem retornada pela API, com nome, região administrativa e país de cada
  resultado.
- **Given** a lista de opções de desambiguação está visível, **When** o
  usuário seleciona uma das opções, **Then** a aplicação passa a exibir o
  clima atual e a previsão apenas da cidade selecionada.
- **Given** a busca retornou exatamente um resultado, **When** os resultados
  são processados, **Then** a aplicação pode selecioná-lo automaticamente,
  sem exigir uma etapa extra de confirmação.
- **Given** a busca retornou mais de 5 resultados, **When** a lista de
  desambiguação é exibida, **Then** apenas os 5 primeiros são apresentados
  ao usuário.

### RF03 — Exibição do clima atual

A aplicação deve exibir o clima atual da cidade selecionada, incluindo no
mínimo temperatura e condição meteorológica.

**Critérios de aceite:**
- **Given** uma cidade foi selecionada, **When** os dados de clima atual são
  carregados com sucesso, **Then** a aplicação exibe a temperatura atual e
  uma descrição textual (ou ícone com texto equivalente) da condição
  meteorológica.
- **Given** os dados de clima atual chegaram com sucesso, **When** são
  renderizados na tela, **Then** a temperatura e a condição exibidas
  correspondem exatamente aos valores retornados pela API para aquela
  cidade.

### RF04 — Previsão de cinco dias

A aplicação deve exibir a previsão meteorológica para os próximos cinco dias
(hoje e os quatro dias seguintes) da cidade selecionada.

**Critérios de aceite:**
- **Given** uma cidade foi selecionada, **When** os dados de previsão são
  carregados com sucesso, **Then** a aplicação exibe exatamente cinco
  entradas de previsão, correspondentes a hoje e aos quatro dias seguintes,
  na ordem cronológica.
- **Given** a previsão está sendo exibida, **When** o usuário observa a lista
  de dias, **Then** cada entrada está associada a uma data distinta, sem dias
  duplicados ou faltantes dentro da janela de cinco dias.

### RF05 — Dados de cada dia da previsão

Para cada dia da previsão, a aplicação deve apresentar data, condição
meteorológica e temperaturas previstas mínima e máxima.

**Critérios de aceite:**
- **Given** um dia da previsão está sendo exibido, **When** o usuário o
  visualiza, **Then** a aplicação mostra a data, a condição meteorológica
  (texto ou ícone com texto equivalente) e as temperaturas mínima e máxima
  previstas.
- **Given** a API retornou dados parciais para um dia específico (ex.: sem
  temperatura mínima ou sem código de condição), **When** esse dia é
  renderizado, **Then** a aplicação indica explicitamente a ausência do dado
  (ex.: indisponível) no campo afetado, em vez de omitir o dia inteiro ou
  exibir um valor vazio sem explicação.
- **Given** a API retornou um código de condição meteorológica sem
  mapeamento textual conhecido, **When** o dia é renderizado, **Then** a
  condição é tratada como dado ausente (indisponível), nunca exibida como
  código numérico bruto.

### RF06 — Alternância de unidade de temperatura

O usuário deve poder alternar a unidade de temperatura exibida entre Celsius
(°C) e Fahrenheit (°F).

**Critérios de aceite:**
- **Given** a aplicação está exibindo temperaturas em Celsius, **When** o
  usuário aciona o controle de alternância, **Then** as temperaturas passam a
  ser exibidas em Fahrenheit, e vice-versa.
- **Given** nenhuma cidade foi selecionada ainda, **When** o usuário aciona o
  controle de alternância de unidade, **Then** o controle responde
  normalmente, sem gerar erro.
- **Given** o usuário acessa a aplicação pela primeira vez, **When** nenhuma
  preferência de unidade foi definida, **Then** Celsius é a unidade padrão
  exibida.

### RF07 — Consistência da unidade entre clima atual e previsão

Ao alternar a unidade, a aplicação deve atualizar consistentemente as
temperaturas exibidas tanto no clima atual quanto na previsão de cinco dias.

**Critérios de aceite:**
- **Given** uma cidade selecionada com clima atual e previsão exibidos,
  **When** o usuário altera a unidade de temperatura, **Then** todas as
  temperaturas visíveis (clima atual e os cinco dias de previsão) são
  recalculadas e exibidas na nova unidade simultaneamente, sem exigir nova
  busca.
- **Given** uma temperatura em Celsius é convertida para Fahrenheit, **When**
  a conversão é aplicada, **Then** o valor convertido corresponde à fórmula
  padrão de conversão ($°F = °C \times 9/5 + 32$), arredondado ao inteiro
  mais próximo (round-half-away-from-zero), conforme Data Requirements.
- **Given** duas temperaturas iguais em Celsius exibidas no clima atual e em
  um dia da previsão, **When** a unidade é alternada para Fahrenheit,
  **Then** ambas produzem o mesmo valor convertido e arredondado, sem
  divergência entre os pontos da interface.

### RF08 — Estados de carregamento

A aplicação deve informar estados de carregamento durante buscas de cidade e
consultas de previsão.

**Critérios de aceite:**
- **Given** uma busca de cidade ou consulta de previsão foi disparada,
  **When** a resposta ainda não retornou, **Then** a aplicação exibe um
  indicador visível de carregamento.
- **Given** o indicador de carregamento está visível, **When** a resposta da
  busca ou da previsão chega, **Then** o indicador é removido e substituído
  pelo conteúdo ou pela mensagem correspondente (dados, vazio ou erro).

### RF09 — Mensagens de erro compreensíveis

A aplicação deve informar erros compreensíveis quando não for possível
localizar a cidade ou obter os dados meteorológicos.

**Critérios de aceite:**
- **Given** o usuário pesquisou um nome de cidade, **When** a busca de
  geocodificação não encontra nenhuma cidade correspondente, **Then** a
  aplicação exibe uma mensagem indicando que nenhuma cidade foi encontrada e
  sugerindo revisar o termo pesquisado.
- **Given** uma cidade foi selecionada, **When** a requisição à API de
  previsão falha por erro de rede ou indisponibilidade do serviço, **Then**
  a aplicação exibe uma mensagem de erro compreensível em pt-BR, sem expor
  detalhes técnicos brutos (como stack traces ou códigos HTTP crus) ao
  usuário final.
- **Given** uma busca ou consulta de previsão foi enviada, **When** nenhuma
  resposta é recebida dentro do limite de 10 segundos definido em RNF12,
  **Then** a aplicação cancela a espera, trata a requisição como expirada e
  exibe uma mensagem informando que o tempo de resposta foi excedido e
  sugerindo tentar novamente.
- **Given** uma mensagem de erro está sendo exibida, **When** o usuário a
  percebe, **Then** ela não depende exclusivamente de cor para ser
  compreendida (inclui texto e/ou ícone com texto equivalente).

### RF10 — Orientação em estados vazios ou iniciais

A aplicação deve apresentar uma orientação para o usuário quando não houver
resultados de busca ou ainda não houver uma cidade selecionada.

**Critérios de aceite:**
- **Given** o usuário acessa a aplicação pela primeira vez, **When** nenhuma
  cidade foi selecionada, **Then** a aplicação exibe uma instrução orientando
  a pesquisar uma cidade, sem dados simulados ou cidade pré-selecionada.
- **Given** o usuário enviou uma busca por uma cidade, **When** o serviço de
  geocodificação retorna uma lista vazia (nenhuma cidade correspondente),
  **Then** a aplicação exibe uma mensagem de estado vazio distinta da
  mensagem de erro técnico, orientando o usuário a tentar outro termo de
  busca.

## User Stories

- **US01 (RF01)** — Como Mariana, quero pesquisar minha cidade digitando seu
  nome, para consultar rapidamente o clima antes de sair de casa.
- **US02 (RF02)** — Como Rafael, quero ver as opções de cidades quando houver
  nomes homônimos, com estado/região e país de cada uma, para garantir que
  estou consultando a cidade certa antes de viajar.
- **US03 (RF03)** — Como Mariana, quero ver a temperatura atual e a condição
  do tempo da minha cidade, para decidir como me vestir e se preciso de
  guarda-chuva antes de sair.
- **US04 (RF04, RF05)** — Como Rafael, quero visualizar a data, a condição e
  as temperaturas mínima e máxima dos próximos cinco dias de uma cidade de
  destino, para planejar minha mala e meus compromissos.
- **US05 (RF06, RF07)** — Como Joana, quero alternar entre Celsius e
  Fahrenheit e ver essa mudança refletida tanto no clima atual quanto na
  previsão, para visualizar a temperatura na unidade que me é mais familiar.
- **US06 (RF08)** — Como Mariana, quero ver um indicador de carregamento
  enquanto minha busca é processada, para saber que a aplicação está
  respondendo mesmo em uma conexão móvel instável.
- **US07 (RF09)** — Como Joana, quero receber uma mensagem clara quando
  minha cidade não for encontrada ou ocorrer uma falha na consulta, para
  entender o que aconteceu e o que fazer em seguida, sem depender de ajuda.
- **US08 (RF10)** — Como Joana, quero ver uma orientação inicial para
  pesquisar uma cidade quando ainda não selecionei nenhuma, para saber como
  começar a usar a aplicação sem confusão.

## Acceptance Criteria

Os critérios de aceite verificáveis de cada requisito funcional estão listados
junto ao respectivo requisito na seção [Functional Requirements](#functional-requirements).
De forma consolidada, a funcionalidade é considerada aceita quando:

1. É possível pesquisar, desambiguar (lista de até 5 opções, ver Data
   Requirements) e selecionar uma cidade.
2. O clima atual e a previsão de cinco dias são exibidos corretamente para a
   cidade selecionada, com data, condição, mínima e máxima por dia, e
   qualquer campo ausente é indicado como tal (nunca omitido em silêncio).
3. A alternância de unidade recalcula e exibe todas as temperaturas visíveis
   de forma consistente e sincronizada, com arredondamento uniforme.
4. Os estados de carregamento, vazio e erro são exibidos nos momentos
   apropriados, dentro dos limites de tempo de RNF08/RNF12, com mensagens
   compreensíveis em pt-BR.
5. A aplicação é utilizável e acessível em viewports entre 320px e 1440px, por
   teclado e por toque, validada nos alvos definidos em RNF13.

## Non-Functional Requirements

- RNF01: A interface deve ser responsiva e utilizável em dispositivos móveis,
  incluindo telas estreitas e interação por toque.
- RNF02: Os controles devem ser acessíveis por teclado e possuir rótulos
  semânticos adequados para tecnologias assistivas.
- RNF03: A aplicação deve comunicar claramente carregamento, ausência de dados
  e falhas sem depender exclusivamente de cor ou ícones.
- RNF04: Os dados meteorológicos devem ser obtidos de uma API confiável por
  uma conexão segura (HTTPS).
- RNF05: A aplicação deve manter tempos de resposta percebidos adequados e não
  bloquear a interação do usuário enquanto aguarda respostas da API.
- RNF06: A implementação deve tratar respostas inválidas, indisponibilidade da
  API e falhas de rede de forma resiliente.
- RNF07: A interface e a documentação do produto devem estar em pt-BR, salvo
  termos técnicos ou dados retornados pela fonte externa quando aplicável.
- RNF08: Em uma conexão móvel 4G simulada, a aplicação deve exibir conteúdo
  utilizável ou um estado de carregamento em até 3 segundos após o acesso.
- RNF09: A interface deve atender ao nível AA das WCAG 2.1, incluindo
  contraste de texto, foco visível e operação integral por teclado.
- RNF10: A interface deve funcionar sem rolagem horizontal e manter todos os
  controles operáveis em larguras de viewport entre 320px e 1440px.
- RNF11: O serviço hospedado deve alcançar disponibilidade mensal de pelo
  menos 99,5%, excluídas indisponibilidades comprovadas da API meteorológica
  externa.
- RNF12: Depois que a busca for enviada, a aplicação deve exibir uma resposta,
  dados, estado vazio ou mensagem de erro em até 10 segundos; após esse
  limite, a requisição deve ser considerada expirada e comunicada ao usuário.
- RNF13: A aplicação deve ser validada, no mínimo, em um navegador desktop
  baseado em Chromium e em um viewport mobile equivalente a iPhone 13
  (390×844px), conforme a suíte de testes E2E do projeto
  ([playwright.config.ts](../playwright.config.ts)). Degradação graciosa é
  esperada, mas não garantida por testes automatizados, em outros
  navegadores evergreen (Firefox, Safari desktop, Edge).

## Edge Cases

| Caso | Comportamento Esperado |
| --- | --- |
| **Cidade inexistente** — usuário pesquisa um nome que não corresponde a nenhuma localidade real ou contém erro de digitação grosseiro. | A aplicação envia a busca normalmente, recebe uma lista vazia do serviço de geocodificação e exibe o estado vazio de RF10, orientando o usuário a revisar o termo pesquisado. Não deve haver erro técnico nem tela em branco. |
| **Input vazio** — usuário tenta enviar a busca com o campo vazio ou contendo apenas espaços em branco. | A aplicação não dispara nenhuma requisição de geocodificação (RF01) e pode, opcionalmente, indicar ao usuário que é preciso informar um nome de cidade antes de buscar. |
| **Caracteres especiais** — usuário digita acentos, cedilha, hífen, apóstrofo ou símbolos (ex.: cidades com acento, nomes compostos ou pontuação isolada). | A aplicação codifica corretamente o termo na requisição (sem quebrar a chamada HTTP) e trata a resposta normalmente: exibe resultados quando existirem correspondências ou o estado vazio de RF10 quando não existirem. Símbolos sem correspondência não devem gerar erro técnico visível ao usuário. |
| **Falha de API** — a API de geocodificação ou de previsão responde com erro (indisponibilidade, erro 5xx, resposta malformada) ou a conexão de rede falha. | A aplicação captura a falha, remove o indicador de carregamento e exibe uma mensagem de erro compreensível em pt-BR (RF09), sem expor detalhes técnicos brutos, e sem deixar a interface travada ou em estado de carregamento indefinido (RNF06). |
| **Timeout** — a requisição de geocodificação ou de previsão não recebe resposta dentro do limite de 10 segundos definido em RNF12. | A aplicação cancela a espera pela resposta, trata a requisição como expirada e exibe uma mensagem informando que o tempo de resposta foi excedido, sugerindo tentar novamente (RF09, RNF12). |
| **Geocoding sem resultados** — a busca é enviada e o serviço de geocodificação retorna uma lista vazia (zero cidades correspondentes). | A aplicação exibe uma mensagem de estado vazio distinta de erro técnico, orientando o usuário a tentar outro termo de busca (RF10), sem exibir dados de clima ou previsão. |
| **Resposta parcial** — a API de previsão retorna dados incompletos para um ou mais dias (ex.: sem temperatura mínima, sem código de condição, ou menos de cinco dias retornados). | Para campos ausentes em um dia existente, a aplicação indica explicitamente a ausência do dado (ex.: "indisponível") em vez de omitir o dia inteiro ou exibir um valor vazio sem explicação (RF05). Se a API retornar menos de cinco dias, a aplicação exibe os dias disponíveis e comunica que a janela completa de cinco dias não pôde ser obtida. |
| Múltiplas cidades homônimas em países ou estados diferentes. | Exigir seleção explícita, exibindo dados suficientes para diferenciação (RF02). |
| Usuário dispara buscas sucessivas rapidamente (ex.: digita e corrige a cidade antes da resposta anterior chegar). | A interface exibe apenas o resultado da busca mais recente, ignorando ou cancelando respostas desatualizadas. |
| Alternância de unidade antes de qualquer cidade ser selecionada. | O controle permanece funcional e não gera erro, sem dados de temperatura para converter. |
| Cidade selecionada cujo fuso horário difere do fuso do dispositivo. | Os dias da previsão refletem o fuso horário local da cidade retornado pela API, evitando associar dados ao dia errado. |
| Uso em viewport de 320px de largura. | Todos os controles (busca, seleção de cidade, alternância de unidade) permanecem visíveis e operáveis sem rolagem horizontal. |
| Navegação exclusivamente por teclado. | Busca, seleção de cidade na lista de desambiguação e alternância de unidade são alcançáveis e acionáveis via teclado, com foco visível. |

## Assumptions

- A consulta será iniciada por uma cidade informada manualmente, sem exigir
  permissão de geolocalização do dispositivo.
- A previsão será apresentada como um resumo diário, contendo condição, mínima
  e máxima para hoje e os quatro dias seguintes, sem detalhamento horário.
- As cidades serão desambiguadas usando nome, região administrativa e país
  quando esses dados estiverem disponíveis na fonte consultada.
- O estado inicial exibirá uma instrução para pesquisar uma cidade, sem dados
  simulados ou cidade pré-selecionada.
- A busca será disparada pelo envio explícito do formulário (por exemplo,
  tecla Enter ou clique em um botão de busca), e não a cada tecla digitada,
  salvo decisão posterior em contrário durante o planejamento técnico.
- A aplicação não persistirá a última cidade pesquisada nem a unidade
  escolhida entre sessões nesta primeira versão, salvo decisão posterior em
  contrário.
- Open-Meteo é a única fonte de dados de geocodificação e previsão nesta
  versão; não há fallback para outro provedor.
- Os alvos mínimos de validação automatizada são um navegador desktop
  Chromium e um viewport mobile equivalente a iPhone 13 (RNF13); suporte a
  outros navegadores evergreen é esperado, mas não coberto por testes
  automatizados nesta versão.

## Risks

| Risco | Impacto no Produto | Mitigação Prevista na Spec |
| --- | --- | --- |
| Indisponibilidade ou lentidão da API Open-Meteo | O app não consegue exibir clima atual ou previsão. | RNF12 define timeout de 10s; RF09 exige mensagem de erro compreensível. |
| Limite de requisições da API excedido | Buscas podem parar de retornar dados em picos de acesso. | A tratar no plano técnico (debounce, cache de respostas recentes). |
| Cidade homônima selecionada incorretamente | Usuário recebe previsão de outra localidade. | RF02 exige exibição de estado/região e país e seleção explícita. |
| Cobertura incompleta de cidades pela API | Usuários não encontram localidades relevantes. | RF10 cobre o estado vazio com orientação ao usuário. |
| Interpretação incorreta de códigos meteorológicos | Condições exibidas podem ser confusas ou erradas. | A tratar no plano técnico (mapeamento versionado de códigos). |
| Datas incorretas por fuso horário | Previsão diária associada ao dia errado. | Edge case documentado; uso do fuso horário retornado pela API. |
| Conversão inconsistente entre Celsius e Fahrenheit | Temperaturas divergentes após alternância. | RF07 exige atualização consistente e fórmula única de conversão. |
| Respostas fora de ordem em buscas rápidas | Resposta antiga substitui resultado da busca mais recente. | Edge case documentado; exige exibir apenas a resposta mais recente. |
| Baixa acessibilidade | Usuários de teclado/tecnologia assistiva não conseguem usar o app. | RNF02 e RNF09 exigem WCAG 2.1 AA e operação por teclado. |
| Escopo cresce sem priorização | Itens como favoritos, geolocalização e alertas atrasam o MVP. | Seção Out of Scope delimita explicitamente o que fica de fora. |

## Out of Scope

- Autenticação de usuários e contas.
- Persistência de dados, seja em servidor ou no cliente (favoritos,
  histórico, última cidade pesquisada, unidade de temperatura escolhida ou
  qualquer outra preferência via localStorage/cookies) — consistente com as
  Assumptions.
- Geolocalização automática do dispositivo para detectar a cidade do usuário.
- Alertas meteorológicos (avisos de tempestade, ondas de calor, etc.).
- Previsão horária detalhada (apenas resumo diário está no escopo).
- Dados meteorológicos além de temperatura e condição (sensação térmica,
  umidade, vento, pressão, precipitação) e unidades de medida além de
  Celsius/Fahrenheit (ex.: km/h, hPa, mm).
- Suporte a múltiplos idiomas além do pt-BR.
- Aplicativo nativo mobile (o escopo é uma aplicação web responsiva).
- Suporte offline ou funcionalidade de PWA (service worker, cache offline,
  instalação como app).
- Compartilhamento, exportação ou impressão dos dados de previsão.
- Monitoramento e observabilidade em produção (painéis, alertas de operação).
- Fallback para provedores de dados meteorológicos além do Open-Meteo.
- Testes automatizados de compatibilidade em navegadores além dos alvos
  definidos em RNF13 (Chromium desktop e viewport iPhone 13).

## Open Questions

Nenhuma das perguntas abaixo bloqueia o início do desenvolvimento do MVP: em
ambos os casos, a spec já define um piso funcional suficiente (RF03 e Data
Requirements) e o item fica formalmente fora do escopo desta versão (ver Out
of Scope).

- Quais informações devem compor o clima atual além de temperatura e
  condição (sensação térmica, umidade, vento, pressão, precipitação)? Não
  bloqueia o MVP; RF03 já define o piso mínimo obrigatório.
- Como a disponibilidade de 99,5% (RNF11) será medida e monitorada na
  prática, e quais exclusões além de indisponibilidade da API externa são
  aceitáveis? Não bloqueia o desenvolvimento da aplicação; é uma decisão
  operacional/infra pós-deploy.

> As perguntas sobre gatilho de busca (envio vs. digitação), persistência de
> preferências entre sessões, estado no primeiro acesso e navegadores
> suportados foram resolvidas nesta versão — ver Assumptions e RNF13.
