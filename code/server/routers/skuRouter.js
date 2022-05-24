const express = require('express');
const router = express.Router();
const controlSku = require('../modules/controlSku');
const skuService = require('../services/sku_service');
const db = new controlSku('EzWh.db')
const sku_service = new skuService(db)

// <----------- CONTROL SKU  ----------->

//GET

router.get('/skus', async (req, res) => {
    try {
        const skus = await sku_service.getSkus();
        res.status(200).json(skus);
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
})  

router.get('/skus/:id', async (req, res) => {

    if (!Number.isInteger(parseInt(req.params.id)))
        res.status(422).json({ error: "id is not a number" }).end();

    try {
        const skus = await sku_service.getSku(req.params.id);
        res.status(200).json(skus);
    } catch (err) {
        if (err == "not found")
            res.status(404).json({ error: `no SKU available associated to id` }).end();
        else
            res.status(500).end();
    }
}); 

router.get('/skuitems', async (req, res) => {               
    try {
        const SKUItemsList = await sku_service.getSKUItems();
        res.status(200).json(SKUItemsList);
    } catch (err) {
        res.status(500).end();
    }
}); 

router.get('/skuitems/sku/:id', async (req, res) => {
    id = parseInt(req.params.id);
    if (id === undefined || id === '') {
        return res.status(422).json({ error: `Invalid SKUId` });    // non da invalid SKUId ma not found
    }

    try {
        const skuitems = await sku_service.getSKUItemsAvailable(id);
        res.status(200).json(skuitems);
    } catch (err) {
        if (err.code === 404)
            res.status(err.code).json({ error: err.error })
        if (err.code === 422)
            res.status(err.code).json({ error: err.error })
        else
            res.status(503).end()
    }
});

router.get('/skuitems/:rfid', async (req, res) => {
    let rfid = req.params.rfid;
    if (rfid === undefined || rfid === '') {
        return res.status(422).json({ error: `Invalid RFID` });    // non da invalid SKUId ma not found
    }

    try {
        const skuitem = await sku_service.getSKUItem(rfid);
        res.status(200).json(skuitem);
    } catch (err) {
        if (err.code === 404)
            res.status(404).json({ error: err.error })
        else
            res.status(503).end()
    }
}); 

router.get('/positions', async (req, res) => {
    try {
        const PositionsList = await sku_service.getPositions();
        res.status(200).json(PositionsList);
    } catch (err) {
        res.status(500).end();
    }
}); 

router.get('/items', async (req, res) => {
    try {
        const ItemList = await sku_service.getItems();
        res.status(200).json(ItemList);
    } catch (err) {
        res.status(500).end();
    }
});

router.get('/items/:id', async (req, res) => {
    let id = parseInt(req.params.id);           
    if (id === undefined || id === '' || id === NaN) {
        return res.status(422).json({ error: `Invalid ID` });   
    }

    try {
        const item = await sku_service.getItem(id);
        res.status(200).json(item);
    } catch (err) {
        if (err.code === 404)
            res.status(err.code).json({ error: err.error })
        if (err.code === 422)
            res.status(err.code).json({ error: err.error })
        else
            res.status(503).end()
    }
});

//POST

router.post('/sku', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }
    let sku = req.body;

    if (sku === undefined || sku.description === undefined || sku.weight === undefined || sku.volume === undefined || sku.notes === undefined || sku.price === undefined || sku.availableQuantity === undefined ||
        sku.description == '' || sku.weight == '' || sku.volume === '' || sku.notes == '' || sku.price == '' || sku.availableQuantity === '') {
        return res.status(422).json({ error: `Invalid sku data` });
    }

    try {
        await sku_service.newTableSku();
        await sku_service.createSku(sku);
        return res.status(201).end();
    } catch (err) {
        res.status(500).end();
    }

}); 

router.post('/skuitem', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }
    let SKUItem = req.body;
    if (SKUItem === undefined || SKUItem.RFID === undefined || SKUItem.SKUId === undefined || SKUItem.DateOfStock === undefined ||
        SKUItem.RIFD === '' || SKUItem.SKUId === '' || SKUItem.DateOfStock === '') {
        return res.status(422).json({ error: `Invalid SKUItem data` });
    }
    try {
        await sku_service.newTableSKUItem();
        await sku_service.createSKUItem(SKUItem)
        return res.status(201).end();
    } catch (err) {
        if(err.code === 422)
            res.status(422).json({error: err.error});
        res.status(503).end();
    }
}); 

router.post('/position', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }
    let position = req.body;

    if (position === undefined || position.positionID === undefined || position.aisleID === undefined || position.row === undefined || position.col === undefined || position.maxWeight === undefined ||
        position.maxVolume === undefined || position.positionID === '' || position.aisleID === '' || position.row === '' || position.col === '' || position.maxWeight === '' || position.maxVolume === '') {
        return res.status(422).json({ error: `Invalid position data` });

    }
    try {
        await sku_service.newTablePosition();
        await sku_service.createPosition(position);
        return res.status(201).end();

    } catch (err) {
        if(err.code === 422)
            res.status(422).json({error: err.error});
        res.status(503).end();
    }
});

router.post('/item', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }
    let Item = req.body;

    if (Item === undefined || Item.id === undefined || Item.description === undefined || Item.price === undefined ||
        Item.SKUId === undefined || Item.supplierId === undefined || Item.id === '' || Item.description === '' || Item.price === '' ||
        Item.SKUId === '' || Item.supplierId === '') {
        return res.status(422).json({ error: `Invalid Item data` });

    }
    try {
        await sku_service.newTableItem();
        await sku_service.createItem(Item);
        return res.status(201).end();
    } catch (err) {
        if(err.code === 422)
            res.status(422).json({error: err.error});
        res.status(503).end();
    }
});

//PUT

router.put('/sku/:id', async (req, res) => {
    if (!Number.isInteger(parseInt(req.params.id)))
        res.status(422).json({ error: "id is not a number" }).end();

    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }
    let sku = req.body;

    if (sku === undefined || sku.newDescription === undefined || sku.newWeight === undefined || sku.newVolume === undefined || sku.newNotes === undefined || sku.newPrice === undefined || sku.newAvailableQuantity === undefined ||
        sku.newDescription == '' || sku.newWeight == '' || sku.newVolume === '' || sku.newNotes == '' || sku.newPrice == '' || sku.newAvailableQuantity === '') {
        return res.status(422).json({ error: `Invalid sku data` });
    }

    try {
        await sku_service.modifySku(req.params.id, sku);
        //modify position occupied fileds
        res.status(200).end()
    } catch (err) {
        if (err = 'not found')
            res.status(404).json({ error: `wrong id` })
        else
            res.status(503).end()
    }
}); 
router.put('/sku/:id/position', async (req, res) => {
    if (!Number.isInteger(parseInt(req.params.id)))
        res.status(422).json({ error: "id is not a number" }).end();
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }
    let position = req.body;
    let data;
    if (position === undefined || position.position === undefined || position.position == '') {
        return res.status(422).json({ error: `Invalid position data` });
    }

    try {

        data = await sku_service.getWeightVolume(req.params.id);
        await sku_service.modifySkuPositon(req.params.id, position);
        await sku_service.updateOccupied(data[0], data[1], position, data[2]);
        res.status(200).end()
    } catch (err) {
        if (err == 'not found')
            res.status(404).json({ error: `wrong id` })
        else
            console.log(err);
        res.status(503).json({ err }).end()
    }
}); 

router.put('/skuitems/:rfid', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }

    const data = req.body;

    if (data === undefined || data.newRFID === undefined || data.newAvailable === undefined || data.newDateOfStock === undefined ||
        req.params.rfid === undefined || data.newRFID === '' || data.newAvailable === '' || data.newDateOfStock === '' || req.params.rfid === '')
        return res.status(422).json({ error: `Invalid data` });
    try {
        await sku_service.modifySKUItem(req.params.rfid, data)
        res.status(200).end()
    } catch (err) {
        if (err === 'not found')
            res.status(404).json({ error: `no SKU Item associated to rfid` })
        if(err.code === 422)
            res.status(422).json({error: err.error});
        else
            res.status(503).end()
    }
}); 

router.put('/position/:positionID', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }

    const data = req.body;
    if (data === undefined || data.newAisleID === undefined || data.newRow === undefined || data.newCol === undefined || data.newMaxWeight === undefined ||
        data.newMaxVolume === undefined || data.newOccupiedWeight === undefined || data.newOccupiedVolume === undefined || req.params.positionID === undefined ||
        data.newAisleID === '' || data.newRow === '' || data.newCol === '' || data.newMaxWeight === '' || data.newMaxVolume === '' || data.newOccupiedWeight === '' ||
        data.newOccupiedVolume === '' || req.params.positionID === '')
        return res.status(422).json({ error: `Invalid data` });
    try {
        await sku_service.modifyPosition(req.params.positionID, data);
        res.status(200).end()
    } catch (err) {
        if (err === 'not found')
            res.status(404).json({ error: `no position associated to positionID` })
        if(err.code === 422)
            res.status(422).json({error: err.error});
        else
            res.status(503).end()
    }
}); 

router.put('/position/:positionID/changeID', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }

    const newPositionID = req.body.newPositionID;

    if (newPositionID === undefined || req.params.positionID === undefined ||
        newPositionID === '' || req.params.positionID === '')
        return res.status(422).json({ error: `Invalid data` });

    try {
        await sku_service.modifyPositionID(req.params.positionID, newPositionID);
        res.status(200).end()
    } catch (err) {
        if (err === 'not found')
            res.status(404).json({ error: `no position associated to positionID` })
        if(err.code === 422)
            res.status(422).json({error: err.error});
        else
            res.status(503).end()
    }
});

router.put('/item/:id', async (req, res) => {
    id = parseInt(req.params.id);
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }

    const data = req.body;

    if (data === undefined || data.newDescription === undefined || data.newPrice === undefined || req.params.id === undefined ||
        data.newDescription === '' || data.newPrice === '' || req.params.id === '')
        return res.status(422).json({ error: `Invalid data` });

    try {
        await sku_service.modifyItem(id, data);
        res.status(200).end()
    } catch (err) {
        if (err === 'not found')
            res.status(404).json({ error: `no Item associated to id` })
        if(err.code === 422)
            res.status(422).json({error: err.error});
        else
            res.status(503).end()
    }
}); 

//DELETE

router.delete('/skus/:id', async (req, res) => {

    if (!Number.isInteger(parseInt(req.params.id)))
        res.status(422).json({ error: "id is not a number" }).end();

    try {
        await sku_service.deleteSku(req.params.id);
        res.status(204).end();
    } catch (err) {
        if (err == "not found")
            res.status(422).json({ error: "id not found" }).end();
        else
            res.status(503).end();
    }
});

router.delete('/deleteSKUItemTable', async (req, res) => {
    try {
        await db.dropSKUItemTable();
        res.status(204).end();
    } catch (err) {
        res.status(500).end();
    }
}); 

router.delete('/deleteAllSKUItem', async (req, res) => {                // PER TEST
    try {
        await db.deleteAllSKUItem();
        res.status(204).end();
    } catch (err) {
        res.status(500).end();
    }
}); 

router.delete('/deletePositionTable', async (req, res) => {
    try {
        await db.dropPositionTable();
        res.status(204).end();
    } catch (err) {
        res.status(500).end();
    }
}); 

router.delete('/deleteAllPosition', async (req, res) => {                // PER TEST
    try {
        await db.deleteAllPosition();
        res.status(204).end();
    } catch (err) {
        res.status(500).end();
    }
}); 

router.delete('/deleteItemTable', async (req, res) => {
    try {
        await db.dropItemTable();
        res.status(204).end();
    } catch (err) {
        res.status(500).end();
    }
}); 

router.delete('/deleteAllItem', async (req, res) => {                // PER TEST
    try {
        await db.deleteAllItem();
        res.status(204).end();
    } catch (err) {
        res.status(500).end();
    }
}); 

router.delete('/skuitems/:rfid', async (req, res) => {
    const rfid = req.params.rfid;
    if (rfid === undefined || rfid === '')
        return res.status(422).json({ error: `Invalid data` });

    try {
        await sku_service.deleteSKUItem(rfid);
        res.status(204).end()
    } catch (err) {
        if(err.code === 422)
            res.status(422).json({error: err.error});
        res.status(503).end()
    }
});

router.delete('/position/:positionID', async (req, res) => {
    const positionID = req.params.positionID;
    if (positionID === undefined || positionID === '')
        return res.status(422).json({ error: `Invalid data` });

    try {
        await sku_service.deletePosition(positionID);
        res.status(204).end()
    } catch (err) {
        if(err.code === 422)
            res.status(422).json({error: err.error});
        res.status(503).end()
    }
});

router.delete('/items/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (id === undefined || id === '')
        return res.status(422).json({ error: `Invalid data` });

    try {
        await sku_service.deleteItem(id);
        res.status(204).end()
    } catch (err) {
        if(err.code === 422)
            res.status(422).json({error: err.error});
        res.status(503).end()
    }
}); 

module.exports = router;