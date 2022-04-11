const router = require('express').Router();

const {getUsers, getId, createUsers} = require('../controllers/users')

router.get('/users', getUsers);
router.get('/users/:userId', getId);
router.post('/users', createUsers)

module.exports = router;