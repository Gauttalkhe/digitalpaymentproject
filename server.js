const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { timeStamp } = require('console');
 
const app=express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/mydata', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((error) => console.log('Error:', error));

//define user schema
const userSchem = new mongoose.Schema({
    name: {type: String,required:true},
    email: {type: String,required:true,unique:true},
    password:{type: String,required:true},
    upi_id:{type: String,unique:true},
    balance:{type:Number}
});

//create user schema
const User=mongoose.model('User',userSchem);

//define transaction schema
const transactionSchema = new mongoose.Schema({
    sender_upi_id:{type:String,required:true},
    reciver_upi_id:{type:String,required:true},
    amount:{type:Number,required:true},
    timestamp:{type:Data,default: Date.now}
});

//create transaction model
const Transaction = mongoose.model('Transaction',transactionSchema);

//function to generate a unique upi id
const generateUIP =()=>
{
    const randomId = crypto.randomBytes(4).toString('hex');// generate a random 8 cahracter id
    return `${randomId}@fastpay`;

};

//signup route
app.post('/api/signup',async(req,res) =>{
  try{
    const {name,email,password}= req.body;

    //check if user already exists
    let user = await User.findOne({email});
    if(user){
        return res.status(400).send({message:'User already exists'})
    }
     
    // generate upi id 
    const upi_id=generateUIP();
    const balance =1000;

    //cerate new user
    user = new user({name,email,password,upi_id,balance});
    await user.save();
    res.status(201).send({message:'User registered successfully',upi_id});
  }catch(error)
  {
    console.error(error);
    res.status(500).send({message:'server error'})
  }

});



