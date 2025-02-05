const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
require('dotenv').config()

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(cors());
app.use(express.json())

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('DB connected'))
  .catch((err) => console.Console.log(err))

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
})
const User = mongoose.model('User', userSchema)

app.post('/login',async(req,res)=>{
  try{
    const {email,password}=req.body

    if(!email || !password){
      return res.status(400).send({messsage:'All the fields are required'})
    }

    const user=await User.findOne({email})
    if(!user){
      return res.status(404).send({messsage:'User not found',success:false})
    }

    const match=await bcrypt.compare(password,user.password)
    if(!match){
      return res.status(401).send({messsage:'Invalid user details'})
    }
    return res.status(200).send({messsage:'Login successfull',success:true})

  }catch(err){
    return res.status(500).send({messsage:'Internal server error',Error:err.messsage})
  }
})

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
