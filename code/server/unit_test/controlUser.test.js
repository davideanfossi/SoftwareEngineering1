const controlUser = require('../modules/controlUser');
const db = new controlUser('EzWh.db');

describe('testControlUser', () => {
    beforeEach(async () => {
        await db.dropContentUser();
    });

    test('delete db', async () => {
        var res = await db.getUsers();
        expect(res.length).toStrictEqual(0);
    });

    
    
    testGetSupplier();
    testGetUsers();
    testNewUser('john.snow@supplier.ezwh.com', 'John', 'Snow', 'ciao1234', "customer");
    testCheckUser('john.snow@supplier.ezwh.com', 'John', 'Snow', 'ciao1234', "customer");
    testSession('john.snow@supplier.ezwh.com', 'John', 'Snow', 'ciao1234', "customer");
    testUserRight('john.snow@supplier.ezwh.com', 'John', 'Snow', 'ciao1234', "customer", "clerk");
    testDeleteUser('john.snow@supplier.ezwh.com', 'John', 'Snow', 'ciao1234', "customer");


});

function testGetSupplier(){
    test('get supplier', async () => {

        const user = { username: 'john.snow@supplier.ezwh.com', name: 'John', surname: "Snow", password: "ciao1234", type: "supplier" }
        await db.createUser(user);
        
        var res = await db.getSuppliers();
        expect(res.length).toStrictEqual(1);

        const sup = res[0];
        expect(sup.USERNAME).toStrictEqual(user.username);
        expect(sup.NAME).toStrictEqual(user.name);
        expect(sup.SURNAME).toStrictEqual(user.surname);

    });

    test('get supplier wrong', async () => {
        await db.dropContentUser();
        const user = { username: 'john.snow@supplier.ezwh.com', name: 'John', surname: "Snow", password: "ciao1234", type: "customer" }
        await db.createUser(user);
        
        var res = await db.getSuppliers();
        expect(res.length).toStrictEqual(0);

    });
}

function testGetUsers(){
    test('get user', async () => {

        await db.dropContentUser();
        const user = { username: 'john.snow@supplier.ezwh.com', name: 'John', surname: "Snow", password: "ciao1234", type: "supplier" }
        await db.createUser(user);
        
        var res = await db.getUsers();
        expect(res.length).toStrictEqual(1);

        const usr = res[0];
        expect(usr.USERNAME).toStrictEqual(user.username);
        expect(usr.NAME).toStrictEqual(user.name);
        expect(usr.SURNAME).toStrictEqual(user.surname);
        expect(usr.TYPE).toStrictEqual(user.type);


    });
}


function testNewUser(username, name, surname, password, type) {

    test('create new user', async () => {
        await db.dropContentUser();
        const user = {username: username, name: name, surname: surname, password: password, type: type}
        await db.createUser(user);
        
        var res = await db.getUsers();
        expect(res.length).toStrictEqual(1);

        const usr = res[0];
        expect(usr.USERNAME).toStrictEqual(user.username);
        expect(usr.NAME).toStrictEqual(user.name);
        expect(usr.SURNAME).toStrictEqual(user.surname);
        expect(usr.TYPE).toStrictEqual(user.type);
    });

   test('create new user with bad type', async () => {
        await db.dropContentUser();
        const user = {username: username, name: name, surname: surname, password: password, type: 'pippo'}

        try{
            await db.createUser(user);
        } catch(err){
            expect(err).toStrictEqual('SQLITE_CONSTRAINT')
        }
    });

} 

function testCheckUser(username, name, surname, password, type) {

    test('check user for new user good ', async () => {

        const user = {username: username, name: name, surname: surname, password: password, type: type}
        await db.createUser(user);
        
        const data = {username: 'pippo', type: type};
        const res = await db.checkUser(data, 'newUser');

        expect(res).toStrictEqual('done');

    });

    test('check user for new user bad ', async () => {

        const user = {username: username, name: name, surname: surname, password: password, type: type}
        await db.createUser(user);
        
        const data = {username: username, type: type};

        try {
            await db.checkUser(data, 'newUser');
        } catch (error) {
            expect(error).toStrictEqual('user already exist');
        }
        

       

    });


    test('check user for delete/update good ', async () => {

        const user = {username: username, name: name, surname: surname, password: password, type: type}
        await db.createUser(user);
        
        const data = {username: username, type: type};
        const res = await db.checkUser(data, 'delUp');

        expect(res).toStrictEqual('done');

    });

    test('check user for delete/update bad ', async () => {

        const user = {username: username, name: name, surname: surname, password: password, type: type}
        await db.createUser(user);
        
        const data = {username: 'pippo', type: type};

        try {
            await db.checkUser(data, 'delUp');
        } catch (error) {
            expect(error).toStrictEqual('not found');
        }
        

        

    });

} 

function testSession(username, name, surname, password, type) {

    test('do session good', async () => {

        const user = {username: username, name: name, surname: surname, password: password, type: type}
        await db.createUser(user);
        
        const session = {username: username, password: password};
        var info = await db.session(session, type);

        expect(info.USERNAME).toStrictEqual(username);
        expect(info.NAME).toStrictEqual(name);
    });

    test('do session bad', async () => {
        
        const user = {username: username, name: name, surname: surname, password: password, type: type}
        await db.createUser(user);
        
        const session = {username: '', password: password};
        try {
            await db.session(session, type);
        } catch (error) {
            expect(error).toStrictEqual('data error');
        }
        
    });
} 

function testUserRight(username, name, surname, password, type, newType) {

    test('modify user right', async () => {

        const user = {username: username, name: name, surname: surname, password: password, type: type}
        await db.createUser(user);
        
        const rights = {oldType: type, newType: newType};
        const res = await db.modifyUserRights(username, rights);

        expect(res).toStrictEqual('done');

        const users = await db.getUsers();
        expect(users[0].TYPE).toStrictEqual(newType);

    });
}

function testDeleteUser(username, name, surname, password, type) {

    test('delete user', async () => {

        const user = {username: username, name: name, surname: surname, password: password, type: type}
        await db.createUser(user);
        
        const res = await db.deleteUser(username, type);

        expect(res).toStrictEqual('done');

        const users = await db.getUsers();
        expect(users.length).toStrictEqual(0);
    });
}

