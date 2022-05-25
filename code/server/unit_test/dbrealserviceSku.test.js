const skuService = require('../services/sku_service');
const controlSKU = require('../modules/controlSku');
const controlTest = require('../modules/controlTest');
const controller = new controlSKU('EzWh.db');
const controller2 = new controlTest('EzWh.db');
const sku_service = new skuService(controller);

// sku tests

const SKU = {
    description : "first sku",
    weight : 101,
    volume : 60,
    notes : "first SKU",
    availableQuantity : 55,
    price : 10.99,
}

const newSKU = {
    newDescription: "a new sku",
    newWeight: 200,
    newVolume: 20,
    newNotes: "new SKU",
    newPrice: 50.99,
    newAvailableQuantity: 5
}

const position = {
    positionID:"800234543412",
    aisleID: "8002",
    row: "3454",
    col: "3412",
    maxWeight: 1000,
    maxVolume: 1000,
}

const startup = async () => {
    await controller.dropPositionTable();
    await controller.newTablePosition();
    await controller.createPosition(position);
    await controller2.dropTableTestResult(); 
    await controller2.dropTableTestDescriptors();
    await controller2.newTableTestDescriptor();
    await controller.dropSKUItemTable();
    await controller.newTableSKUItem();
    await controller.newTableItem();
    await controller.dropItemTable();
    await controller.dropSKUTable();
    await controller.newTableSku();
}

describe("get SKUs", () => {
    beforeEach(async () => {
        await startup();
        await sku_service.createSku(SKU);
    });

    test('get SKUs', async () => {
        let res = await sku_service.getSkus();
        
        expect(res[0]).toEqual({
            id: 1,
            description : SKU.description,
            weight : SKU.weight,
            volume : SKU.volume,
            notes : SKU.notes,
            position : null,
            availableQuantity : SKU.availableQuantity,
            price : SKU.price,
            testDescriptors: [null]
        });
    });                     
});

describe("get SKU", () => {
    beforeEach(async () => {
        await startup();
        await sku_service.createSku(SKU);
    });

    test('get SKU', async () => {
        let res = await sku_service.getSku(1);
        
        expect(res[0]).toEqual({
            id: 1,
            description : SKU.description,
            weight : SKU.weight,
            volume : SKU.volume,
            notes : SKU.notes,
            position : null,
            availableQuantity : SKU.availableQuantity,
            price : SKU.price,
            testDescriptors: [null]
        });
    });                     
});

describe("create SKU", () => {
    beforeEach(async () => {
        await startup();
    });

    test('create SKU', async () => {
        await sku_service.createSku(SKU);
        let res = await sku_service.getSku(1);
        
        expect(res[0]).toEqual({
            id: 1,
            description : SKU.description,
            weight : SKU.weight,
            volume : SKU.volume,
            notes : SKU.notes,
            position : null,
            availableQuantity : SKU.availableQuantity,
            price : SKU.price,
            testDescriptors: [null]
        });
    });     
});

describe("modify SKU", () => {
    beforeEach(async () => {
        await startup();
        await sku_service.createSku(SKU);
    });

    test('modify SKU', async () => {
        await sku_service.modifySku(1, newSKU);
        let res = await sku_service.getSku(1);
        
        expect(res[0]).toEqual({
            id: 1,
            description : newSKU.newDescription,
            weight : newSKU.newWeight,
            volume : newSKU.newVolume,
            notes : newSKU.newNotes,
            position : null,
            availableQuantity : newSKU.newAvailableQuantity,
            price : newSKU.newPrice,
            testDescriptors: [null]
        });
    });     

    test('modify SKU with wrong id', async () => {
        try {
            await sku_service.modifySku(2, newSKU);
        } catch (err) {
            expect(err).toEqual("not found");
        }
    }); 
});

describe("modify SKU position", () => {
    beforeEach(async () => {
        await startup();
        await sku_service.createSku(SKU);
    });

    test('modify SKU position', async () => {
        await sku_service.modifySkuPositon(1, {position: position.positionID});
        let res = await sku_service.getSku(1);
        
        expect(res[0]).toEqual({
            id: 1,
            description : SKU.description,
            weight : SKU.weight,
            volume : SKU.volume,
            notes : SKU.notes,
            position : position.positionID,
            availableQuantity : SKU.availableQuantity,
            price : SKU.price,
            testDescriptors: [null]
        });
    });     

    test('modify SKU with wrong id', async () => {
        try {
            await sku_service.modifySku(2, newSKU);
        } catch (err) {
            expect(err).toEqual("not found");
        }
    }); 
});

describe("delete SKU", () => {
    beforeEach(async () => {
        await startup();
        await sku_service.createSku(SKU);
    });

    test('delete SKU', async () => {
        await sku_service.deleteSku(1);   
        let res = await sku_service.getSkus();
        
        expect(res.length).toEqual(0);
    });     
});


  
// SKUItem tests

const SKUItem1post = {                                           
    RFID:"12345678901234567890123456789015",
    SKUId:1,
    DateOfStock:"2021/11/29 12:30"
}

const SKUItem1get = {                                           
    RFID:"12345678901234567890123456789014",
    SKUId:1,
    Available:0,
    DateOfStock:"2021/11/29 12:30"
}

const SKUItem2get = {                                           
    RFID:"12345678901234567890123456789015",
    SKUId:2,
    Available:0,
    DateOfStock:"2021/11/29 12:35"
}

const SKU1 ={
    description : "another sku",
    weight : 101,
    volume : 60,
    notes : "second SKU",
    availableQuantity : 55,
    price : 10.99,
}

const SKU2 ={
    description : "another sku",
    weight : 101,
    volume : 60,
    notes : "second SKU",
    availableQuantity : 55,
    price : 10.99,
}


describe("get SKUItem", () => {
    beforeEach(async () => {
        await controller.newTableSKUItem();
        await controller.deleteAllItem();
        await controller.deleteAllSKUItem();
        await controller.dropSKUTable();
        await controller.newTableSku();
        await controller.createSku(SKU1);
        await controller.createSku(SKU2);
        await controller.createSKUItem({    
            RFID:"12345678901234567890123456789014",
            SKUId:1,
            DateOfStock:"2021/11/29 12:30"
        });
        await controller.createSKUItem({
            RFID:"12345678901234567890123456789015",
            SKUId:2,
            DateOfStock:"2021/11/29 12:35"
        });
    });

    testSKUItem(SKUItem1get);                                  // test 1
    testSKUItem(SKUItem2get);                                  // test 2
    // testSKUItem({                                        // -> this test will fail
    //     RFID:"12345678901234567890123999789015",
    //     SKUId:9,
    //     Available:1,
    //     DateOfStock:"2021/11/29 12:35"
    // });

});

async function testSKUItem(SKUItem) {
    test('get SKUItem', async () => {
        let res = await sku_service.getSKUItem(SKUItem.RFID);
        
        expect(res[0]).toEqual({
            RFID: SKUItem.RFID,
            SKUId: SKUItem.SKUId,
            Available: SKUItem.Available,
            DateOfStock: SKUItem.DateOfStock
        });
    });
}


describe("modify SKUItems", () => {
    beforeEach(async () => {
        await controller.deleteAllSKUItem();
        await controller.deleteAllItem();
        await controller.dropSKUTable();
        await controller.newTableSku();
        await controller.createSku(SKU1);
        await controller.createSku(SKU2);
        await controller.createSKUItem(SKUItem1post);
    })
    describe("modify SKUItem data with success", () => {
        test('SKUItem', async () => {                                       // test 3
            const newSKUItemdata = {
                newRFID:"12345678901234567890123456789015",
                newAvailable:1,
                newDateOfStock:"2021/11/29 12:40"
            }

            let res = await sku_service.modifySKUItem(SKUItem1post.RFID, newSKUItemdata);
            res = await sku_service.getSKUItem(SKUItem1post.RFID);
            
            expect(res[0]).toEqual({
                    RFID: newSKUItemdata.newRFID,
                    SKUId: SKUItem1post.SKUId,
                    Available: newSKUItemdata.newAvailable,
                    DateOfStock: newSKUItemdata.newDateOfStock
            });
        })
    });
});

describe("create SKUItems", () => {
    beforeEach(async () => {
        await controller.deleteAllSKUItem();
        await controller.deleteAllItem();
        await controller.dropSKUTable();
        await controller.newTableSku();
        await controller.createSku(SKU1); 
        await controller.createSku(SKU2);
    })
    describe("create SKUItem data", () => {
        test('SKUItem', async () => {                                           // test 4
            const SKUItem = {
                RFID: "12345678901234567890123456789014",
                SKUId: 1,
                DateOfStock: "2021/11/29 12:30"
            }

            let res = await sku_service.createSKUItem(SKUItem);
            res = await sku_service.getSKUItem(SKUItem1get.RFID);
            expect(res[0]).toEqual({
                    RFID: SKUItem1get.RFID,
                    SKUId: SKUItem1get.SKUId,
                    Available: SKUItem1get.Available,
                    DateOfStock: SKUItem1get.DateOfStock
            });
        })

        test('SKUItem with 404', async () => {                                           // test 5
            const SKUItem = {
                RFID: "12345678901234567890123456789014",
                SKUId: 1,
                DateOfStock: "20212222/11/29 12:30"
            }
            try{    
                let res = await sku_service.createSKUItem(SKUItem);
            }
            catch(err){
                expect(err.code).toEqual(422)
            }
        })
    });
});

describe("get SKUItemAvailable", () => {
    beforeEach(async () => {
        await controller.deleteAllSKUItem();
        await controller.deleteAllItem();
        await controller.dropSKUTable();
        await controller.newTableSku();
        await controller.createSku(SKU1);
        await controller.createSku(SKU2);

    })
    test('test SKUItem passed', async () => {                                                  
        const newSKUItemdata = {
            newRFID:"12345678901234567890123456789015",
            newAvailable: 1,
            newDateOfStock:"2021/11/29 12:40"
        } 
        await controller.createSKUItem(SKUItem1post);
        let res = await sku_service.modifySKUItem(SKUItem1post.RFID, newSKUItemdata);
        res = await sku_service.getSKUItemsAvailable(parseInt(SKUItem1post.SKUId));
        expect(res[0]).toEqual({
                RFID: newSKUItemdata.newRFID,
                SKUId: SKUItem1post.SKUId,
                Available: newSKUItemdata.newAvailable,
                DateOfStock: newSKUItemdata.newDateOfStock
        });
    })
});

// Position tests


const Position1post = {                                           
    "positionID":"800234543412",
    "aisleID": "8002",
    "row": "3454",
    "col": "3412",
    "maxWeight": 1000,
    "maxVolume": 1000
}

const Position1get = {                                           
    "positionID":"800234543412",
    "aisleID": "8002",
    "row": "3454",
    "col": "3412",
    "maxWeight": 1000,
    "maxVolume": 1000,
    "occupiedWeight": 0,
    "occupiedVolume":0
}

const Position2get = {                                           
    "positionID":"99234543433",
    "aisleID": "9902",
    "row": "3454",
    "col": "3433",
    "maxWeight": 500,
    "maxVolume": 600,
    "occupiedWeight": 0,
    "occupiedVolume":0
}


describe("get Position", () => {
    beforeEach(async () => {
        await controller.newTablePosition();
        await controller.deleteAllPosition();
        await controller.createPosition({    
            "positionID":"800234543412",
            "aisleID": "8002",
            "row": "3454",
            "col": "3412",
            "maxWeight": 1000,
            "maxVolume": 1000,
        });
    //     await controller.createPosition({
    //         "positionID":"99234543433",
    //         "aisleID": "9902",
    //         "row": "3454",
    //         "col": "3433",
    //         "maxWeight": 500,
    //         "maxVolume": 600,
    //     });
    });

    testPosition(Position1get);                                  
    // testPosition(Position2get);                               


});

async function testPosition(Position) {
    test('get Position', async () => {
        let res = await sku_service.getPositions();
        expect(res[0]).toEqual({
            positionID: Position.positionID,
            aisleID: Position.aisleID,
            row: Position.row,
            col: Position.col,
            maxWeight: Position.maxWeight,
            maxVolume: Position.maxVolume,
            occupiedWeight: 0,
            occupiedVolume: 0
        });
    });
}

describe("modify Positions", () => {
    beforeEach(async () => {
        await controller.deleteAllPosition();
    })
    test('Positions modification success', async () => {                                       
        const newPositiondata = {
            newAisleID: "8002",
            newRow: "3554",
            newCol: "3412",
            newMaxWeight: 1200,
            newMaxVolume: 600,
            newOccupiedWeight: 200,
            newOccupiedVolume: 100
        }
        await controller.createPosition(Position1post);
        let res = await sku_service.modifyPosition(Position1post.positionID, newPositiondata);
        res = await sku_service.getPositions();
        expect(res[0]).toEqual({
            positionID: newPositiondata.newAisleID.concat(newPositiondata.newRow, newPositiondata.newCol),
            aisleID: newPositiondata.newAisleID,
            row: newPositiondata.newRow,
            col: newPositiondata.newCol,
            maxWeight: newPositiondata.newMaxWeight,
            maxVolume: newPositiondata.newMaxVolume,
            occupiedWeight: newPositiondata.newOccupiedWeight,
            occupiedVolume: newPositiondata.newOccupiedVolume
        });
    })
    test('Positions modification error (newOccupiedWeight > newMaxWeight)', async () => {                                       
        const newPositiondata = {
            newAisleID: "8002",
            newRow: "3554",
            newCol: "3412",
            newMaxWeight: 1200,
            newMaxVolume: 600,
            newOccupiedWeight: 1300,
            newOccupiedVolume: 100
        }
        try{ 
            await controller.createPosition(Position1post);   
            let res = await sku_service.modifyPosition(Position1post.positionID, newPositiondata);
            res = await sku_service.getPositions();
        }
        catch(err){
            expect(err.code).toEqual(422);
            expect(err.error).toEqual('newOccupiedWeight larger then newMaxWeight');
        }
    })
    test('Positions modification error (not only digits in newRow)', async () => {                                       
        const newPositiondata = {
            newAisleID: "8002",
            newRow: "3y54",
            newCol: "3412",
            newMaxWeight: 1200,
            newMaxVolume: 600,
            newOccupiedWeight: 200,
            newOccupiedVolume: 100
        }
        try{    
            await controller.createPosition(Position1post);
            let res = await sku_service.modifyPosition(Position1post.positionID, newPositiondata);
            res = await sku_service.getPositions();
        }
        catch(err){
            expect(err.code).toEqual(422);
            expect(err.error).toEqual('Invalid newRow format');
        }
    })
});

describe("create Positions", () => {
    beforeEach(async () => {
        await sku_service.deleteAllPosition();
    })
    test('Position with success', async () => {                                           
        const Position = {
            positionID:"800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        }

        let res = await sku_service.createPosition(Position);
        res = await sku_service.getPositions();
        expect(res[0]).toEqual({
            positionID: Position.positionID,
            aisleID: Position.aisleID,
            row: Position.row,
            col: Position.col,
            maxWeight: Position.maxWeight,
            maxVolume: Position.maxVolume,
            occupiedWeight: 0,
            occupiedVolume: 0
        });
    })
    test('Postion with 422 (not derived error)', async () => {                                           
        const Position = {
            positionID:"800234543412",
            aisleID: "8003",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        }
        try{    
            let res = await sku_service.createPosition(Position);
        }
        catch(err){
            expect(err.code).toEqual(422);
            expect(err.error).toEqual('positionID is not derived from aisleID, row and col');
        }  
    })
    test('Postion with 422 (wrong aisleid length)', async () => {                                           
        const Position = {
            positionID:"800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: -2
        }
        try{    
            let res = await sku_service.createPosition(Position);
        }
        catch(err){
            expect(err.code).toEqual(422);
            expect(err.error).toEqual('Invalid maxVolume');
        }
    
    })
});

describe("modify Positions ID", () => {
    beforeEach(async () => {
        await controller.deleteAllPosition();
    })
    test('PositionID modification success', async () => {                                       
        const newPositioIDndata = {
            newPositionID: "999966663333"
        }
        await controller.createPosition(Position1post);
        // console.log(await sku_service.getPositions());
        let res = await sku_service.modifyPositionID(Position1post.positionID, newPositioIDndata.newPositionID);
        // console.log(await sku_service.getPositions());
        res = await sku_service.getPositions();
        expect(res[0]).toEqual({
            positionID: newPositioIDndata.newPositionID,
            aisleID: newPositioIDndata.newPositionID.slice(0, 4),
            row: newPositioIDndata.newPositionID.slice(4, 8),
            col: newPositioIDndata.newPositionID.slice(8, 12),
            maxWeight: Position1post.maxWeight,
            maxVolume: Position1post.maxVolume,
            occupiedWeight: 0,
            occupiedVolume: 0
        });
    });
    test('PositionID modification error (not only digits)', async () => {                                       
        const newPositioIDndata = {
            newPositionID: "99996666333t"
        }
        try{    
            await controller.createPosition(Position1post);
            let res = await sku_service.modifyPositionID(Position1post.positionID, newPositioIDndata.newPositionID);
            res = await sku_service.getPositions();
        }
        catch(err){
            expect(err.code).toEqual(422);
            expect(err.error).toEqual('Invalid newPositionID format');
        }
    });
    test('PositionID modification error (not only digits in old position)', async () => {                                       
        const newPositioIDndata = {
            newPositionID: "999966663333"
        }
        const positionID = "8002345434177"
        try{    
            await controller.createPosition(Position1post);
            let res = await sku_service.modifyPositionID(positionID, newPositioIDndata.newPositionID);
            res = await sku_service.getPositions();
        }
        catch(err){
            expect(err.code).toEqual(422);
            expect(err.error).toEqual('Invalid positionID length');
        }
    });
});

// Item tests

const Item1 = {                                           
    id : 12,
    description : "a new item",
    price : 10,
    SKUId : 1,
    supplierId : 2
}

const Item2 = {                                           
    id: 2,
    description : "another item",
    price : 12.99,
    SKUId : 2,
    supplierId : 1
}


describe("get Item", () => {
    beforeEach(async () => {
        await controller.newTableItem();
        await controller.deleteAllSKUItem();
        await controller.deleteAllItem();
        await controller.dropSKUTable();
        await controller.newTableSku();
        await controller.createSku(SKU1);
        await controller.createSku(SKU2);
        await controller.createItem({    
            id : 12,
            description : "a new item",
            price : 10,
            SKUId : 1,
            supplierId : 2
        });
        await controller.createItem({
            id: 2,
            description : "another item",
            price : 12.99,
            SKUId : 2,
            supplierId : 1
        });
    });

    testItem(Item1);                                  
    testItem(Item2);                                  


});

async function testItem(Item) {
    test('get Item', async () => {
        let res = await sku_service.getItem(Item.id);
        expect(res[0]).toEqual({
            id: Item.id,
            description : Item.description,
            price : Item.price,
            SKUId : Item.SKUId,
            supplierId : Item.supplierId
        });
    });
}

describe("modify Items", () => {
    beforeEach(async() => {
        await controller.deleteAllSKUItem();
        await controller.deleteAllItem();
        await controller.dropSKUTable();
        await controller.newTableSku();
        await controller.createSku(SKU1);
        await controller.createSku(SKU2);
    })
    test('modify Item data with success', async () => {                                       // test 3
        const newSKUItemdata = {
            newDescription : "a new sku",
            newPrice : 10.99
        }
        await controller.createItem(Item1);
        let res = await sku_service.modifyItem(Item1.id, newSKUItemdata);
        res = await sku_service.getItem(Item1.id);
        
        expect(res[0]).toEqual({
            id : Item1.id,
            description : newSKUItemdata.newDescription,
            price : newSKUItemdata.newPrice,
            SKUId : Item1.SKUId,
            supplierId : Item1.supplierId
        });
    });
    test('modify Item data with error (new price negative)', async () => {                                       // test 3
        const newSKUItemdata = {
            newDescription : "a new sku",
            newPrice : -10.99
        }
        try{    
            await controller.createItem(Item1);
            let res = await sku_service.modifyItem(Item1.id, newSKUItemdata);
            res = await sku_service.getItem(Item1.id);
        }
        catch(err){
            expect(err.code).toEqual(422);
            expect(err.error).toEqual('Invalid newPrice');
        }
    });
});

describe("delete Items", () => {
    beforeEach(async () => {
        await controller.deleteAllSKUItem();
        await controller.deleteAllItem();
        await controller.dropSKUTable();
        await controller.newTableSku();
        await controller.createSku(SKU1);
        await controller.createSku(SKU2);
    })
    test('delete Item empty', async () => {                                          
        let res = await sku_service.createItem(Item2);
        await sku_service.deleteItem(Item2.id);
        res = await sku_service.getItems();
        expect(res.length).toEqual(0);
    })
    test('delete Item with 404 error', async () => {                                          
        try{    
            let res = await sku_service.createItem(Item2);
            await sku_service.deleteItem(Item2.id);
            res = await sku_service.getItem(Item2.id);
        }
        catch(err){
            expect(err.code).toEqual(404);
            expect(err.error).toEqual('no Item found');
        }
    })
});
