const express = require('express')
const app = express()

// app.use(express.static('public'))

app.get("/", (request, response) => response.sendFile(__dirname + '/index.html'))
app.get("/calendar", require('./endpoints/calendar'))

const listener = app.listen(8080, () => {
    console.log(`Your app is listening on port ${listener.address().port}`)
})
