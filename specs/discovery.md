# Discovery - Aplicação de Previsão do Tempo

## Contexto

A empresa solicitou uma aplicação de previsão do tempo voltada a usuários que
precisam consultar rapidamente as condições meteorológicas de cidades de seu
interesse. A primeira versão deve oferecer consulta por cidade, exibição do
clima atual, previsão para os próximos cinco dias, conversão entre unidades de
temperatura e uma experiência adequada para dispositivos móveis.

O produto depende do Open-Meteo para dados meteorológicos e geocodificação de
cidades. O foco do escopo inicial é a consulta de previsão; o MVP não inclui
autenticação, persistência em servidor ou alertas meteorológicos.

## Personas

| Persona | Objetivo Principal | Contexto de Uso | Métrica de Sucesso |
| --- | --- | --- | --- |
| Mariana, 32 anos, profissional urbana | Consultar rapidamente o clima antes de sair de casa para decidir roupa, transporte e necessidade de guarda-chuva. | Principalmente mobile, em deslocamento ou pouco antes de sair; a conexão pode ser móvel e instável. | Encontrar sua cidade e entender a condição atual e a previsão do dia em menos de 30 segundos, sem erro ou necessidade de repetir a busca. |
| Rafael, 41 anos, viajante a trabalho | Comparar a previsão dos próximos dias em uma cidade de destino para preparar a mala e organizar compromissos. | Desktop durante o planejamento e mobile durante a viagem; pesquisa diferentes cidades. | Identificar temperatura mínima, máxima e condições dos próximos cinco dias para uma cidade em uma única consulta. |
| Joana, 58 anos, usuária orientada a rotina | Verificar o clima de sua cidade diariamente para planejar caminhada, compras e atividades externas. | Predominantemente mobile, com preferência por telas legíveis, controles simples e acesso repetido à mesma cidade. | Acessar e compreender o clima atual e a previsão sem depender de ajuda, usando fonte legível, contraste adequado e navegação por toque ou teclado. |

## Decisões

| Decisão | Justificativa | Pergunta em Aberto Resolvida |
| --- | --- | --- |
| Usar Open-Meteo como fonte de geocodificação e dados meteorológicos, sem API key. | Reduz o tempo de implementação e elimina o gerenciamento de credenciais na primeira versão. | Define a fonte de dados meteorológicos e de geocodificação. |
| A previsão de cinco dias será composta por hoje e os quatro dias seguintes. | Estabelece uma janela previsível e alinhada a uma consulta de planejamento de curto prazo. | Define o significado de “cinco dias” para a previsão. |
| Celsius será a unidade de temperatura padrão. | É a unidade mais familiar para o público inicial de língua portuguesa no Brasil, sem eliminar a alternância para Fahrenheit. | Define a unidade exibida no primeiro acesso. |
| A primeira versão não terá autenticação nem persistência em servidor. | Mantém o MVP focado na consulta de previsão e evita o escopo de contas, banco de dados e gestão de dados de usuários. | Delimita o escopo de autenticação e persistência remota; a persistência local de preferências continua sujeita a decisão específica. |
| A interface será apresentada em pt-BR. | Atende ao público inicial e reduz o escopo de internacionalização da primeira versão. | Define o idioma da UI e exclui suporte a idiomas adicionais no MVP. |

## Requisitos Funcionais

- RF01: O usuário deve poder pesquisar uma cidade pelo nome.
- RF02: A aplicação deve apresentar opções para desambiguar a cidade quando a
  busca retornar localidades com o mesmo nome ou nomes semelhantes.
- RF03: A aplicação deve exibir o clima atual da cidade selecionada, incluindo
  no mínimo temperatura e condição meteorológica.
- RF04: A aplicação deve exibir a previsão meteorológica para os próximos cinco
  dias da cidade selecionada.
- RF05: Para cada dia da previsão, a aplicação deve apresentar data, condição
  meteorológica e temperaturas previstas mínima e máxima.
- RF06: O usuário deve poder alternar a unidade de temperatura entre Celsius
  (C) e Fahrenheit (F).
- RF07: Ao alternar a unidade, a aplicação deve atualizar consistentemente as
  temperaturas exibidas no clima atual e na previsão de cinco dias.
- RF08: A aplicação deve informar estados de carregamento durante buscas e
  consultas de previsão.
- RF09: A aplicação deve informar erros compreensíveis quando não for possível
  localizar a cidade ou obter os dados meteorológicos.
- RF10: A aplicação deve apresentar uma orientação para o usuário quando não
  houver resultados de busca ou ainda não houver uma cidade selecionada.

### Revisão de Classificação

| Item | Classificação | Justificativa |
| --- | --- | --- |
| RF01 | Funcional | Define a capacidade de pesquisar uma cidade. |
| RF02 | Funcional | Define o comportamento de desambiguação de resultados. |
| RF03 | Funcional | Define a exibição do clima atual. |
| RF04 | Funcional | Define a exibição da previsão de cinco dias. |
| RF05 | Funcional | Define os dados apresentados para cada dia previsto. |
| RF06 | Funcional | Define a ação de alternar a unidade de temperatura. |
| RF07 | Funcional | Define a atualização dos dados após a alternância de unidade. |
| RF08 | Funcional | Define a apresentação de um estado de carregamento. |
| RF09 | Funcional | Define a apresentação de mensagens em cenários de falha. |
| RF10 | Funcional | Define o comportamento no estado vazio ou sem resultados. |

## Requisitos Não-Funcionais

- RNF01: A interface deve ser responsiva e utilizável em dispositivos móveis,
  incluindo telas estreitas e interação por toque.
- RNF02: Os controles devem ser acessíveis por teclado e possuir rótulos
  semânticos adequados para tecnologias assistivas.
- RNF03: A aplicação deve comunicar claramente carregamento, ausência de dados
  e falhas sem depender exclusivamente de cor ou ícones.
- RNF04: Os dados meteorológicos devem ser obtidos de uma API confiável por uma
  conexão segura (HTTPS).
- RNF05: A aplicação deve manter tempos de resposta percebidos adequados e não
  bloquear a interação do usuário enquanto aguarda respostas da API.
- RNF06: A implementação deve tratar respostas inválidas, indisponibilidade da
  API e falhas de rede de forma resiliente.
- RNF07: A interface e a documentação do produto devem estar em pt-BR, salvo
  termos técnicos ou dados retornados pela fonte externa quando aplicável.
- RNF08: Em uma conexão móvel 4G simulada, a aplicação deve exibir conteúdo
  utilizável ou um estado de carregamento em até 3 segundos após o acesso.
- RNF09: A interface deve atender ao nível AA das Diretrizes de Acessibilidade
  para Conteúdo Web (WCAG) 2.1, incluindo contraste de texto, foco visível e
  operação integral por teclado.
- RNF10: A interface deve funcionar sem rolagem horizontal e manter todos os
  controles operáveis em larguras de viewport entre 320 px e 1440 px.
- RNF11: O serviço hospedado deve alcançar disponibilidade mensal de pelo menos
  99,5%, excluídas indisponibilidades comprovadas da API meteorológica externa.
- RNF12: Depois que a busca for enviada, a aplicação deve exibir uma resposta,
  dados, estado vazio ou mensagem de erro em até 10 segundos; após esse limite,
  a requisição deve ser considerada expirada e comunicada ao usuário.

## Riscos

| Risco | Tipo | Probabilidade | Impacto | Estratégia de Mitigação |
| --- | --- | --- | --- | --- |
| Indisponibilidade ou lentidão da API meteorológica | Técnico | Média | Alto: o app não consegue exibir clima atual ou previsão, comprometendo sua função principal. | Validar a cobertura e os limites do Open-Meteo, configurar timeout, tratar falhas com mensagem clara, registrar erros e documentar uma fonte alternativa. |
| Limite de requisições da API excedido | Técnico | Média | Alto: buscas podem parar de retornar dados, especialmente em picos de acesso. | Avaliar limites antes da integração, aplicar debounce na busca, cachear respostas recentes e monitorar códigos de rate limit. |
| Cidade homônima selecionada incorretamente | Produto | Alta | Alto: o usuário recebe previsão de outra localidade e perde confiança no produto. | Exibir estado, país e coordenadas nos resultados; exigir seleção explícita quando houver mais de uma opção. |
| Cobertura incompleta de cidades pela API | Técnico | Média | Médio/alto: usuários não conseguem pesquisar localidades relevantes. | Validar a cobertura do Open-Meteo com uma amostra representativa e definir mensagem para locais sem cobertura. |
| Interpretação incorreta de códigos meteorológicos | Técnico | Média | Médio: condições exibidas podem ser confusas ou erradas. | Criar mapeamento versionado entre códigos da API, textos em pt-BR e ícones; incluir testes unitários para todos os códigos suportados. |
| Datas incorretas por fuso horário | Técnico | Média | Alto: previsão diária e clima atual podem ser associados ao dia errado. | Usar o fuso horário retornado para a cidade pela API, testar localidades em fusos distintos e evitar conversões implícitas no cliente. |
| Conversão inconsistente entre Celsius e Fahrenheit | Técnico | Média | Médio: temperaturas atuais e da previsão podem divergir após alternância. | Preferir unidade fornecida diretamente pela API; quando converter, centralizar fórmula e cobrir conversões com testes unitários. |
| Experiência móvel insuficiente | Produto | Média | Alto: o requisito explícito de uso em dispositivos móveis não é atendido. | Adotar abordagem mobile-first, testar em viewports de 320 px a 1440 px, validar toque, legibilidade e ausência de rolagem horizontal. |
| Baixa acessibilidade | Produto/Técnico | Média | Alto: pessoas que usam teclado ou tecnologias assistivas podem não conseguir consultar o clima. | Atender WCAG 2.1 nível AA, usar elementos semânticos, foco visível, contraste adequado, rótulos acessíveis e testes manuais por teclado. |
| Desempenho fraco em redes móveis | Técnico | Média | Médio/alto: usuários abandonam a busca antes de receber a previsão. | Reduzir JavaScript inicial, exibir feedback de carregamento rapidamente, definir timeout, cachear resultados e medir desempenho em 4G simulado. |
| Respostas fora de ordem em buscas rápidas | Técnico | Média | Médio: uma resposta antiga pode substituir o resultado da cidade mais recente. | Cancelar requisições pendentes com `AbortController` ou ignorar respostas cuja consulta não seja mais atual. |
| Dados climáticos desatualizados | Produto | Média | Médio: o usuário pode tomar decisões com informações antigas. | Exibir horário de atualização, definir TTL de cache e atualizar dados quando a cidade for pesquisada novamente. |
| Interface sem estado vazio ou mensagens acionáveis | Produto | Média | Médio: usuários não entendem como iniciar uma consulta ou como corrigir uma busca sem resultado. | Projetar e validar estados de primeira visita, carregamento, ausência de resultados e erro com mensagens objetivas e próxima ação clara. |
| Escopo cresce sem priorização | Produto | Alta | Alto: itens como favoritos, geolocalização, alertas, previsão horária e múltiplos idiomas atrasam a versão inicial. | Definir um MVP explícito, registrar itens fora do escopo e aprovar mudanças por impacto em prazo, custo e critérios de aceite. |
| Ausência de monitoramento em produção | Técnico | Média | Médio: falhas de API, erros de conversão e problemas de desempenho só são percebidos por reclamações. | Instrumentar erros, latência e taxa de sucesso das buscas; configurar alertas e painel mínimo de observabilidade. |
| Dependência de uma única API externa | Técnico | Média | Alto: alteração de contrato, política ou encerramento do serviço pode interromper o produto. | Isolar o provedor em uma camada de serviço, versionar contratos, acompanhar mudanças e documentar plano de contingência. |
| Requisitos de disponibilidade inexequíveis | Produto/Técnico | Baixa | Médio: uma meta como 99,5% não será mensurável nem gerenciável sem definição operacional. | Definir escopo da medição, ferramenta de monitoramento, janela de cálculo, exclusões e responsabilidades sobre indisponibilidade de terceiros. |

## Perguntas em Aberto

- Quais informações devem compor o clima atual além da temperatura e condição,
  como sensação térmica, umidade, vento, pressão ou precipitação?
- A previsão de cinco dias deve apresentar somente um resumo diário ou também
  intervalos horários?
- Quais campos devem ser exibidos para diferenciar cidades homônimas?
- A busca deve ocorrer ao digitar, ao enviar o formulário ou nas duas situações?
- A aplicação deve manter a última cidade pesquisada e a unidade escolhida entre
  sessões?
- Qual localidade deve ser exibida no primeiro acesso: uma cidade padrão, a
  localização atual do dispositivo ou apenas um estado vazio?
- Quais navegadores e versões mínimas devem ser suportados na primeira versão?

## Suposições

- A consulta será iniciada por uma cidade informada manualmente, sem exigir
  permissão de geolocalização do dispositivo.
- A previsão será apresentada como um resumo diário, contendo condição, mínima
  e máxima para hoje e os quatro dias seguintes.
- As cidades serão desambiguadas usando nome administrativo e país quando esses
  dados estiverem disponíveis na fonte consultada.
- O estado inicial exibirá uma instrução para pesquisar uma cidade, sem dados
  simulados ou cidade pré-selecionada.