const express = require('express')
const router = express.Router();
const path = require('path');
const fs = require('fs');

data = {};
data.employees = require('../../data/employees.json')

router.route('/')
.get((req, res) => {
    res.json(data.employees);
})
// .post((req, res) => {
//     res.json({
//         'firstName': req.body.firstname,
//         'lastName' : req.body.lastname
//     })
// })
//POST request
.post((req, res) => {
    //Generate the new employee id based on the current max Id +1
    const newEmployee = {
        id: data.employees.length >0 ? data.employees[data.employees.length-1].id +1 : 1,
        'firstName' : req.body.firstname,
        'lastName' : req.body.lastname
    };
    //Add the new employee to the list
    data.employees.push(newEmployee);

    //Update the employees.json file
    fs.writeFile(path.join(__dirname , '../../data/employees.json'), JSON.stringify(data.employees, null , 2) , (err) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message: 'Failed to update employees data'});
        }
        //Send back the updated employee list
        res.json(data.employees);
    });
})

//Update
/*
.put((req, res) => {
    res.json({
        'firstName': req.body.firstname,
        'lastName' : req.body.lastname
    })
})   
*/
.put((req, res) => {
    const employeeId = parseInt(req.body.id);
    const employee = data.employees.find(emp =>emp.id === employeeId);

    if(!employee) {
        return res.status(404).json({message: `Employee with ID ${employeeId} is not found`});
    }
    if(req.body.firstname) employee.firstName = req.body.firstname;
    if(req.body.lastname) employee.lastName = req.body.lastname;

    //Write the updated data back to the file
    fs.writeFile(path.join(__dirname, '../../data/employees.json'), JSON.stringify(data.employees , null , 2) , (err) => {
        if(err) {
            console.log(err);
            return res.status(500).json({message: 'Failed to update employee data'});
        } 
        res.json(data.employees);
    });
})

//DELETE req
/*
.delete((req, res) => {
    res.json({"id" : req.body.id})
})
router.route('/:id')
.get((req, res) => {
    res.json({"id" : req.params.id})
})
    */
.delete((req, res) => {
    const employeeId = parseInt(req.body.id);

    // Ensure the ID is provided and valid
    if (!req.body.id) {
        return res.status(400).json({ message: 'Employee ID is required' });
    }
    if (isNaN(employeeId)) {
        return res.status(400).json({ message: 'Invalid employee ID' });
    }

    const employeeIndex = data.employees.findIndex(emp => emp.id === employeeId);

    if (employeeIndex === -1) {
        return res.status(404).json({ message: `Employee with ID ${employeeId} not found` });
    }

    // Remove the employee from the list
    data.employees.splice(employeeIndex, 1);

    // Write the updated data back to the file
    fs.writeFile(path.join(__dirname, '../../data/employees.json'), JSON.stringify(data.employees, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to delete employee' });
        }

        // Log success
        console.log(`Employee with ID ${employeeId} deleted successfully.`);
        res.json(data.employees);
    });
});
//GET one employee
router.route('/:id')
.get((req, res) => {
    res.json({"id" : req.params.id})
})

module.exports= router;
