var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const axios = require('axios')


/* GET home page. */
router.post('/', async (req, res)=> {
  let user= await axios.post('http://localhost:4000/find', {
    m: "users",
    f: {userName:req.body.name}
})
if (user.data == null) res.json({message:'user not found'})
else if(await bcrypt.compare(req.body.password,user.data[0].password)){
    const accessToken = jwt.sign({user:req.body.name},'9c82b0b55eb01cd523839e3750bbd286')
    res.json({accessToken:accessToken})
}
else res.json({message:'incorrect password'})
  
  
});

router.get('/prices',authenticateToken,async (req,res)=>{
  let items = await axios.post('http://localhost:4000/find', {
    m: "items",
    f: {storeID:res.curntUser.data[0].storeID}
})
  res.json(items.data)
})


router.post('/save',authenticateToken,async (req,res)=>{
  if (res.curntUser.data[0].post != 'OWNER') res.send({message:'unauthorized user'})
  else{
      let chkitem = await axios.post('http://localhost:4000/find', {
        m: "items",
        f: {name:req.body.name,storeID:res.curntUser.data[0].storeID}
    })
      
      
      if (chkitem.data.length == 0){
          
          let newitem = await axios.post('http://localhost:4000/save', {
            m: "items",
            name: req.body.name,
            id:res.curntUser.data[0].storeID,
            price:req.body.price
        })
          res.json(newitem.data)
      }
      else{
          
          let updtitem = await await axios.post('http://localhost:4000/update', {
            m: "items",
            f: {name:req.body.name,storeID:res.curntUser.data[0].storeID},
            u:{price:req.body.price},
        })
          res.json(updtitem.data)
      }
  }
  
})


function authenticateToken(req,res,next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) res.json({message:'invalid access'})

  jwt.verify(token,'9c82b0b55eb01cd523839e3750bbd286',async (err,user)=>{
      if (err) res.send(err)
      req.user=user
      res.curntUser = await axios.post('http://localhost:4000/find', {
        m: "users",
        f: {userName:req.user.user}
    })
      next()
  })
}

module.exports = router;
