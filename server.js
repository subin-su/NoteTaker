const express = require('express');
const fs = require('fs');
const path=require('path')

const app = express()
const PORT= process.env.PORT || 8080;

app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(express.json())
require('./apiRoutes/api-Routes')(app);



app.listen(PORT,()=>console.log(`listening at http://localhost:${PORT}`))