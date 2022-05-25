const controlOrder = require('../modules/controlOrder');
const controlUser = require('../modules/controlUser')
const serviceOrder = require('../services/order_service');
const serviceUser = require('../services/user_service')
const controler = new controlOrder('EzWh.db');
const userControler = new controlUser('EzWh.db');
const service = new serviceOrder(controler);
const userService = new serviceUser(userControler);

describe('test restock order services', () => {
    
    beforeEach(async () => {
        await controler.dropTable();
        await service.newTableRestockOrder();

        await userService.deleteAll();
        await userService.dropSequence();
        let user = { username: 'john.snow@supplier.ezwh.com', name: 'John', surname: 'Snow', password: 'password', type: 'supplier' }
        await userService.createUser(user);
    });

    test('create a restock order', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 1
        }
        await service.newRestockOrder(sentData);
        let res = await service.getRestockOrder(1);
        expect(res.id).toEqual(1);
        expect(res.issueDate).toEqual("2021/11/29 09:33");
    });

    test('send wrong supplierId to create an restock order', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 9
        }
        try {
            await service.newRestockOrder(sentData);
        } catch (error) {
            expect(error.code).toEqual(404);
        }
        
    });

    test('get one restock order', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 1    
        }
        await service.newRestockOrder(sentData);
        let res = await service.getRestockOrder(1);
        expect(res.id).toEqual(1);
        expect(res.issueDate).toEqual("2021/11/29 09:33");
        
    });

    test('fail to pass id to get one restock order', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 1    
        }
        await service.newRestockOrder(sentData);
        try {
            await service.getRestockOrder(123);
        } catch (error) {
            expect(error.code).toEqual(404);
        }
        
    });

    test('update restock order state', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 1    
        }
        await service.newRestockOrder(sentData);
        await service.modifyRestockOrderState(1, {"newState":"ISSUED"});
        const res = await service.getRestockOrder(1);
        expect(res.state).toEqual('ISSUED');
    });

    test('try to update restock order state with non valid value', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 1    
        }
        await service.newRestockOrder(sentData);
        try {
            await service.modifyRestockOrderState(1, {"newState":"SOMETHING NON VALID"});
        } catch (error) {
            expect(error.code).toEqual(422);
        }
    });

    test('update restock order sku items', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [],
            "supplierId" : 1    
        }
        await service.newRestockOrder(sentData);
        await service.modifyRestockOrderState(1, {'newState':'DELIVERED'})
        const newItems = {
            "skuItems" : [{"SKUId":12,"rfid":"12345678901234567890123456789016"},
            {"SKUId":12,"rfid":"12345678901234567890123456789017"}]
        }
        await service.modifyRestockOrderSKUs(1, newItems);
        const res = await service.getRestockOrder(1);
        expect(res.skuItems).toEqual(newItems.skuItems);
    });

    test('update restock order with non delivered state', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [],
            "supplierId" : 1    
        }
        await service.newRestockOrder(sentData);
        const newItems = {
            "skuItems" : [{"SKUId":12,"rfid":"12345678901234567890123456789016"},
            {"SKUId":12,"rfid":"12345678901234567890123456789017"}]
        }
        try {
            await service.modifyRestockOrderSKUs(1, newItems);
        } catch (error) {
            expect(error.code).toEqual(422);
        }
    });

    test('update restock order note', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [],
            "supplierId" : 1    
        }
        await service.newRestockOrder(sentData);
        await service.modifyRestockOrderState(1, {'newState':'DELIVERED'})
        const newItems = {
            "skuItems" : [{"SKUId":12,"rfid":"12345678901234567890123456789016"},
            {"SKUId":12,"rfid":"12345678901234567890123456789017"}]
        }
        await service.modifyRestockOrderSKUs(1, newItems);
        const res = await service.getRestockOrder(1);
        expect(res.skuItems).toEqual(newItems.skuItems);
    });

});

describe('test return order services', () => {
    
    beforeEach(async () => {
        await controler.dropTable();
        await service.newTableRestockOrder();

        await controler.dropTableReturnOrder();
        await service.newTableReturnOrder();

        await userService.deleteAll();
        await userService.dropSequence();
        let user = { username: 'john.snow@supplier.ezwh.com', name: 'John', surname: 'Snow', password: 'password', type: 'supplier' }
        await userService.createUser(user);

        const products = [{"SKUId":12,"description":"a product","price":10.99,"qty":30}, {"SKUId":180,"description":"another product","price":11.99,"qty":20}]
        let restockOrder = {"issueDate":"2021/11/29 09:33", "products":products, "supplierId":1}
        await service.newRestockOrder(restockOrder)
    });

    test('create a return order', async () => {
        const sentData = {
            "returnDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99, "RFID":"12345678901234567890123456789016"},
                        {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            "restockOrderId" : 1
        }
        await service.newReturnOrder(sentData);
        let res = await service.getReturnOrder(1);
        expect(res.id).toEqual(1);
        expect(res.returnDate).toEqual("2021/11/29 09:33");
    });
});

describe('test internal order services', () => {
    
    beforeEach(async () => {
        await controler.dropTableInternalOrder();
        await service.newTableInternalOrder();

        await userService.deleteAll();
        await userService.dropSequence();
        let user = { username: 'john.snow@supplier.ezwh.com', name: 'John', surname: 'Snow', password: 'password', type: 'customer' }
        await userService.createUser(user);
    });

    test('create a internal order', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
                        {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
            "customerId" : 1
        }
        await service.newInternalOrder(sentData);
        let res = await service.getInternalOrder(1);
        expect(res.id).toEqual(1);
        expect(res.issueDate).toEqual("2021/11/29 09:33");
    });

    test('update an internal order with state and products', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [],
            "customerId" : 1
        }
        await service.newInternalOrder(sentData);
        const newData = {
            "newState":"COMPLETED",
            "products":[{"SkuID":1,"RFID":"12345678901234567890123456789016"},{"SkuID":1,"RFID":"12345678901234567890123456789038"}]
        }
        await service.modifyInternalOrder(1, newData)
        let res = await service.getInternalOrder(1);
        expect(res.id).toEqual(1);
        expect(res.state).toEqual(newData.newState);
    });

    test('fail update an internal order with non valid state', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [],
            "customerId" : 1
        }
        await service.newInternalOrder(sentData);
        const newData = {
            "newState":"SOMETHING",
            "products":[{"SkuID":1,"RFID":"12345678901234567890123456789016"},{"SkuID":1,"RFID":"12345678901234567890123456789038"}]
        }
        try {
            await service.modifyInternalOrder(1, newData)
        } catch (error) {
            expect(error.code).toEqual(422);
        }
    });
});