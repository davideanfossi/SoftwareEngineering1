const express = require('express');
const router = express.Router();
const controlOrder = require('../modules/controlOrder');
const db = new controlOrder('EzWh.db')
const dayjs = require('dayjs')

// <----------- RESTOCK ORDER ----------->

// GET

router.get('/restockOrders', async (req, res) => {
    try {
        const restockOrders = await db.getRestockOrders();
        res.status(200).json(restockOrders);
    } catch (err) {
        res.status(500).end();
    }
});

router.get('/restockOrdersIssued', async (req, res) => {
    try {
        const issued = await db.getIssuedRestockOrders();
        res.status(200).json(issued);
    } catch (err) {
        res.status(500).end();
    }
});

router.get('/restockOrders/:id', async (req, res) => {

    const id = req.params.id;

    try {
        const order = await db.getRestockOrder(id);
        res.status(200).json(order);
    } catch (err) {
        if (err.error === 'no restock order associated to id') {
            res.status(404).json(err);
        }
        res.status(500).end();
    }
});

router.get('/restockOrders/:id/returnItems', async (req, res) => {

    const id = req.params.id;

    try {
        const restockOrder = await db.getRestockOrder(id);
        if (restockOrder.state != 'COMPLETEDRETURN') {
            res.status(422).json({ error: 'validation of id failed or restock order state != COMPLETEDRETURN' });
        }
        const skuItems = await db.getSkuItemsByRestockOrder(id);

        res.status(200).json(skuItems);
    } catch (err) {
        if (err.error === 'no restock order associated to id') {
            res.status(404).json(err);
        }
        res.status(500).end();
    }
});

// POST

router.post('/restockOrder', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }
    let body = req.body;

    if (body === undefined || body.issueDate === undefined || body.products === undefined || body.supplierId === undefined) {
        console.log(body)
        return res.status(422).json({ error: `Invalid body data` });
    }

    try {
        await db.newTableRestockOrder();
        await db.newRestockOrder(body);
        return res.status(201).end();
    } catch (err) {
        console.log(err)
        res.status(500).end();
    }
});

// PUT

router.put('/restockOrder/:id', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }
    let body = req.body;

    if (body === undefined || body.newState === undefined) {
        return res.status(422).json({ error: `Invalid body data` });
    }

    let id = req.params.id;

    if (id === undefined || id <= 0) {
        return res.status(422).json({ error: `Invalid params` });
    }

    try {
        await db.modifyRestockOrderState(id, body.newState);
        res.status(200).end()
    } catch (err) {
        if (err = 'no restock order associated to id')
            res.status(404).json({ error: `wrong id or order doesn't exist` })
        else
            res.status(503).end()
    }
});

router.put('/restockOrder/:id/skuItems', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }
    let body = req.body;

    if (body === undefined || body.skuItems === undefined) {
        return res.status(422).json({ error: `Invalid body data` });
    }

    let id = req.params.id;

    if (id === undefined || id <= 0) {
        return res.status(422).json({ error: `Invalid params` });
    }

    try {
        await db.modifyRestockOrderSKUs(id, body.skuItems);
        res.status(200).end()
    } catch (err) {
        console.log(err)
        if (err = 'no restock order associated to id')
            res.status(404).json({ error: `wrong id or order doesn't exist` })
        else
            res.status(503).end()
    }
});

router.put('/restockOrder/:id/transportNote', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }
    let body = req.body;

    if (body === undefined || body.transportNote === undefined) {
        return res.status(422).json({ error: `Invalid body data` });
    }

    let id = req.params.id;

    if (id === undefined || id <= 0) {
        return res.status(422).json({ error: `Invalid params` });
    }

    try {
        await db.modifyRestockOrderNote(id, body.transportNote);
        res.status(200).end()
    } catch (err) {
        if (err = 'no restock order associated to id')
            res.status(404).json({ error: `wrong id or order doesn't exist` })
        else
            res.status(503).end()
    }
});

router.delete('/restockOrder/:id', async (req, res) => {
    try {
        let id = req.params.id;
        if (id === undefined || id <= 0) {
            return res.status(422).json({ error: `Invalid params` });
        }

        await db.deleteRestockOrder(id);
        res.status(204).end()

    } catch (err) {
        if (err = 'no restock order associated to id')
            res.status(404).json({ error: `wrong id or order doesn't exist` })
        else
            res.status(503).end()
    }
});

// <----------------- RETURN ORDERS ----------------->

// GET
router.get('/returnOrders', async (req, res) => {
    try {
        const restockOrders = await db.getReturnOrders();
        res.status(200).json(restockOrders);
    } catch (err) {
        res.status(500).end();
    }
});

router.get('/returnOrders/:id', async (req, res) => {

    const id = req.params.id;

    try {
        const order = await db.getReturnOrder(id);
        res.status(200).json(order);
    } catch (err) {
        if (err.error === 'no return order associated to id') {
            res.status(404).json(error);
        }
        res.status(500).end();
    }
});

// POST

router.post('/returnOrder', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }
    let body = req.body;

    if (body === undefined || body.returnDate === undefined || body.products === undefined || body.restockOrderId === undefined) {
        //console.log(body)
        return res.status(422).json({ error: `Invalid body data` });
    }

    try {
        await db.newTableReturnOrder();
        await db.newReturnOrder(body);
        return res.status(201).end();
    } catch (err) {
        console.log(err)
        res.status(500).end();
    }
});

// DELETE

router.delete('/returnOrder/:id', async (req, res) => {
    try {
        let id = req.params.id;
        if (id === undefined || id <= 0) {
            return res.status(422).json({ error: `Invalid params` });
        }
        await db.deleteReturnOrder(id);
        res.status(204).end()
    } catch (err) {
        if (err = 'no return order associated to id')
            res.status(404).json({ error: `wrong id or order doesn't exist` })
        else
            res.status(503).end()
    }
});

//<----------------- INTERNAL ORDER ----------------------->

// GET

router.get('/internalOrders', async (req, res) => {
    try {
        const restockOrders = await db.getInternalOrders();
        res.status(200).json(restockOrders);
    } catch (err) {
        res.status(500).end();
    }
});

router.get('/internalOrdersIssued', async (req, res) => {
    try {
        const restockOrders = await db.getInternalOrdersIssued();
        res.status(200).json(restockOrders);
    } catch (err) {
        res.status(500).end();
    }
});

router.get('/internalOrdersAccepted', async (req, res) => {
    try {
        const restockOrders = await db.getInternalOrdersAccepted();
        res.status(200).json(restockOrders);
    } catch (err) {
        res.status(500).end();
    }
});

router.get('/internalOrders/:id', async (req, res) => {

    const id = req.params.id;

    try {
        const order = await db.getInternalOrder(id);
        res.status(200).json(order);
    } catch (err) {
        if (err.error === 'no internal order associated to id') {
            res.status(404).json(error);
        }
        res.status(500).end();
    }
});

// POST

router.post('/internalOrders', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }
    let body = req.body;

    if (body === undefined || body.issueDate === undefined || body.products === undefined || body.customerId === undefined) {
        console.log(body)
        return res.status(422).json({ error: `Invalid body data` });
    }

    try {
        await db.newTableInternalOrder();
        await db.newInternalOrder(body);
        return res.status(201).end();
    } catch (err) {
        console.log(err)
        res.status(500).end();
    }
});

// PUT 

router.put('/internalOrders/:id', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }
    let body = req.body;

    if (body === undefined || body.newState === undefined) {
        return res.status(422).json({ error: `Invalid body data` });
    }
    console.log(body);
    let id = req.params.id;

    if (id === undefined || id <= 0) {
        return res.status(422).json({ error: `Invalid params` });
    }

    try {
        let products = []
        if (body.products !== undefined) {
            products = body.products
        }
        await db.modifyInternalOrder(id, body.newState, products);
        res.status(200).end()
    } catch (err) {
        if (err == 'no internal order associated to id')
            res.status(404).json({ error: `wrong id or order doesn't exist` })
        else
            res.status(503).end()
    }
});

// DELETE

router.delete('/internalOrders/:id', async (req, res) => {
    try {
        let id = req.params.id;
        if (id === undefined || id <= 0) {
            return res.status(422).json({ error: `Invalid params` });
        }

        await db.deleteInternalOrder(id);
        res.status(204).end()

    } catch (err) {
        if (err = 'no internal order associated to id')
            res.status(404).json({ error: `wrong id or order doesn't exist` })
        else
            res.status(503).end()
    }
});

module.exports = router;