const controlOrder = require('../modules/controlOrder');
const controler = new controlOrder('EzWh.db');

describe('test restock order fn', () => {
    beforeEach(async () => {
        controler.dropTable();
    })

    test('retriving a new restock order', async () => { 
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 7
        }
        await controler.newTableRestockOrder();
        await controler.newRestockOrder(sentData);
        var res = controler.getRestockOrders();
        await expect(res).resolves.toEqual(
            [
                {
                id: 1,
                issueDate: '2021/11/29 09:33',
                state: null,
                products: [
                    {"SKUId":12,"description":"a product","price":10.99,"qty":30},
                    {"SKUId":180,"description":"another product","price":11.99,"qty":20}
                ],
                supplierID: 7,
                transportNote: null,
                skuItems: null
                }
            ]
        );
    });

    test('retriving a single order', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 8
        }
        await controler.newTableRestockOrder();
        await controler.newRestockOrder(sentData);
        var res = controler.getRestockOrder(1);
        await expect(res).resolves.toEqual(
            {
                issueDate: '2021/11/29 09:33',
                state: null,
                products: [
                    { SKUId: 12, description: 'a product', price: 10.99, qty: 30 },
                    {SKUId: 180, description: 'another product', price: 11.99, qty: 20}
                ],
                supplierId: 8,
                transportNote: null,
                skuItems: null
            }
        );
    });

    test('unexpected data format', async () => { 
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : "B"
        }
        await controler.newTableRestockOrder();
        try {
            await controler.newRestockOrder(sentData);
        } catch (error) {
            expect(error.code).toEqual(422);
        }
    });

    test('modify state of order', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 8
        }
        await controler.newTableRestockOrder();
        await controler.newRestockOrder(sentData);
        const newData = {
            "newState":"SOMETHING"
        }
        try {
            await controler.modifyRestockOrderState(1, newData.newState)
        } catch (error) {
            await expect(error.code).toEqual(500);
        }
    });

    test('add transport note', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 8
        }
        await controler.newTableRestockOrder();
        await controler.newRestockOrder(sentData);
        const newData = {
            "transportNote":{"deliveryDate":"2021/12/29"}
        }
        try {
            await controler.modifyRestockOrderNote(1, newData.transportNote)
        } catch (error) {
            await expect(error.code).toEqual(500);
        }
    });

    test('add SKUItems', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 8
        }
        await controler.newTableRestockOrder();
        await controler.newRestockOrder(sentData);
        const newData = {
            "skuItems" : [{"SKUId":12,"rfid":"12345678901234567890123456789016"},{"SKUId":12,"rfid":"12345678901234567890123456789017"}]
        }
        try {
            await controler.modifyRestockOrderSKUs(1, newData.skuItems)
        } catch (error) {
            await expect(error.code).toEqual(500);
        }
    });

});


describe('test internal order fn', () => {
    beforeEach(async () => {
        controler.dropTableInternalOrder();
    })

    test('modify a single order', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:20",
            "products": [],
            "customerId" : 6
        }
        await controler.newTableInternalOrder();
        await controler.newInternalOrder(sentData);
        const newData = {
            "newState":"COMPLETED",
            "products":[{"SkuID":1,"RFID":"12345678901234567890123456789016"},{"SkuID":1,"RFID":"12345678901234567890123456789038"}]
        }
        await controler.modifyInternalOrder(1, newData.newState, newData.products)
        var res = controler.getInternalOrder(1);
        await expect(res).resolves.toEqual(
            {
                "id":1,
                "issueDate":"2021/11/29 09:20",
                "state": "COMPLETED",
                "products": [{"SkuID":1,"RFID":"12345678901234567890123456789016"},
                {"SkuID":1,"RFID":"12345678901234567890123456789038"}],
                "customerId" : 6
            }
        );
    });

});

describe('test return order fn', () => {
    beforeEach(async () => {
        controler.dropTableReturnOrder();
    })

    test('get a new order', async () => {
        const sentData = {
            "returnDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                        {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            "restockOrderId" : 1
        }
        await controler.newTableReturnOrder();
        await controler.newReturnOrder(sentData);
        var res = controler.getReturnOrder(1);
        await expect(res).resolves.toEqual(
            {
                "id":1,
                "returnDate":"2021/11/29 09:33",
                "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                            {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
                "restockOrderId" : 1
            }
        );
    });

});