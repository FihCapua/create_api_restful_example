const mongoose = require('mongoose')

const Movie = mongoose.model('Movie', {
    name: String,
    image: String,
    rating: String,
    comments: String,
    approved: Boolean,
}) // nome da tabela que será criada no banco

module.exports = Movie