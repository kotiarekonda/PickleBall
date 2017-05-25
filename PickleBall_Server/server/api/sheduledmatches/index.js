'use strict';

var express = require('express');
var controller = require('./sheduledmatches.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/spectatormatchs', controller.spectatormatchs);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.post('/matchsheduledmatcheslist', auth.isAuthenticated(), controller.matchsheduledfields);
router.post('/refreelogin', controller.refreelogin);
router.post('/reloadservice', auth.isAuthenticated(), controller.reloadrefereelogin);

module.exports = router;