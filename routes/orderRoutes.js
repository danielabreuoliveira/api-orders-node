const express = require("express");
const router = express.Router();

// --- IMPORTAÇÕES ---
const orderController = require("../controllers/orderController");
const auth = require('../auth');
const userController = require("../controllers/userController"); 

// --- ROTAS DE AUTENTICAÇÃO ---
// Rota pública para obter o token
router.post('/login', userController.login);

// --- ROTAS DE PEDIDOS (PROTEGIDAS) ---
// 
router.get("/order", auth.verifyJWT, orderController.getOrders);
router.get("/order/list", auth.verifyJWT, orderController.getOrders);
router.get("/order/:id", auth.verifyJWT, orderController.getOrderById);
router.post("/order", auth.verifyJWT, orderController.createOrder);
router.put("/order/:id", auth.verifyJWT, orderController.updateOrder);
router.delete("/order/:id", auth.verifyJWT, orderController.deleteOrder);
/*
// --- ROTAS DE PEDIDOS (sem proteção) ---
router.get("/order", orderController.getOrders);
router.get("/order/list", orderController.getOrders);
router.get("/order/:id", orderController.getOrderById);
router.post("/order", orderController.createOrder);
router.put("/order/:id", orderController.updateOrder);
router.delete("/order/:id", orderController.deleteOrder);
*/
module.exports = router;