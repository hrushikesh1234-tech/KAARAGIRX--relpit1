import { Router } from "express";
import { bookingController } from "../controllers/booking.controller";

const router = Router();

router.get('/merchant/:merchantId', bookingController.getBookingsByMerchant.bind(bookingController));
router.get('/user/:userId', bookingController.getBookingsByUser.bind(bookingController));
router.get('/equipment/:equipmentId', bookingController.getBookingsByEquipment.bind(bookingController));
router.get('/:id', bookingController.getBooking.bind(bookingController));
router.post('/', bookingController.createBooking.bind(bookingController));
router.put('/:id/status', bookingController.updateBookingStatus.bind(bookingController));
router.put('/:id', bookingController.updateBooking.bind(bookingController));
router.delete('/:id', bookingController.deleteBooking.bind(bookingController));

export default router;
