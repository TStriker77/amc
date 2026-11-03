# Horizonte — finanças pessoais

Site estático em português, feito com HTML, CSS e JavaScript, sem dependências de instalação ou login. A carteira inicia vazia. Inclui perfil e foto, cadastro de aplicações, operações de ações, custo médio com taxas, resultado realizado, proventos manuais, gráficos, temas claro/escuro, cotações e backup.

## Executar localmente

Instale Node.js 20 ou superior. Nesta pasta, execute:

```sh
npm start
```

Se `npm` não estiver disponível, execute `node server.js` diretamente. Os testes podem ser executados com `node --test`.

Abra http://localhost:4173. Use sempre o mesmo endereço para acessar o mesmo armazenamento. Não abra o HTML diretamente por `file://`: os módulos JavaScript precisam de um servidor HTTP.

```sh
npm test
npm run check
```

## GitHub Pages

1. Crie um repositório no GitHub e envie `index.html`, `styles.css`, `app.js`, `core.js` e `.nojekyll` para a raiz da branch `main`. Pode enviar também os arquivos de documentação, servidor e testes.
2. Em **Settings → Pages → Build and deployment**, escolha **Deploy from a branch**, branch **main**, pasta **/(root)**, e salve.
3. Abra o endereço fornecido pelo GitHub. Todos os caminhos dos arquivos são relativos, inclusive para repositórios em subpastas. Não é necessário build.

Nada foi publicado automaticamente. Não envie backups pessoais nem chaves ao repositório. A aplicação não fornece controle de acesso: o código publicado fica acessível conforme a configuração do GitHub Pages, mas os registros da carteira ficam no navegador de cada visitante.

## Dados e importação

O armazenamento usa localStorage, sem login ou sincronização. Limpar o navegador ou trocar de endereço pode deixar os dados indisponíveis. Exporte backups regularmente em **Dados e backup**. Restaurar um JSON substitui o conjunto atual após confirmação; os arquivos são validados antes de salvar. A foto (PNG/JPG/WebP até 1 MB) entra no backup. A chave da brapi permanece apenas em memória até recarregar a página.

A importação de planilhas aceita **CSV UTF-8 de operações**, não XLSX nativo. No Excel/LibreOffice, salve como CSV. Use o modelo disponível no site e mantenha os cabeçalhos:

```csv
ticker;side;quantity;price;fees;date
```

`side`: `Compra` ou `Venda`; `quantity`: quantidade positiva; `price`: preço unitário positivo; `fees`: taxas totais, zero se não houver; `date`: `AAAA-MM-DD`. Decimais podem usar ponto ou vírgula (com delimitador ponto e vírgula). Cada importação adiciona registros: importar novamente duplica as operações. O site confirma a quantidade antes de adicionar. Aplicações e dividendos são cadastrados pela interface e transferidos pelo backup completo.

## Cálculos

As operações seguem data e ordem de cadastro no mesmo dia. Compras incorporam taxas ao custo médio ponderado; vendas retiram custo proporcional e descontam taxas do resultado realizado. Uma venda maior que a posição disponível é rejeitada, inclusive ao editar/excluir compras ou restaurar backups. Não há venda a descoberto, apuração de IR, ajuste automático por eventos societários ou conciliação com corretoras. Reflita eventos societários manualmente nos registros.

O patrimônio registrado soma o saldo manual das aplicações e o custo das posições abertas de ações. Não é uma marcação a mercado. Não cadastre as mesmas ações também como aplicação, para evitar dupla contagem. O saldo de renda fixa é informado manualmente; a taxa contratada é apenas uma anotação. Proventos são valores efetivamente recebidos informados pelo usuário; não há previsão automática.

## Mercado e fontes

Integração com a [brapi v2](https://brapi.dev/docs/openapi), endpoint `/api/v2/stocks/quote?symbols=TICKER`, com uma requisição por ativo. A [documentação do plano gratuito](https://brapi.dev/faq/api-e-gratis-mesmo), consultada em 03/11/2026, informa 15.000 requisições/mês, um ticker por chamada e atraso aproximado de 30 minutos; dividendos automáticos não estão incluídos. PETR4, VALE3, ITUB4 e MGLU3 são ativos de teste sem token. Para outros, obtenha uma chave no provedor e informe-a na página Mercado. Limites e disponibilidade podem mudar.

As consultas são manuais ou, opcionalmente, a cada cinco minutos enquanto a aba Mercado estiver visível. São exibidos o horário do dado e o da consulta. Fora do pregão pode aparecer a última negociação; rede, CORS, autenticação ou limites podem impedir a atualização. Não há promessa de tempo real. Preços anteriores permanecem com o horário original se uma consulta falhar. As cotações não alteram o saldo registrado da carteira.

Fontes DM Sans/Manrope são solicitadas ao Google Fonts, com fallback local quando indisponíveis. Nenhuma biblioteca de terceiros executa código no site.
