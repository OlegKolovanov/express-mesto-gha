const router = require('express').Router();

const {getUsers, getId, createUsers, createMe, createUserAvatar} = require('../controllers/users')

router.get('/', getUsers);
router.get('/userId', getId);
router.post('/', createUsers)
router.patch('/me', createMe);
router.patch('/me/avatar', createUserAvatar);

module.exports = router;