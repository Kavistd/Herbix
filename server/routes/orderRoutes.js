const express = require('express');
const { createOrder, getMyOrders, getOrderById } = require('../controllers/orderController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();
router.use(authenticateUser, authorizeRoles('CUSTOMER'));
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/myorders', getMyOrders); // existing URL compatibility
router.get('/:id', getOrderById);
module.exports = router;
