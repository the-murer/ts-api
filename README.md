

# Projeto API

Este é o repositório para a API que se conecta com mongo.

## Pré-requisitos

Certifique-se de ter os seguintes softwares instalados em sua máquina:

- [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm)

- [Yarn](https://classic.yarnpkg.com/en/docs/install/)

## Instalação

1. Clone o repositório:

```sh
git clone https://github.com/the-murer/ts-api.git
cd ts-api
```

2. Utilize a Node version especificada:

```sh
nvm use
```

3. Instale as dependências do projeto:

```sh
yarn install
```

4. Crie um arquivo `.env` na raiz do projeto e configure as variáveis de ambiente necessárias:

```plaintext
PORT=<número-da-porta>
JWT_KEY=<chave-secreta>
MONGO_URI=<sua-url-de-conexão-com-o-mongodb-atlas>
```
- `PORT`: A porta que você deseja que a API utilize, recomenda-se a porta 5005.
- `JWT_KEY`: A chave secreta para autenticação JWT.
- `MONGO_URI`: A URL de conexão com o MongoDB Atlas. Você pode obter esta URL em [MongoDB Atlas](https://account.mongodb.com/account/login).

Dica, para criar automaticamente o banco no mongo, coloque o nome do banco antes do ?:
`mongodb+srv://<user>:<password>@cluster0.mongodb/<database>?appName=Cluster0`
5. Inicie o servidor:

```sh
yarn dev
```

## Uso

Após iniciar o servidor, sua API estará rodando na porta que você especificou no arquivo `.env`. Você pode acessar as rotas da API via `http://localhost:<PORT>`.
