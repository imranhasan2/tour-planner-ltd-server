const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors =require('cors')
require('dotenv').config()

//middleware
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send('tour is running')
})

app.listen(port, () => {
  console.log(`tour planner is listening on port: ${port}`)
})