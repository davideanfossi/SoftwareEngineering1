const express = require('express');
const router = express.Router();
const controlTest = require('../modules/controlTest');
const db = new controlTest('EzWh.db')

// <----------- CONTROL TEST descriptor ----------->

router.get('/testDescriptors', async (req, res) => {
    try {
        const testDescriptorsList = await db.getTestDescriptors();
        res.status(200).json(testDescriptorsList);
    } catch (err) {
        res.status(500).end();
    }
});

router.get('/testDescriptors/:id', async (req, res) => {

    if (!Number.isInteger(parseInt(req.params.id)))
        res.status(422).json({ error: "id is not a number" }).end();

    try {
        const testDescriptor = await db.getTestDescriptorById(req.params.id);
        res.status(200).json(testDescriptor);
    } catch (err) {
        if (err == "not found")
            res.status(404).json(err).end();
        else
            res.status(500).end();
    }
});

router.post('/testDescriptor', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }
    let testDescriptor = req.body;

    if (testDescriptor === undefined || testDescriptor.name === undefined || testDescriptor.procedureDescription === undefined || testDescriptor.idSKU === undefined ||
        testDescriptor.name == '' || testDescriptor.procedureDescription == '' || testDescriptor.idSKU === '') {
        return res.status(422).json({ error: `Invalid testDescriptor data` });
    }

    try {
        await db.newTableTestDescriptor();
        // is check name id_sku combo good??
        await db.checkTestDescriptor(testDescriptor, 'newTest');
    } catch (err) {
        return res.status(409).json({ error: `test with same name and id_sku already exists` });
    }

    // check also that id_sku exist!!!

    try {
        await db.createTestDescriptor(testDescriptor);
        return res.status(201).end();

    } catch (err) {
        res.status(500).json({ err }).end();
    }

});

router.put('/testDescriptor/:id', async (req, res) => {

    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }

    if (!Number.isInteger(parseInt(req.params.id)))
        res.status(422).json({ error: "id is not a number" }).end();

    const newTestDescriptor = req.body;

    if (newTestDescriptor === undefined || newTestDescriptor.newName === undefined || newTestDescriptor.newProcedureDescription === undefined || newTestDescriptor.newIdSKU === undefined ||
        newTestDescriptor.newName === '' || newTestDescriptor.newProcedureDescription === '' || newTestDescriptor.newIdSKU === '') {

        return res.status(422).json({ error: `Invalid data` });
    }

    try {
        await db.modifyTestDescriptor(req.params.id, newTestDescriptor);
        res.status(200).end()
    } catch (err) {
        if (err = 'not found')
            //check also issku exist
            res.status(404).json({ error: `wrong id` })
        else
            res.status(503).end()
    }
})

router.delete('/testDescriptor/:id', async (req, res) => {

    if (!Number.isInteger(parseInt(req.params.id)))
        res.status(422).json({ error: "id is not a number" }).end();

    try {
        await db.deleteTestDescriptor(req.params.id);
        res.status(204).end();
    } catch (err) {
        if (err == "not found")
            res.status(422).json({ error: "id not found" }).end();
        else
            res.status(503).end();
    }
})

// <----------- CONTROL TEST result ----------->

router.get('/skuitems/:rfid/testResults', async (req, res) => {
    if (!Number.isInteger(parseInt(req.params.rfid)))
        res.status(422).json({ error: "rfid is not a number" }).end();

    try {
        const testResultsList = await db.getTestResults(req.params.rfid);
        res.status(200).json(testResultsList);
    } catch (err) {
        if (err == "not found")
            res.status(404).json({ error: "no test result with this sku" }).end();
        res.status(500).end();
    }
});

router.get('/skuitems/:rfid/testResults/:id', async (req, res) => {
    if (!Number.isInteger(parseInt(req.params.rfid)))
        res.status(422).json({ error: "rfid is not a number" }).end();

    if (!Number.isInteger(parseInt(req.params.id)))
        res.status(422).json({ error: "id is not a number" }).end();

    try {
        const testResult = await db.getTestResultById(req.params.rfid, req.params.id);
        res.status(200).json(testResult);
    } catch (err) {
        if (err == "not found")
            res.status(404).json({ error: "no test result with this sku or id" }).end();
        res.status(500).end();
    }
});

router.post('/skuitems/testResult', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }
    let testResult = req.body;

    if (testResult === undefined || testResult.idTestDescriptor === undefined || testResult.Date === undefined || testResult.Result === undefined ||
        testResult.idTestDescriptor == '' || testResult.Date == '' || testResult.Result === '') {
        return res.status(422).json({ error: `Invalid testDescriptor data` });
    }

    try {
        await db.newTableTestResults();
        await db.checkRfid(testResult.rfid);
        await db.checkTestResult(testResult, 'newTest');
    } catch (err) {
        return res.status(404).json({ error: `no sku item associated to rfid or no test descriptor associated to idTestDescriptor` });
    }

    try {
        await db.createTestResult(testResult);
        return res.status(201).end();
    } catch (err) {
        res.status(500).json({ err }).end();
    }

});

router.put('/skuitems/:rfid/testResult/:id', async (req, res) => {
    if (!Number.isInteger(parseInt(req.params.rfid)))
        res.status(422).json({ error: "rfid is not a number" }).end();

    if (!Number.isInteger(parseInt(req.params.id)))
        res.status(422).json({ error: "id is not a number" }).end();

    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }
    let testResult = req.body;

    if (testResult === undefined || testResult.newIdTestDescriptor === undefined || testResult.newDate === undefined || testResult.newResult === undefined ||
        testResult.newIdTestDescriptor == '' || testResult.newDate == '' || testResult.newResult === '') {
        return res.status(422).json({ error: `Invalid testResult data` });
    }

    try {
        await db.modifyTestResult(req.params.rfid, req.params.id, testResult);
        res.status(200).end()
    } catch (err) {
        if (err = 'not found')
            res.status(404).json({ error: `wrong id or rfid` })
        else
            res.status(503).end()
    }
});

router.delete('/skuitems/:rfid/testResult/:id', async (req, res) => {
    if (!Number.isInteger(parseInt(req.params.rfid)))
        res.status(422).json({ error: "rfid is not a number" }).end();

    if (!Number.isInteger(parseInt(req.params.id)))
        res.status(422).json({ error: "id is not a number" }).end();

    try {
        await db.deleteTestResult(req.params.rfid, req.params.id);
        res.status(204).end();
    } catch (err) {
        if (err == "not found")
            res.status(422).json({ error: "rfid or id not found" }).end();
        else
            res.status(503).end();
    }
})

module.exports = router;