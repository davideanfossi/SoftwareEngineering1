class controlSku {

    sqlite = require('sqlite3');

    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });

        // const sql = `PRAGMA foreign_keys=on;`;
        // this.db.run(sql, (err) => {
        //     if (err) {
        //         throw err;
        //     }
        // });
    }

    //SKU

    newTableSku() {
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE IF NOT EXISTS SKU(
                ID INTEGER PRIMARY KEY AUTOINCREMENT, 
                DESCRIPTION VARCHAR, 
                WEIGHT INT,
                VOLUME INT, 
                NOTES VARCHAR, 
                POSITION TEXT, 
                AVAILABLE_QUANTITY INT, 
                PRICE INT,
                CONSTRAINT fk_position FOREIGN KEY (POSITION) REFERENCES POSITION(POSITIONID)
                )`;
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }
    
    getSkuById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM SKU, TEST_DESCRIPTOR AS TD WHERE SKU.ID = TD.ID_SKU AND SKU.ID = ?`;
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                 if (rows.length < 1){
                    reject("not found");
                    return;
                }    

                let testDescriptors = [];
                rows.forEach(r => testDescriptors.push(r.ID));
                let a = [rows[0]];
                const sku = a.map((r) => (
                    {
                        description : r.DESCRIPTION,
                        weight : r.WEIGHT,
                        volume : r.VOLUME,
                        notes : r.NOTES,
                        position : r.POSITION,
                        availableQuantity : r.AVAILABLE_QUANTITY,
                        price : r.PRICE,
                        testDescriptors : testDescriptors
                     }
                ));
           
                resolve(sku);
            });
        });
    }
    
    getSkuIds() {
        return new Promise((resolve, reject) => {
            let ids = [];
            const sql = `SELECT ID FROM SKU`;

            this.db.all(sql, [], (err, rows) => {
                if (err) {           
                    reject(err);
                    return;
                }
                
                rows.forEach(r => ids.push(r.ID));
                
                resolve(ids);
            });
        });
    }

    createSku(sku) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKU(DESCRIPTION, WEIGHT, VOLUME, NOTES, AVAILABLE_QUANTITY, PRICE) VALUES(?, ?, ?, ?, ?, ?)';
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
                    reject(err);
                    return;
                }

                if (rows.length < 1)
                    reject('not found');             
            });

            const sql2 = "UPDATE SKU SET DESCRIPTION = ?, WEIGHT = ?, VOLUME = ?, NOTES = ?, AVAILABLE_QUANTITY = ?, PRICE = ? WHERE ID = ?"

            this.db.all(sql2, [sku.newDescription, sku.newWeight, sku.newVolume, sku.newNotes, sku.newAvailableQuantity, sku.newPrice, id], (err, rows) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve('done');
            });
        });
    }

    modifySkuPositon(id, position) {
        return new Promise((resolve, reject) => {
            const sql1 = "UPDATE SKU SET POSITION = ? WHERE ID = ?"
            this.db.all(sql1, [position.position, id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve('done');
            });
        });
    }

    getWeightVolume(id) {
        return new Promise((resolve, reject) => {
            let weight;
            let volume;
            let oldPosition
        
            const sql = "SELECT WEIGHT, AVAILABLE_QUANTITY, POSITION FROM SKU WHERE ID = ?"
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
        
                if (rows.length < 1)
                    reject('not found');  
                else{
                    weight = rows[0].WEIGHT;
                    volume = rows[0].AVAILABLE_QUANTITY;
                    oldPosition = rows[0].POSITION;
                    resolve([weight, volume, oldPosition]);
                }     
            });
        });
    }

    deleteSku(id) {
        return new Promise((resolve, reject) => {

            const sql1 = "SELECT * FROM SKU WHERE ID = ?";

            this.db.all(sql1, [id], (err, rows) => {
                if (err) {
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

    deleteAllSku() {                        // ADDED
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM SKU"
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve('done')
            })
        });
    }

    dropSKUTable() {
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
   
    // SKUItem

    newTableSKUItem() { 
        return new Promise((resolve, reject) => {                                                   
            const sql = "CREATE TABLE IF NOT EXISTS SKUITEM(RFID TEXT, SKUID INTEGER, AVAILABLE BIT DEFAULT 0, DATEOFSTOCK TEXT, PRIMARY KEY(RFID), FOREIGN KEY(SKUID) REFERENCES SKU(ID))";
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);                
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getSKUItems() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM SKUITEM`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    getSKUItemsAvailable(SKUId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM SKUITEM WHERE SKUID = ? AND AVAILABLE = 1"
            this.db.all(sql, [SKUId], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(rows)
            })
        });
    }

    getSKUItem(rfid) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM SKUITEM WHERE RFID = ?"
            this.db.all(sql, [rfid], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(rows)
            })
        });
    }

    createSKUItem(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKUITEM(RFID, SKUID, DATEOFSTOCK) VALUES(?, ?, ?)';
            this.db.run(sql, [data.RFID, data.SKUId, data.DateOfStock], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    modifySKUItem(rfid, data) {
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT RFID, AVAILABLE, DATEOFSTOCK FROM SKUITEM WHERE RFID = ?"

            this.db.all(sql1, [rfid], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                if (rows.length < 1)
                    reject('not found');
            });

            const sql2 = "UPDATE SKUITEM SET RFID = ?, AVAILABLE = ?, DATEOFSTOCK = ?  WHERE RFID = ?"

            this.db.all(sql2, [data.newRFID, data.newAvailable, data.newDateOfStock, rfid], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve('done');
            });
        });
    }

    deleteSKUItem(rfid) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM SKUITEM WHERE RFID = ? "
            this.db.all(sql, [rfid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve('done')
            })
        });
    }

    deleteAllSKUItem() {                        // ADDED
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM SKUITEM"
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve('done')
            })
        });
    }

    dropSKUItemTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS SKUITEM';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }


    // Position

    newTablePosition() { 
        return new Promise((resolve, reject) => {                                                                
            const sql = "CREATE TABLE IF NOT EXISTS POSITION(POSITIONID TEXT, AISLEID VARCHAR(4), ROW VARCHAR(4), COL VARCHAR(4), MAXWEIGHT INTEGER, MAXVOLUME INTEGER, OCCUPIEDWEIGHT INTEGER DEFAULT 0 NOT NULL, OCCUPIEDVOLUME INTEGER DEFAULT 0 NOT NULL, PRIMARY KEY(POSITIONID))";
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    createPosition(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO POSITION(POSITIONID, AISLEID, ROW, COL, MAXWEIGHT, MAXVOLUME) VALUES(?, ?, ?, ?, ?, ?)';
            this.db.run(sql, [data.positionID, data.aisleID, data.row, data.col, data.maxWeight, data.maxVolume], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getPositions() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM POSITION`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    modifyPosition(newPositionID, positionid, data) {
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT POSITIONID, AISLEID, ROW, COL, MAXWEIGHT, MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME FROM POSITION WHERE POSITIONID = ?"
            this.db.all(sql1, [positionid], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                if (rows.length < 1)
                    reject('not found');
            });

            const sql2 = "UPDATE POSITION SET POSITIONID = ?, AISLEID = ?, ROW = ?, COL = ?, MAXWEIGHT = ?, MAXVOLUME = ?, OCCUPIEDWEIGHT = ?, OCCUPIEDVOLUME = ? WHERE POSITIONID = ?"

            this.db.all(sql2, [newPositionID, data.newAisleID, data.newRow, data.newCol, data.newMaxWeight, data.newMaxVolume, data.newOccupiedWeight, data.newOccupiedVolume, positionid], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                resolve('done');
            });
        });
    }

    updateOccupied(weight, volume, position, oldPosition) {
        return new Promise((resolve, reject) => {
            const sql1 = "UPDATE POSITION SET OCCUPIEDWEIGHT = OCCUPIEDWEIGHT + ?, OCCUPIEDVOLUME = OCCUPIEDVOLUME + ? WHERE POSITIONID = ?"
            this.db.all(sql1, [weight, volume, position.position], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve('done');
            });

            const sql2 = "UPDATE POSITION SET OCCUPIEDWEIGHT = OCCUPIEDWEIGHT - ?, OCCUPIEDVOLUME = OCCUPIEDVOLUME - ? WHERE POSITIONID = ?"
            this.db.all(sql2, [weight, volume, oldPosition], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve('done');
            });
        });
    }

    modifyPositionID(oldpositionid, newpositionid, aisleid, row, col) {
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT POSITIONID FROM POSITION WHERE POSITIONID = ?"

            this.db.all(sql1, [oldpositionid], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                if (rows.length < 1)
                    reject('not found');
            });
            const sql2 = "UPDATE POSITION SET POSITIONID = ?, AISLEID = ?, ROW = ?, COL = ?  WHERE POSITIONID = ?"

            this.db.all(sql2, [newpositionid, aisleid, row, col, oldpositionid], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                resolve('done');
            });
        });
    }

    deletePosition(positionid) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM POSITION WHERE POSITIONID = ? "
            this.db.all(sql, [positionid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve('done')
            })
        });
    }

    deleteAllPosition() {                        // ADDED
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM POSITION"
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve('done')
            })
        });
    }
  
    dropPositionTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS POSITION';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    // Item

    newTableItem() { 
        return new Promise((resolve, reject) => {                                                                  
            const sql = "CREATE TABLE IF NOT EXISTS ITEM(ID INTEGER, DESCRIPTION TEXT, PRICE REAL, SKUID INTEGER, SUPPLIERID INTEGER, PRIMARY KEY(ID), FOREIGN KEY(SKUID) REFERENCES SKU(ID))";
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    createItem(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO ITEM(ID, DESCRIPTION, PRICE, SKUID, SUPPLIERID) VALUES(?, ?, ?, ?, ?)';
            this.db.run(sql, [data.id, data.description, data.price, data.SKUId, data.supplierId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getItems() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ITEM`;

            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    getItem(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM ITEM WHERE ID = ?"
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(rows)
            })
        });
    }

    modifyItem(id, data) {
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT DESCRIPTION, PRICE FROM ITEM WHERE ID = ?"
            this.db.all(sql1, [id], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                if (rows.length < 1)
                    reject('not found');
            });

            const sql2 = "UPDATE ITEM SET DESCRIPTION = ?, PRICE = ?  WHERE ID = ?"

            this.db.all(sql2, [data.newDescription, data.newPrice, id], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve('done');
            });
        });
    }

    checkExisting(data) {
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT * FROM ITEM WHERE SUPPLIERID = ?"
            this.db.all(sql1, [data.supplierId], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

            });
            const sql2 = "SELECT * FROM ITEM WHERE ID = ? OR SKUID = ?"

            this.db.all(sql2, [data.id, data.SKUId], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    deleteItem(id) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM ITEM WHERE ID = ? "
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve('done')
            })
        });
    }

    deleteAllItem() {                        // ADDED
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM ITEM"
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve('done')
            })
        });
    }

    dropItemTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS ITEM';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

}
module.exports = controlSku;