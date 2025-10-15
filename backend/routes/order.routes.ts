import { Router } from "express";
import { orderController } from "../controllers/order.controller";

const router = Router();

router.get('/', orderController.getAllOrders.bind(orderController));
router.get('/pending', orderController.getPendingOrders.bind(orderController));
router.get('/confirmed', orderController.getConfirmedOrders.bind(orderController));
router.get('/user/:userId', orderController.getOrdersByUser.bind(orderController));
router.get('/dealer/:dealerId', orderController.getOrdersByDealer.bind(orderController));
router.get('/:id', orderController.getOrder.bind(orderController));
router.post('/', orderController.createOrder.bind(orderController));
router.put('/:id', orderController.updateOrder.bind(orderController));
router.put('/:id/status', orderController.updateOrderStatus.bind(orderController));
router.put('/:id/confirm-dealer', orderController.confirmFromDealer.bind(orderController));
router.put('/:id/confirm-customer', orderController.confirmFromCustomer.bind(orderController));
router.delete('/:id', orderController.deleteOrder.bind(orderController));

export default router;
