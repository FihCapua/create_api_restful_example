const router = require('express').Router()

const Movie = require('../models/Movies') 

// rotas da API - (Criação dos dados)
router.post('/', async (req, res) => {
    /* corpo da req - onde chegam os dados
        utilizando o destructuring espera que os dados cheguem, ex: { name: 'Matrix', rating: '5 estrelas', comments: 'Muito bom!', approved: true }
    */
    const { name, image, rating, comments, approved } = req.body // o body espera do front essas informações descritas acima (por meio de formulário, etc)

    // validações na API
    if(!name) {
        res.status(422).json({ error: 'O nome é obrigatório '}) // status de não foi possível processar as infomações no sistema
        return
    }

    if(!rating) {
        res.status(422).json({ error: 'Avaliações são obrigatórias'})
        return
    }


    // esse objeto será passado para o banco pra inserir
    const movie = {
        name,
        image,
        rating,
        comments,
        approved
    }

    // create
    try {
       await Movie.create(movie) // aqui será criado o registro na tabela chamando o obj acima

       res.status(201).json({ message: 'Novo filme inserido com sucesso!' }) // req sucesso e POST criado
    } catch (error) {
        res.status(500).json({ error: error }) // atribuindo um erro diretamente ao servidor (status 500)
    }
}) // padrão /movie para inserir os filmes no sistema


// rotas da API - (leitura dos dados)
router.get('/', async (req, res) => {
    try {
        const movie = await Movie.find() // o find busca TODAS as informações do banco referentes ao registro movie

        res.status(200).json(movie)        
    } catch (error) {
        res.status(500).json({ error: error }) // atribuindo um erro diretamente ao servidor (status 500)
    }
})

        // rotas dinamicas para buscar filmes pelo ID direto da informação do banco
router.get('/:id', async (req, res) => {
    
    /* console.log(req);

        todos os dados necessários na requisição vem dentro do obj req - body/ params, etc

    */

    // extrai o dado da requisição pela url pelo req.params e não pelo body
    const id = req.params.id

    try {
        // o findOne busca somente por uma informação do banco referente aquele registro
        const movie = await Movie.findOne({ _id: id })

        // tratamento para quando um filme não for encontrado (entre a requisição no banco e a resposta)
        if(!movie) {
            res.status(422).json({ message: 'O filme não foi encontrado' })
            return 
        }

        res.status(200).json(movie)
    } catch (error) {
        res.status(500).json({ error: error }) // atribuindo um erro diretamente ao servidor (status 500)
    }
})



// rotas da API - (atualização dos dados - (PUT, PATCH))
router.patch('/:id', async (req, res) => {
    const id = req.params.id // a url será resgatada (virá) com o id do usuário

    const { name, image, rating, comments, approved } = req.body // e o corpo virá com os dados que serão atualizados

     // esse objeto será passado para o banco pra inserir
     const movie = {
        name,
        image,
        rating,
        comments,
        approved
    }

    try {
        // dado atualizado = salva em uma var e retorna o dado atualizado
        const updatedMovie = await Movie.updateOne({ _id: id }, movie)

        if(updatedMovie.matchedCount === 0) {
            res.status(422).json({ message: 'O filme não foi encontrado' })
            return 
        } // matchedCount = quantas atualizações houveram / tratamento para quando der zero pq nao encontrou filme

        res.status(200).json(movie)
        
    } catch (error) {
        res.status(500).json({ error: error }) // atribuindo um erro diretamente ao servidor (status 500)
    }
})


// rotas da API - (deletatr dados)
router.delete('/:id', async (req, res) => {
    const id = req.params.id // a url será resgatada (virá) com o id do usuário

    // Verifica se o usuário existe
    // o findOne busca somente por uma informação do banco referente aquele registro
    const movie = await Movie.findOne({ _id: id })

    // tratamento para quando um filme não for encontrado (entre a requisição no banco e a resposta)
    if(!movie) {
        res.status(422).json({ message: 'O filme não foi encontrado' })
        return 
    }

    try {
        await Movie.deleteOne({ _id: id })

        res.status(200).json({ message: 'Filme removido com sucesso' })        
    } catch (error) {
        res.status(500).json({ error: error }) // atribuindo um erro diretamente ao servidor (status 500)
    }
    
})

module.exports = router