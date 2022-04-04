const user= require('../pm/models/user');
const items= require('../pm/models/items');
const store= require('../pm/models/store');
const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler') 


module.exports={
 
    find: async (m, f) => {
        return await mongoose.models[m].find(f).lean().exec() || null
    },
    update: async (m, f,u) => {
        return await mongoose.models[m].updateOne(f,{$set:u}).lean().exec() || null
    },
    create: async (m, f) => {
        return await mongoose.models[m].create(f) || null
    }
}


