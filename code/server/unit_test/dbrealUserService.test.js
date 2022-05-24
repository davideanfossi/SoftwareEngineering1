const UserService = require('../services/user_service');
const controlUser = require('../modules/controlUser');
const dao = new controlUser('EzWh.db');
const user_service = new UserService(dao);

describe("test service user", () => {
    beforeEach(async () => {
        await dao.dropContentUser();
    });

    testNewUser('john.snow@supplier.ezwh.com', 'John', 'Snow', 'ciao1234', "customer");
    testSuppliers('john.snow@supplier.ezwh.com', 'John', 'Snow', 'ciao1234', "customer");
    testCheckUser('john.snow@supplier.ezwh.com', 'John', 'Snow', 'ciao1234', "customer");
    testSession('john.snow@supplier.ezwh.com', 'John', 'Snow', 'ciao1234', "customer");
    testUserRight('john.snow@supplier.ezwh.com', 'John', 'Snow', 'ciao1234', "customer", "clerk");
    testDeleteUser('john.snow@supplier.ezwh.com', 'John', 'Snow', 'ciao1234', "customer", "clerk");




});

function testNewUser(username, name, surname, password, type) {

    test('create and retrive new User', async () => {
        const user = { username: username, name: name, surname: surname, password: password, type: type }
        await user_service.createUser(user);

        const res = await user_service.getUsers();
        const expectRes = {
            id: res[0].id,
            name: name,
            surname: surname,
            email: username,
            type: type
        }
        expect(res[0]).toEqual(expectRes);
    });

    test('create new User that already exist', async () => {
        const user = { username: username, name: name, surname: surname, password: password, type: type }
        await user_service.createUser(user);

        const user2 = { username: username, name: name, surname: surname, password: password, type: type }

        try {
            await user_service.createUser(user2);
        } catch (error) {
            expect(error).toEqual('user already exist');
        }

    });
}

function testSuppliers(username, name, surname, password, type) {

    test('get new supplier', async () => {
        const user = { username: username, name: name, surname: surname, password: password, type: 'supplier' }
        await user_service.createUser(user);

        const res = await user_service.getSuppliers();
        const expectRes = {
            id: res[0].id,
            name: name,
            surname: surname,
            email: username
        }
        expect(res[0]).toEqual(expectRes);
    });

    test('get supplier without supplier in db', async () => {
        const user = { username: username, name: name, surname: surname, password: password, type: 'customer' }
        await user_service.createUser(user);

        const res = await user_service.getSuppliers();
        expect(res.length).toEqual(0);

    });
}

function testCheckUser(username, name, surname, password, type) {

    test('check for newUser done', async () => {
        const user = { username: username, name: name, surname: surname, password: password, type: type }

        const res = await user_service.checkUser(user, 'newUser')
        expect(res).toEqual('done');
    });

    test('check for newUser bad', async () => {
        const user = { username: username, name: name, surname: surname, password: password, type: type }
        await user_service.createUser(user);

        try {
            await user_service.checkUser(user, 'newUser')
        } catch (error) {
            expect(error).toEqual('user already exist');
        }
        
       
    });

    test('check for update/del user done', async () => {
        const user = { username: username, name: name, surname: surname, password: password, type: type }
        await user_service.createUser(user);

        const res = await user_service.checkUser(user, 'upDel')
        expect(res).toEqual('done');
    });

    test('check for update/del user bad', async () => {
        const user = { username: username, name: name, surname: surname, password: password, type: type }
        

        try {
            await user_service.checkUser(user, 'upDel')
        } catch (error) {
            expect(error).toEqual('not found');
        }
        
       
    });
}

function testSession(username, name, surname, password, type) {

    test('do session with right credentials', async () => {
        const user = { username: username, name: name, surname: surname, password: password, type: type }
        await user_service.createUser(user);

        const session = {username: username, password: password};
        const info = await user_service.session(session, type);

        const expectRes = {
            id: info.id,
            username: username,
            name: name            
        }

        expect(info).toEqual(expectRes);
    });

    test('do session with credentials incorrect', async () => {
        const user = { username: username, name: name, surname: surname, password: password, type: type }
        await user_service.createUser(user);

        const session = {username: '', password: password};

        try {
            await user_service.session(session, type);
        } catch (error) {
            expect(error).toEqual('data error');
        }

    });
}

function testUserRight(username, name, surname, password, type, newType) {

    test('change user right', async () => {
        const user = {username: username, name: name, surname: surname, password: password, type: type}
        await user_service.createUser(user);
        
        const rights = {oldType: type, newType: newType};
        const res = await user_service.modifyUserRights(username, rights);

        expect(res).toEqual('done');

        const users = await user_service.getUsers();
        expect(users[0].type).toStrictEqual(newType);
    });
}

function testDeleteUser(username, name, surname, password, type) {

    test('delete user', async () => {
        const user = {username: username, name: name, surname: surname, password: password, type: type}
        await user_service.createUser(user);
        
        const res = await user_service.deleteUser(username, type);

        expect(res).toEqual('done');

        const users = await user_service.getUsers();
        expect(users.length).toEqual(0);
    });
}


