const express = require('express');
const router = express.Router();
const controlUser = require('../modules/controlUser');
const db = new controlUser('EzWh.db')


// <----------- CONTROL USER ----------->
// GET 

router.get('/users', async (req, res) => {
    try {
        const userlist = await db.getUsers()
        res.status(200).json(userlist);
    } catch (err) {
        res.status(500).end();
    }
});

// SOLO PER TEST
router.get('/all', async (req, res) => {
    try {
        const allList = await db.getAll();
        res.status(200).json(allList);
    } catch (err) {
        res.status(404).end();
    }
});

router.get('/suppliers', async (req, res) => {
    try {
        const supplierlist = await db.getSuppliers();
        res.status(200).json(supplierlist);
    } catch (err) {
        res.status(500).end();
    }
});


// POST

router.post('/newUser', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }
    let user = req.body;

    if (user === undefined || user.name === undefined || user.surname === undefined || user.username === undefined || user.type === undefined ||
        user.name === '' || user.surname === '' || user.username === '' || user.type === '' || user.password === '' || user.password === undefined) {
        return res.status(422).json({ error: `Invalid user data` });

    } else if (user.type === 'manager') {
        return res.status(422).json({ error: `validation of request body failed or attempt to create manager or administrator accounts` });
    } else if (user.password.length < 8) {
        return res.status(422).json({ error: 'la password deve essere almeno di 8 caratteri' })
    }

    try {
        await db.newTableUser();
        await db.checkUser(user, 'newUser')
    } catch (err) {
        return res.status(409).json({ error: `user with same mail and type already exists` });
    }

    try {
        await db.createUser(user);
        return res.status(201).end();

    } catch (err) {
        return res.status(503).end();
    }
});

router.post('/managerSessions', async (req, res) => {

    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }

    let credentials = req.body.credentials;


    if (credentials === undefined || credentials.username === undefined || credentials.username === '' ||
        credentials.password === undefined || credentials.password === '') {
        return res.status(422).json({ error: `Invalid credentials data` });

    }

    try {

        const info = await db.session(credentials, 'manager');
        return res.status(200).json(info);

    } catch (err) {
        if (err === 'data error')
            res.status(401).json({ error: 'wrong username and/or password' });

        res.status(500).end();
    }

});

router.post('/customerSessions', async (req, res) => {

    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }

    let credentials = req.body.credentials;


    if (credentials === undefined || credentials.username === undefined || credentials.username === '' ||
        credentials.password === undefined || credentials.password === '') {
        return res.status(422).json({ error: `Invalid credentials data` });

    }

    try {

        const info = await db.session(credentials, 'customer');
        return res.status(200).json(info);

    } catch (err) {
        if (err === 'data error')
            res.status(401).json({ error: 'wrong username and/or password' });

        res.status(500).end();
    }

});

router.post('/supplierSessions', async (req, res) => {

    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }

    let credentials = req.body.credentials;


    if (credentials === undefined || credentials.username === undefined || credentials.username === '' ||
        credentials.password === undefined || credentials.password === '') {
        return res.status(422).json({ error: `Invalid credentials data` });

    }

    try {

        const info = await db.session(credentials, 'supplier');
        return res.status(200).json(info);

    } catch (err) {
        if (err === 'data error')
            res.status(401).json({ error: 'wrong username and/or password' });

        res.status(500).end();
    }

});

router.post('/clerkSessions', async (req, res) => {

    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }

    let credentials = req.body.credentials;


    if (credentials === undefined || credentials.username === undefined || credentials.username === '' ||
        credentials.password === undefined || credentials.password === '') {
        return res.status(422).json({ error: `Invalid credentials data` });

    }

    try {

        const info = await db.session(credentials, 'clerk');
        return res.status(200).json(info);

    } catch (err) {
        if (err === 'data error')
            res.status(401).json({ error: 'wrong username and/or password' });

        res.status(500).end();
    }

});

router.post('/qualityEmployeeSessions', async (req, res) => {

    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }

    let credentials = req.body.credentials;


    if (credentials === undefined || credentials.username === undefined || credentials.username === '' ||
        credentials.password === undefined || credentials.password === '') {
        return res.status(422).json({ error: `Invalid credentials data` });

    }

    try {

        const info = await db.session(credentials, 'qualityEmployee');
        return res.status(200).json(info);

    } catch (err) {
        if (err === 'data error')
            res.status(401).json({ error: 'wrong username and/or password' });

        res.status(500).end();
    }

});

router.post('/deliveryEmployeeSessions', async (req, res) => {

    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }

    let credentials = req.body.credentials;


    if (credentials === undefined || credentials.username === undefined || credentials.username === '' ||
        credentials.password === undefined || credentials.password === '') {
        return res.status(422).json({ error: `Invalid credentials data` });

    }

    try {

        const info = await db.session(credentials, 'deliveryEmployee');
        return res.status(200).json(info);

    } catch (err) {
        if (err === 'data error')
            res.status(401).json({ error: 'wrong username and/or password' });

        res.status(500).end();
    }

});

// PUT

router.put('/users/:username', async (req, res) => {

    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: `Empty body request` });
    }

    const rights = req.body;

    if (rights === undefined || rights.oldType === undefined || rights.newType === undefined ||
        rights.oldType === '' || rights.newType === '') {

        return res.status(422).json({ error: `Invalid data` });

    } else if (rights.oldType === 'manager') {
        return res.status(422).json({ error: `validation of request body or of username failed or attempt to modify rights to administrator or manager` });
    }

    try {
        const data = {
            username: req.params.username,
            type: rights.oldType
        }
        await db.checkUser(data, '')
        await db.modifyUserRights(req.params.username, rights);
        res.status(200).end()
    } catch (err) {
        if (err == 'not found')
            res.status(404).json({ error: `wrong username or oldType fields or user doesn't exists` })
        else
            res.status(503).end()
    }
})



// DELETE

router.delete('/deleteTable', (req, res) => {
    try {
        db.dropTable();
        res.status(204).end();
    } catch (err) {
        res.status(500).end();
    }
});

router.delete('/users/:username/:type', async (req, res) => {
    const p = req.params;

    if (p === undefined || p.type === undefined || p.username === undefined ||
        p.type === '' || p.username === '') {

        return res.status(422).json({ error: `Invalid data` });

    } else if (p.type === 'manager') {
        return res.status(422).json({ error: `validation of username or of type failed or attempt to delete a manager/administrator` });
    }

    try {
        await db.checkUser(p, 'deleteUser');
        await db.deleteUser(p.username, p.type);
        res.status(204).end()
    } catch (err) {
        if (err === 'not found')
            res.status(422).json({ error: `validation of username or of type failed or attempt to delete a manager/administrator` })
        else
            res.status(503).end()
    }
})

module.exports = router;