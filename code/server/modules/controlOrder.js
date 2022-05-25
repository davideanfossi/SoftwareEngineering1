const { json } = require('express');
const dayjs = require('dayjs')

class controlOrder {
    sqlite = require('sqlite3');

    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });

    }


    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS RESTOCKORDER';
            this.db.run(sql, (err) => {
                if (err) {
                    reject({error:err, code:500});
                    return;
                }
                resolve();
            });
        });
    }

    newTableRestockOrder() {
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE IF NOT EXISTS RESTOCKORDER(
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                ISSUEDATE TIMESTAMP ,
                STATE VARCHAR CHECK(STATE IN ('ISSUED', 'DELIVERY', 'DELIVERED', 'TESTED', 'COMPLETEDRETURN', 'COMPLETED')), 
                PRODUCTS TEXT, 
                SUPPLIERID INT,  
                TRANSPORTNOTE VARCHAR, 
                SKUITEMS TEXT,
                FOREIGN KEY (SUPPLIERID) REFERENCES USER(ID))`;
            this.db.run(sql, (err) => {
                if (err) {
                    reject({error:err, code:500});
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getRestockOrders() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM RESTOCKORDER`;

            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject({error:err, code:500});
                    return;
                }
                const orders = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        products: JSON.parse(r.PRODUCTS),
                        supplierID: r.SUPPLIERID,
                        transportNote: JSON.parse(r.TRANSPORTNOTE),
                        skuItems: JSON.parse(r.SKUITEMS)

                    }
                ));
                resolve(orders);
            });
        });
    }

    getIssuedRestockOrders() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM RESTOCKORDER WHERE STATE = "ISSUED"`;

            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject({error:err, code:500});
                    return;
                }
                const orders = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        products: JSON.parse(r.PRODUCTS),
                        supplierID: r.SUPPLIERID,
                        transportNote: JSON.parse(r.TRANSPORTNOTE),
                        skuItems: JSON.parse(r.SKUITEMS)
                    }
                ));
                resolve(orders);
            });
        });
    }

    getRestockOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM RESTOCKORDER WHERE ID = ?`;

            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject({error:err, code:500});
                    return;
                }

                if (rows.length < 1) {
                    reject({ error: 'no restock order associated to id',code:404});
                    return;
                }else{
                    const orders = rows.map((r) => (
                        {
                            id: r.ID,
                            issueDate: r.ISSUEDATE,
                            state: r.STATE,
                            products: JSON.parse(r.PRODUCTS),
                            supplierID: r.SUPPLIERID,
                            transportNote: JSON.parse(r.TRANSPORTNOTE),
                            skuItems: JSON.parse(r.SKUITEMS)
                        }
                    ));
                    resolve(orders);
                }

                
            });
        });
    }

    getSkuItemsByRestockOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT SKUITEMS FROM RESTOCKORDER WHERE ID = ?`;

            this.db.all(sql, [id], (err, row) => {
                if (err) {
                    console.log(err);
                    reject({error:err, code:500});
                    return;
                }

                const skuItems = JSON.parse(row[0].SKUITEMS);
                resolve(skuItems);

            });
        });
    }

    newRestockOrder(data) {
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT * FROM USER WHERE ID = ? AND TYPE = 'supplier';"
            this.db.all(sql1, [data.supplierId], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject({error:err, code:503});
                    return;
                }
                if(rows===undefined){
                    reject({error:"Internal error", code:503});
                    return;
                }
                if(rows.length<1){
                    reject({error:"No supplier matches the Id", code:404});
                    return;
                }else{
                    const sql = 'INSERT INTO RESTOCKORDER(ISSUEDATE, PRODUCTS, SUPPLIERID) VALUES(?, ?, ?)';
                    const date = dayjs(data.issueDate).format('YYYY/MM/DD HH:mm') 
                    this.db.run(sql, [date, JSON.stringify(data.products), data.supplierId], (err) => {
                        if (err) {
                            console.log(err)
                            reject({error:err, code:503});
                            return;
                        }
                        return resolve();
                    });
                }
            });
            
        });
    }

    modifyRestockOrderState(id, state) {
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT * FROM RESTOCKORDER WHERE ID = ?"
            this.db.all(sql1, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject({error:err, code:500});
                    return;
                }
                if (rows.length < 1){
                    reject({ error: 'no restock order associated to id', code:404});
                }
                const sql2 = "UPDATE RESTOCKORDER SET STATE = ? WHERE ID = ?"
                this.db.all(sql2, [state.toUpperCase(), id], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject({error:err, code:500});
                        return;
                    }
                    resolve();
                });
            });
        });
    }

    modifyRestockOrderSKUs(id, skus) {
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT ID, SKUITEMS FROM RESTOCKORDER WHERE ID = ?"
            this.db.all(sql1, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject({error:err, code:500});
                    return;
                }
                if (rows.length < 1) {
                    reject({ error: 'no restock order associated to id', code:404 });
                    return;
                }

                if (rows[0].SKUITEMS != null) {
                    skus = skus.concat(JSON.parse(rows[0].SKUITEMS));
                }

                const sql2 = "UPDATE RESTOCKORDER SET SKUITEMS = ? WHERE ID = ?"
                this.db.all(sql2, [JSON.stringify(skus), id], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject({error:err, code:500});
                        return;
                    }
                    resolve();
                });

                resolve();
            });
        });
    }

    modifyRestockOrderNote(id, note) {
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT ID FROM RESTOCKORDER WHERE ID = ?"
            this.db.all(sql1, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject({error:err, code:500});
                    return;
                }
                if (rows.length < 1) {
                    reject({ error: 'no restock order associated to id' , code:404});
                    return;
                }
                const sql2 = "UPDATE RESTOCKORDER SET transportNote = ? WHERE ID = ?"
                this.db.all(sql2, [JSON.stringify(note), id], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject({error:err, code:500});
                    }
                    resolve();
                });
            });
        });
    }

    deleteRestockOrder(id) {
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT ID FROM RESTOCKORDER WHERE ID = ?"
            this.db.all(sql1, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject({error:err, code:500});
                    return;
                }
                if (rows.length < 1) {
                    reject({ error: 'no restock order associated to id', code:404});
                    return;
                }
                const sql2 = "DELETE FROM RESTOCKORDER WHERE ID = ?"
                this.db.all(sql2, [id], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject({error:err, code:500});
                        return;
                    }
                    resolve();
                });
            });
        });
    }

    

    // <------------ RETURN ORDER ------------->
    dropTableReturnOrder() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS RETURNORDER';
            this.db.run(sql, (err) => {
                if (err) {
                    reject({error:err, code:500});
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    newTableReturnOrder() {
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE IF NOT EXISTS RETURNORDER(
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                RETURNDATE TIMESTAMP, 
                PRODUCTS TEXT, 
                RESTOCKORDERID INTEGER,
                FOREIGN KEY (RESTOCKORDERID) REFERENCES RESTOCKORDER(ID))`;
            this.db.run(sql, (err) => {
                if (err) {
                    reject({error:err, code:500});
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getReturnOrders() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM RETURNORDER`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject({error:err, code:500});
                    return;
                }
                const orders = rows.map((r) => (
                    {
                        id: r.ID,
                        returnDate: r.RETURNDATE,
                        products: JSON.parse(r.PRODUCTS),
                        restockOrderId: r.RESTOCKORDERID,
                    }
                ));
                resolve(orders);
            });
        });
    }

    getReturnOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM RETURNORDER WHERE ID = ?`;
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject({error:err, code:500});
                    return;
                }
                if (rows.length < 1) {
                    reject({ error: 'no return order associated to id', code:404});
                    return;
                }
                let r = rows[0]
                const order =
                {
                    id: r.ID,
                    returnDate: r.RETURNDATE,
                    products: JSON.parse(r.PRODUCTS),
                    restockOrderId: r.RESTOCKORDERID,
                }
                resolve(order);
            });
        });
    }

    newReturnOrder(data) {
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT * FROM RESTOCKORDER WHERE ID = ?;"
            this.db.all(sql1, [data.restockOrderId], (err, rows) => {
                if (err) {
                    reject({error:err, code:500});
                    return;
                }
                if(rows.length<1){
                    reject({error:"No restock order matches the Id", code:404});
                    return;
                }
                const sql = 'INSERT INTO RETURNORDER(RETURNDATE, PRODUCTS, RESTOCKORDERID) VALUES(?, ?, ?)';
                const date = dayjs(data.returnDate).format('YYYY/MM/DD HH:mm') 
                this.db.run(sql, [date, JSON.stringify(data.products), data.restockOrderId], (err) => {
                    if (err) {
                        reject({error:err, code:500});
                        return;
                    }
                    resolve();
                });
            });
        });
    }

    deleteReturnOrder(id) {
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT ID FROM RETURNORDER WHERE ID = ?"
            this.db.all(sql1, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject({error:err, code:503});
                    return;
                }
                if (rows.length < 1) {
                    reject({ error: 'no return order associated to id', code:404});
                    return;
                }
                const sql2 = "DELETE FROM RETURNORDER WHERE ID = ?"
                this.db.all(sql2, [id], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject({error:err, code:503});
                        return;
                    }
                    resolve();
                });
            });
        });
    }

    // <------------------------INTERNAL ORDER---------------------->

    dropTableInternalOrder() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS INTERNALORDER';
            this.db.run(sql, (err) => {
                if (err) {
                    reject({error:err, code:500});
                    return;
                }
                resolve();
            });
        });
    }


    newTableInternalOrder() {
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE IF NOT EXISTS INTERNALORDER(
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                ISSUEDATE TIMESTAMP ,
                STATE VARCHAR CHECK(STATE IN ('ISSUED', 'ACCEPTED', 'REFUSED', 'CANCELED', 'COMPLETED')), 
                PRODUCTS TEXT, 
                CUSTOMERID INTEGER,
                FOREIGN KEY (CUSTOMERID) REFERENCES USER(ID))`;
            this.db.run(sql, (err) => {
                if (err) {
                    reject({error:err, code:500});
                    return;
                }
                resolve();
            });
        });
    }

    // GET

    getInternalOrders() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM INTERNALORDER`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject({error:err, code:500});
                    return;
                }
                const orders = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        products: JSON.parse(r.PRODUCTS),
                        customerId: r.CUSTOMERID
                    }
                ));
                resolve(orders);
            });
        });
    }

    getInternalOrdersIssued() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM INTERNALORDER WHERE STATE = 'ISSUED'`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject({error:err, code:500});
                    return;
                }
                const orders = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        products: JSON.parse(r.PRODUCTS),
                        customerId: r.CUSTOMERID
                    }
                ));
                resolve(orders);
            });
        });
    }

    getInternalOrdersAccepted() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM INTERNALORDER WHERE STATE = 'ACCEPTED'`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject({error:err, code:500});
                    return;
                }
                const orders = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        products: JSON.parse(r.PRODUCTS),
                        customerId: r.CUSTOMERID
                    }
                ));
                resolve(orders);
            });
        });
    }

    getInternalOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM INTERNALORDER WHERE ID = ?`;
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject({error:err, code:500});
                    return;
                }
                if (rows.length<1) {
                    reject({ error: 'no internal order associated to id', code:404});
                    return;
                }
                let r = rows[0]
                const order =
                {
                    id: r.ID,
                    issueDate: r.ISSUEDATE,
                    state: r.STATE,
                    products: JSON.parse(r.PRODUCTS),
                    customerId: r.CUSTOMERID,
                }
                resolve(order);
            });
        });
    }

    // POST 

    newInternalOrder(data) {
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT * FROM USER WHERE ID = ? AND TYPE = 'customer';"
            this.db.all(sql1, [data.customerId], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject({error:err, code:500});
                    return;
                }
                if(rows.length<1){
                    reject({error:"No customer matches the Id", code:422});
                    return;
                }
                const sql = 'INSERT INTO INTERNALORDER(ISSUEDATE, PRODUCTS, STATE, CUSTOMERID) VALUES(?, ?, "ISSUED", ?)';
                const date = dayjs(data.issueDate).format('YYYY/MM/DD HH:mm') ;
                this.db.run(sql, [date, JSON.stringify(data.products), data.customerId], (err) => {
                    if (err) {
                        reject({error:err, code:500});
                        return;
                    }
                    resolve();
                });
            });

        });
    }

    // PUT

    modifyInternalOrder(id, state, products) {
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT * FROM INTERNALORDER WHERE ID = ?"
            this.db.all(sql1, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject({error:err, code:500});
                    return;
                }
                if (rows.length < 1) {
                    reject({ error: 'no internal order associated to id', code:404});
                    return;
                }else if(products){
                    products = products.concat(JSON.parse(rows[0].PRODUCTS));
                }
                const sql2 = `UPDATE INTERNALORDER SET STATE = ?${products ? ', PRODUCTS = ?' : ''} WHERE ID = ?`
                let args = [state.toUpperCase(), id]
                if(products){
                    args = [state.toUpperCase(), JSON.stringify(products), id]
                }
                this.db.all(sql2, args, (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject({error:err, code:500});
                        return;
                    }
                    resolve();
                });
            });
        });
    }

    // DELETE

    deleteInternalOrder(id) {
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT ID FROM INTERNALORDER WHERE ID = ?"
            this.db.all(sql1, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject({error:err, code:503});
                    return;
                }
                if (rows.length < 1) {
                    reject({ error: 'no internal order associated to id', code:404});
                    return
                }
                const sql2 = "DELETE FROM INTERNALORDER WHERE ID = ?"
                this.db.all(sql2, [id], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject({error:err, code:503});
                        return;
                    }
                    resolve();
                });
            });
        });
    }

}

module.exports = controlOrder;