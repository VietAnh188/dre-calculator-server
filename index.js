const express = require('express')
const http = require('http')
const path = require('path')
const cors = require('cors')

const app = express()
const server = http.createServer(app)

const router = express.Router()

const PORT = process.env.PORT || 1234

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'))
})

app.use(cors())

app.use('/', router)

app.use(express.static(path.join(__dirname, 'assets')))

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})