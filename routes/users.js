const router = require('express').Router();

const {getUser, getId, createUsers} = require('../controllers/users')

router.get('/', getUser);
router.get('/users/:userId', getId);
router.post('/', createUsers)