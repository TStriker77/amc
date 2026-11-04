# Horizonte — portal público de investimentos

> A opção de resumos por IA está desativada por solicitação do usuário. O bloco O que observar voltou ao texto informativo e ao link público da CVM; o portal não carrega nem gera resumos. Os arquivos auxiliares foram preservados apenas para eventual retomada. Nenhuma automação foi criada.


Site em HTML, CSS e JavaScript, sem instalação de dependências, login ou plano pago. Ações, units, fundos imobiliários e guia de renda fixa, com busca por nome/ticker, filtros por setor, ordenação, paginação, páginas individuais e favoritos locais. Temas claro e escuro.

## Executar

Com Node.js 20 ou superior, nesta pasta:

```sh
node server.js
```

Abra http://127.0.0.1:4173. Mantenha o processo aberto enquanto usa o site. Se já houver um servidor antigo rodando, encerre-o antes de iniciar novamente. Também é possível abrir index.html diretamente; nesse modo, o catálogo incluído usa local-app.js.

```sh
node --test
node --check app.js
node --check public-core.js
```

## GitHub Pages

Envie os arquivos index.html, styles.css, app.js, public-core.js, catalog.json e .nojekyll para a raiz da branch principal. Em Settings → Pages, escolha Deploy from a branch, main e /(root). Não há build. Os caminhos relativos funcionam em repositórios com subpasta. O servidor Node é apenas para uso local; o GitHub Pages serve os arquivos estáticos.

Não houve publicação automática. Um link 127.0.0.1 funciona apenas no computador de quem o abre. Para acesso por terceiros, publique no GitHub Pages e compartilhe o endereço fornecido por ele.

## Dados e cobertura gratuita

O catálogo incluído contém nomes, códigos e classificações obtidos da listagem pública da brapi. Não contém preços. A cada abertura, o portal tenta consultar https://brapi.dev/api/quote/list?limit=10000. Preços e variações são mostrados somente quando retornados. Há botão manual de atualização; o código evita consultas automáticas repetidas por cinco minutos nesta sessão.

A listagem é uma rota legada do provedor e pode mudar, passar a exigir autenticação ou ficar indisponível. Não há garantia de acesso gratuito permanente. Se falhar, os nomes e códigos permanecem pesquisáveis no catálogo incluído. Nenhuma cotação fictícia é usada. Preços obtidos antes de uma falha permanecem com o horário original da consulta. A listagem não fornece horário de negociação de cada ativo, então mostramos apenas o horário de consulta, sem apresentá-lo como horário do pregão.

Nas páginas de PETR4, VALE3, ITUB4 e MGLU3, os endpoints v2 quote, profile, statistics, financial-data e historical são consultados automaticamente uma vez por sessão do ativo, e novamente pelo botão Atualizar análise. Cada bloco trata sua própria falha sem impedir os outros. PETR4, VALE3, ITUB4 e MGLU3 são os quatro ativos de teste sem token. Outros ativos usam as informações disponíveis na listagem. Não há chave de API no cliente nem backend pago.

A documentação https://brapi.dev/faq/api-e-gratis-mesmo informa atraso aproximado de 30 minutos no plano gratuito. Limites e cobertura podem mudar. As páginas de análise agora mostram perfil, P/L, P/VP, DY informado, LPA, VPA, ROE, margens, EV/EBITDA, resumo financeiro e histórico ajustado de um mês quando retornados gratuitamente para os quatro ativos de teste. Dados ausentes permanecem vazios. Não há calendário de dividendos. A resposta financeira pode não informar moeda ou data-base: essa limitação é exibida e valores sem moeda são apresentados sem símbolo. O gráfico usa adjustedClose e oferece uma tabela acessível com os mesmos pontos. Não há scraping do Investidor10.

Renda fixa é um guia por modalidade (Tesouro, CDB, LCI/LCA, CRI, CRA e debêntures), com fontes oficiais e descrições de emissor, remuneração, liquidez e riscos. Não são ofertas, taxas vigentes ou recomendações.

## Dados pessoais e favoritos

O portal não lê, publica ou apaga os dados do site pessoal anterior (chave horizonte-v1 no localStorage). Eles permanecem apenas no navegador original. Favoritos usam uma nova chave horizonte-public-favorites; tema usa horizonte-theme. Ambos são individuais. Todos recebem o mesmo catálogo e conteúdo público; o resultado de consultas pode variar conforme horário e disponibilidade da API.

As antigas funções e testes de carteira em core.js foram preservados como código legado, mas não são carregados pelo portal. O servidor local só permite acessar os arquivos públicos explicitamente listados em server.js. Arquivos pessoais, fotos e backups não são servidos.

Fontes tipográficas são carregadas do Google Fonts, com fallback local. Os demais acessos externos são consultas à brapi e links oficiais abertos pelo visitante.

## Resumos gratuitos com IA local

O bloco Acontecimentos recentes, explicados usa `news.json`, um arquivo estático comum a todos os visitantes. Não exige login, API paga ou IA instalada no computador de quem visita o portal. O arquivo só muda quando o proprietário executa a atualização local e publica a nova versão.

O gerador usa Ollama em http://127.0.0.1:11434 com o modelo local qwen3:1.7b. Não usa modelos em nuvem. A instalação do Ollama e o download do modelo requerem espaço em disco e conexão; a inferência usa memória e processamento do seu computador. Após instalar o Ollama pelo site oficial https://ollama.com/download/windows:

```powershell
ollama pull qwen3:1.7b
node scripts/start-news.mjs
```

Se Ollama não estiver no PATH da sessão atual, use o executável em `$env:LOCALAPPDATA/Programs/Ollama/ollama.exe`. Para trocar de modelo local, configure HORIZONTE_MODEL com o nome de um modelo já instalado. O script recusa chamadas remotas de IA: o endereço de geração é fixo em 127.0.0.1.

A cobertura automática inicial é a Agência Petrobras de Notícias, para PETR3/PETR4. O gerador consulta a página oficial, descobre as três publicações mais recentes por metadados JSON-LD, lê o corpo completo e gera resumo, fatos com trechos de apoio, possíveis efeitos positivos e riscos. Não promete cobrir toda a imprensa ou todos os documentos entregues à CVM. O link de documentos CVM continua disponível, mas a leitura automática de PDFs da CVM ainda não faz parte deste coletor.

```powershell
node scripts/update-news.mjs --collect-only
node scripts/update-news.mjs --force
```

A primeira opção testa a coleta sem chamar a IA. A segunda refaz análises mesmo quando o texto-fonte não mudou. Textos já resumidos não são processados novamente por padrão. O coletor segue redirecionamentos somente nos domínios oficiais permitidos em news-sources.json e usa curl instalado no sistema. Fontes adicionais com HTML compatível e metadados de artigo podem ser configuradas ali; outras estruturas e PDFs exigem um adaptador específico.

Os textos completos e cópias locais dos resumos ficam em .news-cache, ignorada pelo Git e não servida pelo servidor. O arquivo público news.json contém os resumos, metadados e trechos de apoio para auditoria; trate-o como conteúdo destinado à publicação. O script valida formato e presença literal de evidência para cada fato; isso não garante que toda a interpretação esteja correta. A página identifica os resultados como IA local, não revisados por analista, e separa fatos de hipóteses. Falhas de coleta ou geração preservam os resumos anteriores. Sem notícia válida ou IA disponível, nenhum resumo fictício é criado.

Após executar, recarregue a página ou use Atualizar resumos. Para terceiros verem os novos resumos no GitHub Pages, inclua news.json na publicação junto aos arquivos do site. Não é necessário publicar o modelo, o Ollama, os scripts de geração ou o cache. GitHub Pages não executa o modelo; com o computador desligado, a última versão publicada continua disponível e os textos não se atualizam sozinhos. Não foi criada uma tarefa agendada ou rotina de envio automático ao GitHub.

Nesta instalação, o Ollama portátil oficial está em C:/Users/anton/AppData/Local/Programs/HorizonteOllama/ollama.exe, com execução por CPU e sem adicionar nada ao PATH ou à inicialização do Windows. O comando node scripts/start-news.mjs inicia o serviço local se necessário e gera os resumos. Os modelos ficam na pasta .ollama do usuário, fora do projeto e do repositório. A coleta só ocorre quando esse comando é executado.

## Atualização pelo assistente nesta conversa — fluxo atual

Ollama não é necessário para exibir ou produzir os resumos atuais: os três primeiros foram escritos pelo assistente nesta conversa, a partir do corpo completo das fontes oficiais coletadas. news.json identifica essa origem em model e generationType. A interface usa o rótulo geral Resumo por IA; não apresenta textos desta conversa como gerados pelo modelo local.

Para uma atualização manual, peça nesta conversa: Atualize os resumos das empresas configuradas com as notícias oficiais mais recentes, mantendo fontes, datas, fatos, possíveis pontos positivos e riscos. Um roteiro reutilizável está em ATUALIZACAO_RESUMOS.md. A coleta de textos pode ser feita com node scripts/update-news.mjs --collect-only, que não chama Ollama.

Os scripts de Ollama descritos acima permanecem como alternativa opcional. O download do modelo foi interrompido a pedido durante a mudança de fluxo; a instalação portátil foi preservada. Nenhuma tarefa agendada foi criada. Os resumos não são atualizados continuamente sem uma nova solicitação ou automação configurada. O botão Recarregar resumos apenas lê a versão atual de news.json; ele não dispara uma análise. Terceiros só veem a versão atualizada após a publicação do arquivo no site hospedado.

## Links para documentos por empresa

Os links de documentos agora usam ENETWeb, sem passar pelo redirecionamento do antigo ENET que descarta filtros. cvm-companies.json relaciona tickers a códigos CVM usando correspondência exata de nomes normalizados entre o catálogo e o cadastro oficial em https://dados.cvm.gov.br/dados/CIA_ABERTA/CAD/DADOS/cad_cia_aberta.csv. Quando há cadastros históricos com o mesmo nome, o registro ativo tem preferência, desde que não haja ambiguidade. Também há resolução por CNPJ oficial quando o perfil retornado pela API o informa. Apenas razão social, CNPJ corporativo e código são incluídos; nenhum dado pessoal do cadastro é publicado.

A consulta abre com codigoCVM e tipoconsulta na página atual. A CVM pode exigir selecionar um período e clicar em Consultar; No dia pode não retornar documentos. Quando não há identificação segura, o portal oferece a consulta geral e avisa para pesquisar o nome, sem atribuir um código por aproximação. FIIs usam Fundos.NET, a consulta específica de fundos.

Para GitHub Pages, publique também cvm-companies.json junto aos arquivos estáticos.

### Abrir com dois cliques
Abra index.html diretamente no navegador. A versão local usa local-app.js, com catálogo e cadastro CVM incluídos, sem servidor. Cotações externas exigem internet e podem ser restringidas pelo navegador ou provedor. Após alterar app.js, public-core.js, catalog.json ou cvm-companies.json, regenere com: node scripts/build-local.mjs. O acesso HTTP e o GitHub Pages continuam usando app.js como módulo.
