class controlSku {

    sqlite = require('sqlite3');

    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });

    }

    newTableSku() {
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE IF NOT EXISTS SKU(ID INTEGER PRIMARY KEY AUTOINCREMENT, DESCRIPTION VARCHAR, WHEGHT INT,
                VOLUME INT, NOTES VARCHAR, POSITION VARCHAR, AVAILABLE_QUANTITY INT, PRICE INT, TEST_DESCRIPTORS INT[])`;
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS SKU';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getSkus() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM SKU`;

            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                const sku = rows.map((r) => (
                    {
                        description : r.DESCRIPTION,
                        weight : r.WEIGHT,
                        volume : r.VOLUME,
                        notes : r.NOTES,
                        position : r.POSITION,
                        availableQuantity : r.AVAILABLE_QUANTITY,
                        price : r.PRICE,
                        testDescriptors : r.TEST_DESCRIPTORS
                     }
                ));
                resolve(sku);
            });
        });
    }

    getSkuById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM SKU WHERE ID = ?`;

            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                if (rows.length == 0)
                    reject("not found");

                const sku = rows.map((r) => (
                    {
                        description : r.DESCRIPTION,
                        weight : r.WEIGHT,
                        volume : r.VOLUME,
                        notes : r.NOTES,
                        position : r.POSITION,
                        availableQuantity : r.AVAILABLE_QUANTITY,
                        price : r.PRICE,
                        testDescriptors : r.TEST_DESCRIPTORS
                     }
                ));
                resolve(sku);
            });
        });
    }

    createSku(sku) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKU(DESCRIPTION, WHEGHT, VOLUME, NOTES, AVAILABLE_QUANTITY, PRICE) VALUES(?, ?, ?, ?, ?, ?)';
            this.db.run(sql, [sku.description, sku.weight, sku.volume, sku.notes, sku.availableQuantity, sku.price], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    modifySku(id, sku) {
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT * FROM SKU WHERE ID = ?"

            this.db.all(sql1, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                if (rows.length < 1)
                    reject('not found');             
            });

            const sql2 = "UPDATE SKU SET DESCRIPTION = ?, WHEGHT = ?, VOLUME = ?, NOTES = ?, AVAILABLE_QUANTITY = ?, PRICE = ? WHERE ID = ?"

            this.db.all(sql2, [sku.newDescription, sku.newWeight, sku.newVolume, sku.newNotes, sku.newAvailableQuantity, sku.newPrice, id], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                resolve('done');
            });
        });
    }
    
    modifySkuPositon(id, position) {
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT * FROM SKU WHERE ID = ?"

            this.db.all(sql1, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                if (rows.length < 1)
                    reject('not found');             
            });

            const sql2 = "UPDATE SKU SET POSITION = ? WHERE ID = ?"

            this.db.all(sql2, [position.position, id], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                resolve('done');
            });
        });
    }

    deleteSku(id) {
        return new Promise((resolve, reject) => {

            const sql1 = "SELECT * FROM SKU WHERE ID = ?";

            this.db.all(sql1, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                if (rows.length < 1)
                    reject('not found'); 
                                
            });

            const sql2 = "DELETE FROM SKU WHERE ID = ?"
            this.db.all(sql2, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve('done')
            })
        });
    }

}


module.exports = controlSku;