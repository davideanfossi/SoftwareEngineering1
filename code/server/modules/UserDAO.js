class UserDAO {

    sqlite = require('sqlite3');

    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if(err) throw err;
        });
        
    }

    dropTable() {
        return new Promise((resolve, reject)  => {
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
        return new Promise((resolve, reject)  => {
            const sql = 'CREATE TABLE IF NOT EXISTS USER(ID INTEGER PRIMARY KEY AUTOINCREMENT,USERNAME VARCHAR ,NAME VARCHAR, SURNAME VARCHAR, TYPE VARCHAR, PASSWORD SHA512)';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    storeUser(data) {
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

    getStoredUsers() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USER';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const users = rows.map((r) => (
                    {  
                        id:r.ID,
                        username: r.USERNAME,
                        name : r.NAME,
                        surname : r.SURNAME,
                        type: r.TYPE,
                        psw: r.PASSWORD

                    }
                ));
                resolve(users);
            });
        });
    }

}


module.exports = UserDAO;
