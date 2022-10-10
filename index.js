// config inicial
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()

// forma de ler JSON/ middleware
app.use(
    express.urlencoded({
      extended: true,
    }),
)

app.use(express.json());

// rota inicial - json / enpoint
app.get('/', (req, res) => {
    res.json(
        { message: 'Oi Express!' }
    )
})

// rotas da api utilizado o router do arquivo movieRoutes (Criação dos dados)
const movieRoutes = require('./routes/movieRoutes')

app.use('/movie', movieRoutes) // configurando o caminho da rota que será redirecionada pra o arquivo movieRoutes.js

// conectar ao mongoose
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@clusterapitest.eyavj6e.mongodb.net/?retryWrites=true&w=majority`)
// o que fazer depois que conectar com sucesso
.then(() => {
    app.listen(3000)
    console.log('Conectado ao MongoDB');
})
// o que fazer se der erro na conexão
.catch((err) => console.log(err))

// listar qual porta sera usada
app.listen(3000)