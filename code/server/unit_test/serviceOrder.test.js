const controlOrder = require('../modules/controlOrder');
const serviceOrder = require('../services/order_service');
const controler = new controlOrder('EzWh.db');
const service = new serviceOrder(controler);

describe('test restock order services', () => {
    
    beforeEach(async () => {
        await controler.dropTable();
        await service.newTableRestockOrder();
    });

    test('create an order', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 7
        }
        await service.newRestockOrder(sentData);
        let res = await service.getRestockOrder(1);
        const retOrders = [
            {"id": 1, 
            "issueDate": "2021/11/29 09:33", 
            "products": [
                {"SKUId": 12, "description": "a product", "price": 10.99, "qty": 30}, 
                {"SKUId": 180, "description": "another product", "price": 11.99, "qty": 20}
            ], 
            "skuItems": null, 
            "state": null, 
            "supplierID": 7, 
            "transportNote": null}
        ]
        expect(res).toEqual(retOrders);
        res = await service.getRestockOrders()
        expect(res).toEqual(retOrders);
    });

    test('delete an order', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 7
        }
        await service.newRestockOrder(sentData);
        await service.deleteRestockOrder(1);
        let res = await service.getRestockOrders()
        expect(res).toEqual([]);
    });

    test('fail to cerate an order', async () => {
        const sentData = '';

        try {
            await service.newRestockOrder(sentData);
        } catch (error) {
            expect(error.code).toEqual(422);
        }
    });

    test('modify state of an order', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 7
        }
        await service.newRestockOrder(sentData);
        const newState = {
            "newState":"ISSUED"
        }
        await service.modifyRestockOrderState(1, newState);
        const retOrders = [
            {"id": 1, 
            "issueDate": "2021/11/29 09:33", 
            "products": [
                {"SKUId": 12, "description": "a product", "price": 10.99, "qty": 30}, 
                {"SKUId": 180, "description": "another product", "price": 11.99, "qty": 20}
            ], 
            "skuItems": null, 
            "state": 'ISSUED', 
            "supplierID": 7, 
            "transportNote": null}
        ]
        res = await service.getIssuedRestockOrders()
        expect(res).toEqual(retOrders);
    });

    test('fail to modify an order by its ID', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 7
        }
        await service.newRestockOrder(sentData);
        const newState = {
            "state":"COMPLETED"
        }
        try {
            await service.modifyRestockOrderSKUs(9, newState.state);
        } catch (error) {
            expect(error.code).toEqual(422);
        }
    });

    test('retrive de SKUs and try wrong ID', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 7
        }
        await service.newRestockOrder(sentData);
        const newSKU = {
            "skuItems" : [{"SKUId":12,"rfid":"12345678901234567890123456789016"},
                {"SKUId":12,"rfid":"12345678901234567890123456789017"}]
        }
        await service.modifyRestockOrderSKUs(1, newSKU);
        await service.modifyRestockOrderState(1,{'newState':'DELIVERED'})
        const res = await service.getSkuItemsByRestockOrder(1);
        expect(res).toEqual(newSKU.skuItems)
    });

    test('try to modify note with wrong ID', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 7
        }
        await service.newRestockOrder(sentData);
        try {
            res = await service.modifyRestockOrderNote('B',{"transportNote":{"deliveryDate":"2021/12/29"}});
        } catch (error) {
            expect(error.code).toEqual(422)    
        }
    });

});