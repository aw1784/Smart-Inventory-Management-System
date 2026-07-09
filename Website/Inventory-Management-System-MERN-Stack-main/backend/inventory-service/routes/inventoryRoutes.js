const express = require('express');
const inventoryController = require('../controllers/inventoryController');

const router = express.Router();

router.post('/', inventoryController.addInventory);
router.get('/', inventoryController.getAllInventory);
router.get('/product/:productId', inventoryController.getInventoryByProduct);
router.put('/:id', inventoryController.updateInventory);
router.patch('/:id/adjust', inventoryController.adjustQuantity);
router.post('/adjust-by-product', inventoryController.adjustByProduct);
router.delete('/:id', inventoryController.removeInventory);

module.exports = router;
