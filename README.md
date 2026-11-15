# Trabalho

Projeto de Programação Web II, Etapa 1.

Tema: cadastro de filmes e séries.

## Como executar

Instale as dependências uma vez:

```bash
npm install
```

Em terminais separados, na pasta do projeto, inicie a API e a aplicação:

```bash
npm run api
```

```bash
npm run dev
```

O `json-server` disponibiliza os cadastros em `http://localhost:3000/cadastros` e grava os novos itens em `db.json`. Mantenha os dois processos rodando enquanto usa a aplicação.

## O que foi feito

- Páginas Início, Cadastro e Sobre, além da página não encontrada.
- Cadastro com título, ano, tipo e checkbox de assistido.
- Validação dos campos obrigatórios e do ano (maior que zero).
- Cadastros carregados da API e lista atualizada após salvar.

Os cadastros são persistidos no arquivo `db.json` pelo `json-server`, então continuam disponíveis ao trocar de página ou recarregar a aplicação.

Para mostrar a página não encontrada, abra `/pagina-que-nao-existe`.
