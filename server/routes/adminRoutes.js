const express = require('express');
const { getAllOrders, getAdminOrderById, updateOrderStatus, updatePaymentStatus, getCustomers, getCustomerById } = require('../controllers/adminController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

const { getAdminProducts, getAdminProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const router = express.Router();

// Every route on this router is admin-only — enforced here on the backend,
// not just hidden in the frontend UI.
router.use(authenticateUser, authorizeRoles('ADMIN'));

router.route('/products').get(getAdminProducts).post(createProduct);
router.route('/products/:id').get(getAdminProductById).put(updateProduct).delete(deleteProduct);

router.get('/orders', getAllOrders);
router.get('/orders/:id', getAdminOrderById);
router.patch('/orders/:id/status', updateOrderStatus);
router.patch('/orders/:id/payment-status', updatePaymentStatus);

router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerById);

module.exports = router;
