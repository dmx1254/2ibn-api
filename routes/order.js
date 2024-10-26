const express = require("express");
const orderController = require("../controllers/order.controller");

const router = express.Router();

//Orders routes

router.post("/", orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/ordernum/:numorder", orderController.getOrderByNumOrder);
router.put("/:id", orderController.updateOrder);
router.post("/paid", orderController.updatePaid);
router.post("/updatepayment", orderController.updatePayment);
router.get("/find/:userId", orderController.getUserOrder);
router.get("/find/delorders/:userId", orderController.deleteAllUsersOrders);
router.get("/income", orderController.getIncome);
router.get("/getlengthorders", orderController.getLengthOrders);
router.get("/getlengthpending", orderController.getLengthPending);
router.get("/getlengthsuccess", orderController.getLengthSuccess);
router.get("/getlengthcanceled", orderController.getLengthCanceled);
router.get("/getlengthwaited", orderController.getLengthWaited);
router.get("/getpendingorder", orderController.getPendingOrder);
router.get("/getsuccessorder", orderController.getSuccessOrder);
router.get("/getCanceledorder", orderController.getCanceledOrder);
router.get("/getwaitedorder", orderController.getWaitedOrder);
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
