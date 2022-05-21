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
            "supplierId" : 1
        }
        await controler.newTableRestockOrder();
        await controler.newRestockOrder(sentData);
        var res = controler.getRestockOrders();
        await expect(res).resolves.toEqual([
            {
                "issueDate": "2021/11/29 09:33",
                "id": 1,
                "supplierID":1,
                "state":null,
                "issueDate": " 2021/11/29 09:11",
                "transportNote":null,
                "skuItems":null,
                "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
                {"SKUId":180,"description":"another product","price":11.99,"qty":20}]
            }
        ]);
    });

    test('retriving a single order', async () => {
        const sentData = {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 1
        }
        await controler.newTableRestockOrder();
        await controler.newRestockOrder(sentData);
        var res = controler.getRestockOrder(1);
        await expect(res).resolves.toEqual(
            {
                issueDate: ' 2021/11/29 09:11',
                state: null,
                products: [
                    { SKUId: 12, description: 'a product', price: 10.99, qty: 30 },
                    {SKUId: 180, description: 'another product', price: 11.99, qty: 20}
                    ],
                    supplierId: 1,
                    transportNote: null,
                    skuItems: null
            }
        );
    });

    test('unexpected data format', async () => { 
        const sentData = {
            "issueDate":"yesterday",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
            {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : "B"
        }
        await controler.newTableRestockOrder();
        try {
            await controler.newRestockOrder(sentData);
        } catch (error) {
            expect(error).toEqual({error: "Invalid date!"});
        }
    });


});