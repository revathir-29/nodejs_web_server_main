const express = require('express')
const router = express.Router();
const path = require('path');
const fs = require('fs');
const employeeController = require('../../controllers/employeeController')

//get
router.route('/')
.get(employeeController.getAllEmployees)
//POST request
.post(employeeController.createNewEmployee)
//Update
.put(employeeController.updateEmployee)
//DELETE req
.delete(employeeController.deleteEmployee)
//GET one employee
router.route('/:id')
.get(employeeController.getEmployee);

module.exports= router;
