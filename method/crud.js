
var express = require('express');
var app= express()
var con = require('../controller/controller.js')


app.use(express.json())
/* GET home page. */
app.post('/find', async (req, res)=> {
  res.json( await con.find(req.body.m,req.body.f))

   
  
});

app.post('/update', async (req, res)=> {
  res.json( await con.update(req.body.m,req.body.f,req.body.u))

   
  
});

app.post('/save', async (req, res)=> {
  let item={name:req.body.name,storeID:req.body.id,price:req.body.price}
  res.json( await con.create(req.body.m,item))
   
  
});


app.listen(4000,()=>console.log('4000'))
