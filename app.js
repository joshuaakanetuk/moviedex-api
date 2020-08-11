require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movies-data.json')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
    console.log('validate bearer token middleware')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})

app.get('/movie', getMovie)

function getMovie(req, res) {
    const { genre, country, avg_vote } = req.query;
    let results = MOVIES;

    if(avg_vote) {
        results = results.filter(film => Number(avg_vote) <= (Number(film.avg_vote)));
    }
    if(country) {
        results = results.filter(film => film.country.toLowerCase().includes(country.toLowerCase()));
    }
    if(genre) {
        results = results.filter(film => film.genre.toLowerCase().includes(genre.toLowerCase()));
    }

    res.json(results);
}

module.exports = app;