var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();
var User = require('../models/user.model');
const { createUser, getUser, getUsers,updateUser, deleteUser } = require('../controllers/user.controller');


// router.use(bodyParser.json());


// Create a new user
router.post('/', createUser);
 
// Get a user by ID
router.get('/:id', getUser );
// Get a users
router.get('/', getUsers );
 
 // Update a user by ID
 router.put('/:id',updateUser);
 
 // Delete a user by ID
 router.delete('/:id', deleteUser);

module.exports = router;
