const express = require('express');
const statisticsController = require('../controllers/statisticsController');

const router = express.Router();

router.post('/', statisticsController.recordStat);
router.get('/summary', statisticsController.getSummary);
router.get('/orders', statisticsController.getOrderStats);
router.get('/users', statisticsController.getUserStats);
router.get('/inventory', statisticsController.getInventoryStats);

module.exports = router;
