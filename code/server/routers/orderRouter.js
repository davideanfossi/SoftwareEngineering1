const express = require('express');
const router = express.Router();
const controlOrder = require('../modules/controlOrder');
const db = new controlOrder('EzWh.db')
const dayjs = require('dayjs')
const OrderService = require('../services/order_service');
const service = new OrderService(db)

// <----------- RESTOCK ORDER ----------->

// GET

router.get('/restockOrders', async (req, res) => { //r
    try {
        const restockOrders = await service.getRestockOrders();
        res.status(200).json(restockOrders);
    } catch (err) {
        res.status(500).end();
    }
});

router.get('/restockOrdersIssued', async (req, res) => { // r
    try {
        const issued = await service.getIssuedRestockOrders();
        res.status(200).json(issued);
    } catch (err) {
        res.status(500).end();
    }
});

router.get('/restockOrders/:id', async (req, res) => { // r

    const id = req.params.id;

    try {
        const order = await service.getRestockOrder(id);
        res.status(200).json(order);
    } catch (err) {
        res.status(err.code).end();
    }
});

router.get('/restockOrders/:id/returnItems', async (req, res) => { // r

    const id = req.params.id;
    try {
        const skuItems = await service.getSkuItemsByRestockOrder(id);
        res.status(200).json(skuItems);
    } catch (err) {
        res.status(err.code).end();
    }
});

// POST

router.post('/restockOrder', async (req, res) => { //r
    let body = req.body;
    try {
        await service.newTableRestockOrder();
        await service.newRestockOrder(body);
        res.status(201).end();
    } catch (err) {
        res.status(err.code).end();
    }
});

// PUT

router.put('/restockOrder/:id', async (req, res) => { // r
    let body = req.body;
    let id = req.params.id;
    try {
        await service.modifyRestockOrderState(id, body);
        res.status(200).end()
    } catch (err) {
        res.status(err.code).end()
    }
});

router.put('/restockOrder/:id/skuItems', async (req, res) => { // r
    let body = req.body;
    let id = req.params.id;
    try {
        await service.modifyRestockOrderSKUs(id, body);
        res.status(200).end()
    } catch (err) {
        res.status(err.code).end()
    }
});

router.put('/restockOrder/:id/transportNote', async (req, res) => { //r
    let body = req.body;
    let id = req.params.id;
    try {
        await service.modifyRestockOrderNote(id, body);
        res.status(200).end()
    } catch (err) {
        res.status(err.code).end()
    }
});

router.delete('/restockOrder/:id', async (req, res) => { // r
    let id = req.params.id;
    try {
        await service.deleteRestockOrder(id);
        res.status(204).end()
    } catch (err) {
        res.status(err.code).end()
    }
});

router.delete('/restockOrders', async (req, res) => {
    try {
        await service.dropTable();
        res.status(204).end()
    } catch (err) {
        res.status(err.code).end()
    }
});

// <----------------- RETURN ORDERS ----------------->

// GET
router.get('/returnOrders', async (req, res) => { // r
    try {
        const restockOrders = await service.getReturnOrders();
        res.status(200).json(restockOrders);
    } catch (err) {
        console.log(err)
        res.status(err.code).end();
    }
});

router.get('/returnOrders/:id', async (req, res) => { // r
    const id = req.params.id;
    try {
        const order = await service.getReturnOrder(id);
        res.status(200).json(order);
    } catch (err) {
        res.status(err.code).end();
    }
});

// POST

router.post('/returnOrder', async (req, res) => { // r
    let body = req.body;
    try {
        await service.newTableReturnOrder();
        await service.newReturnOrder(body);
        return res.status(201).end();
    } catch (err) {
        res.status(err.code).end();
    }
});

// DELETE

router.delete('/returnOrder/:id', async (req, res) => { // r
    try {
        let id = req.params.id;
        await service.deleteReturnOrder(id);
        res.status(204).end()
    } catch (err) {
        res.status(err.code).end();
    }
});

router.delete('/returnOrders', async (req, res) => {
    try {
        await service.dropTableReturnOrder();
        res.status(204).end()
    } catch (err) {
        res.status(err.code).end();
    }
});

//<----------------- INTERNAL ORDER ----------------------->

// GET

router.get('/internalOrders', async (req, res) => { // r
    try {
        const restockOrders = await service.getInternalOrders();
        res.status(200).json(restockOrders);
    } catch (err) {
        res.status(err.code).end();
    }
});

router.get('/internalOrdersIssued', async (req, res) => { // r
    try {
        const restockOrders = await service.getInternalOrdersIssued();
        res.status(200).json(restockOrders);
    } catch (err) {
        res.status(err.code).end();
    }
});

router.get('/internalOrdersAccepted', async (req, res) => { // r
    try {
        const restockOrders = await service.getInternalOrdersAccepted();
        res.status(200).json(restockOrders);
    } catch (err) {
        res.status(err.code).end();
    }
});

router.get('/internalOrders/:id', async (req, res) => { // r
    const id = req.params.id;
    try {
        const order = await service.getInternalOrder(id);
        res.status(200).json(order);
    } catch (err) {
        res.status(err.code).end();
    }
});

// POST

router.post('/internalOrders', async (req, res) => { // r
    let body = req.body;
    try {
        await service.newTableInternalOrder();
        await service.newInternalOrder(body);
        return res.status(201).end();
    } catch (err) {
        res.status(err.code).end();
    }
});

// PUT 

router.put('/internalOrders/:id', async (req, res) => { // r
    let body = req.body;
    let id = req.params.id;
    try {
        await service.modifyInternalOrder(id, body);
        res.status(200).end()
    } catch (err) {
        res.status(err.code).end();
    }
});

// DELETE

router.delete('/internalOrders/:id', async (req, res) => {
    try {
        let id = req.params.id;
        await service.deleteInternalOrder(id);
        res.status(204).end()
    } catch (err) {
        res.status(err.code).end();
    }
});

router.delete('/internalOrders', async (req, res) => {
    try {
        await service.dropTableInternalOrder();
        res.status(204).end()
    } catch (err) {
        res.status(err.code).end();
    }
});

module.exports = router;