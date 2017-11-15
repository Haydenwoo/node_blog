const express = require('express');
const router = express.Router();
const User = require('../models/mongo/user')
const auth = require('../middlewares/auth_user');
/* GET users listing. */
router.route('/').get((req, res, next) => {
  (async () => {
    let users = await User.getUsers();
    return {
      users
    }
  })().then(r => {
    res.json({
      code: 0,
      users: r.users
    })
  }).catch(e => {
    next(e);
  })
}).post(auth(), (req, res, next) => {
  (async() => {
    let user = await User.createANewUser({
      name: req.body.name,
      age: req.body.age,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber
    });
    return {
      code: 0, 
      user
    }
  })().then(r => {
    res.json(r);
  }).catch(e => {
    next(e);
  });
});

router.route('/:id').get((req, res, next) => {
  (async() => {
    let user = await User.getUserById(req.params.id);
    return {
      code: 0,
      user
    }
  })().then(r => {
    res.json(r);
  }).catch(e => {
    next(e);
  })
}).patch(auth(), (req, res, next) => {
  (async() => {
    let update = {};
    if (req.body.name) {
      update.name = req.body.name;
    }
    if (req.body.age) {
      update.age = req.body.age;
    }
    let user = await User.updateUserById(req.params.id, update);
    return {
      code: 0,
      user
    }
  })().then(r => {
    res.json(r);
  }).catch(e => {
    console.log(e);
    next(e);
  })
});



module.exports = router;