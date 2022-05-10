// 

// DA FARE: - implementare il log-in e non so come si fa
//          - implementare l'enum

// FATTI: - getUsers
//        - createUser
//        - getUserInfo
//        - getSuppliers
//        - 

class controlUser {

    sqlite = require('sqlite3');

    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });

    }

    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS NAMES';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    newTableUser() {
        return new Promise((resolve, reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS USER(ID INTEGER PRIMARY KEY AUTOINCREMENT,USERNAME VARCHAR ,NAME VARCHAR, SURNAME VARCHAR, TYPE VARCHAR CHECK(TYPE IN ('manager','customer', 'qualityEmployee', 'clerk', 'deliveryEmployee', 'supplier')), PASSWORD SHA512)";
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    createUser(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO USER(USERNAME, NAME, SURNAME, TYPE, PASSWORD) VALUES(?, ?, ?, ?, ?)';
            this.db.run(sql, [data.username, data.name, data.surname, data.type, data.password], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getUsers() {
        return new Promise((resolve, reject) => {
            const selectManager = "SELECT USERNAME FROM USER WHERE TYPE='manager'";
            const sql = `SELECT * FROM USER WHERE USERNAME NOT IN (${selectManager})`;

            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                const users = rows.map((r) => (
                    {
                        id: r.ID,
                        username: r.USERNAME,
                        name: r.NAME,
                        surname: r.SURNAME,
                        type: r.TYPE,
                        psw: r.PASSWORD

                    }
                ));
                resolve(users);
            });
        });
    }

    // Serve a fare il controllo su username e type 
    checkUser(data) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT USERNAME, TYPE FROM USER WHERE USERNAME = ? AND TYPE = ?"
            this.db.all(sql, [data.username, data.type], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                if (rows.length > 0)
                    reject(false)
                else
                    resolve(true);
            })
        });
    }

    getUserInfo(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM USER WHERE ID = ?"
            this.db.all(sql, [id], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                const info = rows.map((r) => (
                    {
                        id: r.ID,
                        username: r.USERNAME,
                        name: r.NAME,
                        surname: r.SURNAME,
                        type: r.TYPE
                    }
                ));

                resolve(info)

            })
        });
    }

    getSuppliers() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM USER WHERE TYPE = 'supplier'"
            this.db.all(sql, [], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                
                const info = rows.map((r) => (
                    {
                        id: r.ID,
                        username: r.USERNAME,
                        name: r.NAME,
                        surname: r.SURNAME
                    }
                ));

                resolve(info)

            })
        });
    }

    managerSession(data, type) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM USER WHERE USERNAME = ? AND PASSWORD = ? AND TYPE = ?"
            this.db.all(sql, [data.username, data.password, type], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                const managerInfo = rows.map((r) => (
                    {
                        id: r.ID,
                        username: r.USERNAME,
                        name: r.NAME
                    }
                ));

                if (rows.length > 0)
                    resolve(managerInfo)
                else
                    reject('data error');
            })
        });
    }


}


module.exports = controlUser;
