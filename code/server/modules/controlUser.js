// 

// DA FARE: - implementare il log-in e il log-out non so come si fa
//          - implementare l'enum

// FATTI: - getUsers
//        - createUser
//        - getUserInfo
//        - getSuppliers
//        - allSessions (6)
//        - modifyUserRught
//        - deleteUser

class controlUser {

    sqlite = require('sqlite3');

    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });

    }

    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS USER';
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

    // SOLO TEST
    getAll() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM USER`;

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
    checkUser(data, typeOfCheck) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT USERNAME, TYPE FROM USER WHERE USERNAME = ? AND TYPE = ?"
            this.db.all(sql, [data.username, data.type], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                if (typeOfCheck === 'newUser') {
                    if (rows.length > 0)
                        reject(false)
                    else
                        resolve(true);
                }else{
                    if (rows.length > 0)
                        resolve('done')
                    else
                        reject('not found');
                }

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

    session(data, type) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM USER WHERE USERNAME = ? AND PASSWORD = ? AND TYPE = ?"
            this.db.all(sql, [data.username, data.password, type], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                const info = rows.map((r) => (
                    {
                        id: r.ID,
                        username: r.USERNAME,
                        name: r.NAME
                    }
                ));

                if (rows.length > 0)
                    resolve(info)
                else
                    reject('data error');
            })
        });
    }

    modifyUserRights(username, rights) {
        return new Promise((resolve, reject) => {
            const sql1 = "SELECT USERNAME, TYPE FROM USER WHERE USERNAME = ? AND TYPE = ?"

            this.db.all(sql1, [username, rights.oldType], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                if (rows.length < 1)
                    reject('not found');
            });

            const sql2 = "UPDATE USER SET TYPE = ? WHERE USERNAME = ?"

            this.db.all(sql2, [rights.newType, username], (err, rows) => {

                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                console.log(rows);

                resolve('done');
            });


        });
    }

    deleteUser(username, type) {
        return new Promise((resolve, reject) => {

            const sql = "DELETE FROM USER WHERE USERNAME = ? AND TYPE = ? "
            this.db.all(sql, [username, type], (err, rows) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve('done')
            })
        });
    }
}


module.exports = controlUser;
