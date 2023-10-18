var User = require('../models/user.model');

exports.createUser =  async function  (req, res) {
    try {
      
       const { name, dob, gender, role } = req.body;
       const newUser = new User({ name, dob, gender, role });
       await newUser.save();
       res.status(201).json(newUser);
    } catch (error) {
       res.status(400).json({ message: error.message });
    }
   };

exports.getUser = async function (req, res) {
    try {
       const user = await User.findById(req.params.id);
       if (!user) {
         return res.status(404).json({ message: 'User not found' });
       }
       res.status(200).json(user);
    } catch (error) {
       res.status(400).json({ message: error.message });
    }
   };
exports.getUsers = async function (req, res) {
    try {
       let users = await User.find({}).lean().exec();
       if (!users) {
         return res.status(404).json({ message: 'User not found' });
       }
       users = users?.map(obj=> ({
         ...obj,
         createdAt:obj?.createdAt?.toDateString(),
         updatedAt:obj?.updatedAt?.toDateString(),
         dob:obj?.dob ? obj?.dob?.toDateString() : ''
       }) );
       res.status(200).json(users);
    } catch (error) {
       res.status(400).json({ message: error.message });
    }
   };

exports.updateUser = async function (req, res) {
    try {
       const user = await User.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true,
       });
       if (!user) {
         return res.status(404).json({ message: 'User not found' });
       }
       res.status(200).json(user);
    } catch (error) {
       res.status(400).json({ message: error.message });
    }
   };

exports.deleteUser = async function (req, res) {
    try {
       const user = await User.findByIdAndDelete(req.params.id);
       if (!user) {
         return res.status(404).json({ message: 'User not found' });
       }
       res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
       res.status(400).json({ message: error.message });
    }
   };