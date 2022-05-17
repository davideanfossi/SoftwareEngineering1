class controlTest {

    sqlite = require('sqlite3');

    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });

        const sql = `PRAGMA foreign_keys=on;`;
        this.db.run(sql, (err) => {
            if (err) {
                throw err;
            }
        });
    }

    // TEST DESCRIPTORS

    newTableTestDescriptor() {
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE IF NOT EXISTS TEST_DESCRIPTOR(
                ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                NAME VARCHAR, 
                PROCEDURE_DESCRIPTION VARCHAR,
                ID_SKU INT,
                CONSTRAINT fk_sku FOREIGN KEY (ID_SKU) REFERENCES SKU(ID)
                );`;
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
            const sql = 'DROP TABLE IF EXISTS TEST_DESCRIPTOR';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getTestDescriptors() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM TEST_DESCRIPTOR`;

            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                const TestDescriptors = rows.map((r) => (
                    {
                        id: r.ID,
                        name: r.NAME,
                        procedureDescription: r.PROCEDURE_DESCRIPTION,
                        idSKU : r.idSKU
                    }
                ));
                resolve(TestDescriptors);
            });
        });
    }

    getTestDescriptorById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM TEST_DESCRIPTOR WHERE ID = ?`;

            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                if (rows.length == 0)
                    reject("not found");

                const TestDescriptors = rows.map((r) => (
                    {
                        id: r.ID,
                        name: r.NAME,
                        procedureDescription: r.PROCEDURE_DESCRIPTION,
                        idSKU : r.idSKU
                    }
                ));
                resolve(TestDescriptors);
            });
        });
    }

    modifyTestDescriptor(id, data) {
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT * FROM TEST_DESCRIPTOR WHERE ID = ?"

            this.db.all(sql1, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                if (rows.length < 1)
                    reject('not found');             
            });

            const sql2 = "UPDATE TEST_DESCRIPTOR SET NAME = ?, PROCEDURE_DESCRIPTION = ?, ID_SKU = ? WHERE ID = ?"

            this.db.all(sql2, [data.newName, data.newProcedureDescription, data.newIdSKU, id], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                resolve('done');
            });


        });
    }

    deleteTestDescriptor(id) {
        return new Promise((resolve, reject) => {

            const sql1 = "SELECT * FROM TEST_DESCRIPTOR WHERE ID = ?"

            this.db.all(sql1, [id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                if (rows.length < 1)
                    reject('not found');             
            });

            const sql2 = "DELETE FROM TEST_DESCRIPTOR WHERE ID = ?"
            this.db.all(sql2, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve('done')
            })
        });
    }

    // Serve a fare il controllo sul test descriptor
    checkTestDescriptor(data, typeOfCheck) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT NAME, ID_SKU FROM TEST_DESCRIPTOR WHERE NAME = ? AND ID_SKU = ?"
            this.db.all(sql, [data.name, data.idSKU], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                if (typeOfCheck === 'newTest') {
                    if (rows.length > 0)
                        reject(false);
                    else
                        resolve(true);
                }else{
                    if (rows.length > 0)
                        resolve('done');
                    else
                        reject('not found');
                }

            })
        });
    }

    createTestDescriptor(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO TEST_DESCRIPTOR(NAME, PROCEDURE_DESCRIPTION, ID_SKU) VALUES(?, ?, ?)';
            this.db.run(sql, [data.name, data.procedureDescription, data.idSKU], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    // TEST RESULTS

    newTableTestResults() {
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE IF NOT EXISTS TEST_RESULT(
                            ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                            ID_TEST_DESCRIPTOR INT,
                            DATE DATE,
                            RESULT BOOLEAN,
                            CONSTRAINT fk_test_descriptor FOREIGN KEY (ID_TEST_DESCRIPTOR) REFERENCES TEST_DESCRIPTOR(ID)
                        );`;
            this.db.run(sql, (err) => {
                if (err) {
                    console.log("2");
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getTestResults(rfid) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM TEST_DESCRIPTOR AS TD, TEST_RESULT AS TR WHERE TD.ID = TR.ID_TEST_DESCRIPTOR AND TD.ID_SKU = ?`;

            this.db.all(sql, [rfid], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                if (rows.length == 0)
                    reject("not found");

                const TestDescriptors = rows.map((r) => (
                    {
                        id: r.ID,
                        idTestDescriptor: r.ID_TEST_DESCRIPTOR,
                        Date: r.DATE,
                        Result : r.RESULT
                    }
                ));
                resolve(TestDescriptors);
            });
        });
    }

    getTestResultById(rfid, id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM TEST_DESCRIPTOR AS TD, TEST_RESULT AS TR WHERE TD.ID = TR.ID_TEST_DESCRIPTOR AND TD.ID_SKU = ? AND TR.ID = ?`;

            this.db.all(sql, [rfid, id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                if (rows.length == 0)
                    reject("not found");

                const TestDescriptors = rows.map((r) => (
                    {
                        id: r.ID,
                        idTestDescriptor: r.ID_TEST_DESCRIPTOR,
                        Date: r.DATE,
                        Result : r.RESULT
                    }
                ));
                resolve(TestDescriptors);
            });
        });
    }

    checkTestResult(data, typeOfCheck) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT ID_TEST_DESCRIPTOR, DATE FROM TEST_RESULT WHERE ID_TEST_DESCRIPTOR = ? AND DATE = ?"
            this.db.all(sql, [data.idTestDescriptor, data.Date], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                if (typeOfCheck === 'newTest') {
                    if (rows.length > 0){
                        reject(false);
                    }
                    else
                        resolve(true);
                }else{
                    if (rows.length > 0)
                        resolve('done');
                    else
                        reject('not found');
                }
            })
        });
    }

    modifyTestResult(rfid, id, data) {
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT * FROM TEST_DESCRIPTOR AS TD, TEST_RESULT AS TR WHERE TD.ID = TR.ID_TEST_DESCRIPTOR AND TD.ID_SKU = ? AND TR.ID = ?";

            this.db.all(sql1, [rfid, id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                if (rows.length < 1)
                    reject('not found');             
            });

            const sql2 = "UPDATE TEST_RESULT SET ID_TEST_DESCRIPTOR = ?, DATE = ?, RESULT = ? WHERE ID = ?"

            this.db.all(sql2, [data.newIdTestDescriptor, data.newDate, data.newResult, id], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                resolve('done');
            });
        });
    }

    createTestResult(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO TEST_RESULT(ID_TEST_DESCRIPTOR, DATE, RESULT) VALUES(?, ?, ?)';
            this.db.run(sql, [data.idTestDescriptor, data.Date, data.Result], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    deleteTestResult(rfid, id) {
        return new Promise((resolve, reject) => {

            const sql1 = "SELECT * FROM TEST_DESCRIPTOR AS TD, TEST_RESULT AS TR WHERE TD.ID = TR.ID_TEST_DESCRIPTOR AND TD.ID_SKU = ? AND TR.ID = ?";

            this.db.all(sql1, [rfid, id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                if (rows.length < 1)
                    reject('not found'); 
                                
            });

            const sql2 = "DELETE FROM TEST_RESULT WHERE ID = ?"
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


module.exports = controlTest;
