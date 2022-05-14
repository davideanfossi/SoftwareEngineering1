const { json } = require('express');

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
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    newTableRestockOrder() {
        return new Promise((resolve, reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS RESTOCKORDER(ID INTEGER PRIMARY KEY AUTOINCREMENT,ISSUEDATE TIMESTAMP ,STATE VARCHAR CHECK(STATE IN ('ISSUED', 'DELIVERY', 'DELIVERED', 'TESTED', 'COMPLETEDRETURN', 'COMPLETED')), PRODUCTS TEXT, SUPPLIERID INTEGER, TRANSPORTNOTE VARCHAR, SKUITEMS TEXT)";
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
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
                    reject(err);
                    return;
                }
               
                const orders = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        products: JSON.parse(r.PRODUCTS),
                        supplierID: r.SUPPLIERID,
                        transportNote: r.TRANSPORTNOTE,
                        skuItems: JSON.parse(r.SKUITEMS)

                    }
                ));
                resolve(orders);
            });
        });
    }

    getIssuedRestockOrders() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM RESTOCKORDER WHERE STATE = ISSUED`;

            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
               
                const orders = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        products: JSON.parse(r.PRODUCTS),
                        supplierID: r.SUPPLIERID,
                        transportNote: r.TRANSPORTNOTE,
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

            this.db.all(sql, [id], (err, r) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                if (r === undefined) {
                    reject({error: 'no restock order associated to id'});
                }
               
                const order = 
                    {
                        id: r.ID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        products: JSON.parse(r.PRODUCTS),
                        supplierID: r.SUPPLIERID,
                        transportNote: r.TRANSPORTNOTE,
                        skuItems: JSON.parse(r.SKUITEMS)

                    }

                resolve(order);
            });
        });
    }

    getSkuItemsByRestockOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT SKUITEMS FROM RESTOCKORDER WHERE ID = ?`;

            this.db.all(sql, [id], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                const skuItems = JSON.parse(row);
                resolve(skuItems);

            });
        });
    }

    newRestockOrder(data){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RESTOCKORDER(ISSUEDATE, PRODUCTS, SUPPLIERID) VALUES(?, ?, ?)';
            this.db.run(sql, [data.issueDate, JSON.stringify(data.products), data.supplierId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    modifyRestockOrderState(id, state){
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT * FROM RESTOCKORDER WHERE ID = ?"
            this.db.all(sql1, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                if (rows.length < 1)
                    reject({error: 'no restock order associated to id'});
            });
            const sql2 = "UPDATE RESTOCKORDER SET STATE = ? WHERE ID = ?"
            this.db.all(sql2, [state, id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                console.log(rows);
                resolve();
            });
        });
    }

    modifyRestockOrderSKUs(id, skus){
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT ID, SKUITEMS FROM RESTOCKORDER WHERE ID = ?"
            this.db.all(sql1, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                if (rows.length < 1){
                    reject({error: 'no restock order associated to id'});
                    return
                }
                if(rows[0].SKUITEMS.length>0){
                    skus = skus.concat(JSON.parse(rows[0].SKUITEMS));
                }
                console.log(skus)
                const sql2 = "UPDATE RESTOCKORDER SET SKUITEMS = ? WHERE ID = ?"
                this.db.all(sql2, [JSON.stringify(skus), id], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        });
    }

    modifyRestockOrderNote(id, note){
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT ID FROM RESTOCKORDER WHERE ID = ?"
            this.db.all(sql1, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                if (rows.length < 1){
                    reject({error: 'no restock order associated to id'});
                    return
                }
                
                const sql2 = "UPDATE RESTOCKORDER SET transportNote = ? WHERE ID = ?"
                this.db.all(sql2, [note, id], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        });
    }

    deleteRestockOrder(id){
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT ID FROM RESTOCKORDER WHERE ID = ?"
            this.db.all(sql1, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                if (rows.length < 1){
                    reject({error: 'no restock order associated to id'});
                    return
                }
                
                const sql2 = "DELETE FROM RESTOCKORDER SET WHERE ID = ?"
                this.db.all(sql2, [id], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
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
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    newTableReturnOrder() {
        return new Promise((resolve, reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS RETURNORDER(ID INTEGER PRIMARY KEY AUTOINCREMENT,RETURNDATE TIMESTAMP, PRODUCTS TEXT, RESTOCKORDERID INTEGER)";
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
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
                    reject(err);
                    return;
                }
               
                const orders = rows.map((r) => (
                    {
                        id: r.ID,
                        returnDate: r.ISSUEDATE,
                        products: JSON.parse(r.PRODUCTS),
                        restockOrderId: r.SUPPLIERID,
                    }
                ));
                resolve(orders);
            });
        });
    }

    getReturnOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM RETURNORDER WHERE ID = ?`;
            this.db.all(sql, [id], (err, r) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                if (r === undefined) {
                    reject({error: 'no return order associated to id'});
                }
                const order = 
                {
                    id: r.ID,
                    returnDate: r.ISSUEDATE,
                    products: JSON.parse(r.PRODUCTS),
                    restockOrderId: r.SUPPLIERID,
                }
                resolve(order);
            });
        });
    }

    newReturnOrder(data){
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RETURNORDER(RETURNDATE, PRODUCTSS, RESTOCKORDERID) VALUES(?, ?, ?)';
            this.db.run(sql, [data.returnDate, JSON.stringify(data.products), data.restockOrderId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    deleteReturnOrder(id){
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT ID FROM RETURNORDER WHERE ID = ?"
            this.db.all(sql1, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                if (rows.length < 1){
                    reject({error: 'no return order associated to id'});
                    return
                }
                
                const sql2 = "DELETE FROM RETURNORDER SET WHERE ID = ?"
                this.db.all(sql2, [id], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err);
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
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

newTableInternalOrder() {
    return new Promise((resolve, reject) => {
        const sql = "CREATE TABLE IF NOT EXISTS INTERNALORDER(ID INTEGER PRIMARY KEY AUTOINCREMENT,ISSUEDATE TIMESTAMP ,STATE VARCHAR CHECK(STATE IN ('ISSUED', 'ACCEPTER', 'REFUSED', 'CANCELED', 'COMPLETED')), PRODUCTS TEXT, CUSTOMERID INTEGER)";
        this.db.run(sql, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
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
                reject(err);
                return;
            }
            const orders = rows.map((r) => (
                {
                    id: r.ID,
                    issueDate: r.ISSUEDATE,
                    state: r.STATE,
                    products: JSON.parse(r.PRODUCTS),
                    supplierID: r.CUSTOMERID
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
                reject(err);
                return;
            }
            const orders = rows.map((r) => (
                {
                    id: r.ID,
                    issueDate: r.ISSUEDATE,
                    state: r.STATE,
                    products: JSON.parse(r.PRODUCTS),
                    supplierID: r.CUSTOMERID
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
                reject(err);
                return;
            }
            const orders = rows.map((r) => (
                {
                    id: r.ID,
                    issueDate: r.ISSUEDATE,
                    state: r.STATE,
                    products: JSON.parse(r.PRODUCTS),
                    supplierID: r.CUSTOMERID
                }
            ));
            resolve(orders);
        });
    });
}

getInternalOrder(id) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM INTERNALORDER WHERE ID = ?`;
        this.db.all(sql, [id], (err, r) => {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            if (r === undefined) {
                reject({error: 'no internal order associated to id'});
            }
            const order = 
            {
                id: r.ID,
                returnDate: r.ISSUEDATE,
                products: JSON.parse(r.PRODUCTS),
                restockOrderId: r.CUSTOMERID,
            }
            resolve(order);
        });
    });
}

// POST 

newInternalOrder(data){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO INTERNALORDER(ISSUEDATE, PRODUCTS, CUSTOMERID) VALUES(?, ?, ?)';
        this.db.run(sql, [data.issueDate, JSON.stringify(data.products), data.customerId], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

// PUT

modifyInternalOrder(id, state, products){
    return new Promise((resolve, reject) => {
        const sql1 = "SELECT * FROM INTERNALORDER WHERE ID = ?"
        this.db.all(sql1, [id], (err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            if (rows.length < 1){
                reject({error: 'no internal order associated to id'});
            }
            products = products.concat(JSON.parse(rows[0].PRODUCTS));
            const sql2 = "UPDATE INTERNALORDER SET STATE = ?, products = ? WHERE ID = ?"
            this.db.all(sql2, [state, products, id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                console.log(rows);
                resolve();
            });
            
        });
    });
}

// DELETE

deleteInternalOrder(id){
    return new Promise((resolve, reject) => {
        const sql1 = "SELECT ID FROM INTERNALORDER WHERE ID = ?"
        this.db.all(sql1, [id], (err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            if (rows.length < 1){
                reject({error: 'no internal order associated to id'});
                return
            }
            
            const sql2 = "DELETE FROM INTERNALORDER SET WHERE ID = ?"
            this.db.all(sql2, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    });
}

}

module.exports = controlOrder;