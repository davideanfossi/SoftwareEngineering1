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
        ISSUED, DELIVERY, DELIVERED, TESTED, COMPLETEDRETURN, COMPLETED
        return new Promise((resolve, reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS RESTOCKORDER(ID INTEGER PRIMARY KEY AUTOINCREMENT,ISSUEDATE TIMESTAMP ,STATE VARCHAR CHECK(TYPE IN ('ISSUED', 'DELIVERY', 'DELIVERED', 'TESTED', 'COMPLETEDRETURN', 'COMPLETED')), PRODUCTS TEXT, SUPPLIERID INTEGER, TRANSPORTNOTE VARCHAR, SKUITEMS TEXT)";
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


}

module.exports = controlOrder;