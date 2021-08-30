const express = require('express');
const route = express.Router()
const controller=require('../controller/controller')
// const {del : remove}=require('../controller/random') //importing del as remove

route.post('/stocks', controller.createItem);
route.get('/stocks', controller.getItem);
route.put('/stocks/:id', controller.updateItem);
route.delete('/stocks/:id', controller.deleteItem);

module.exports = route