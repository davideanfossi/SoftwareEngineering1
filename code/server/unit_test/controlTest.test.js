const testService = require('../services/test_service');
const controlTest = require('../modules/controlTest');

const controller = new controlTest('EzWh.db');
const test_service = new testService(controller);


// testDescriptors tests

const testDescriptor1 = {
    id:1,
    name:"test descriptor 1",
    procedureDescription: "This test is described by...",
    idSKU:1
};

const testDescriptor2 = {
    id:2,
    name:"test descriptor 2",
    procedureDescription: "This test is described by...",
    idSKU:2
};

describe("get testDescriptor", () => {
    beforeEach(async () => {
        await controller.dropTableTestDescriptors();
        await controller.newTableTestDescriptor();
        await test_service.createTestDescriptor({    
            name:"test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU:1
        });
        await test_service.createTestDescriptor({
            name:"test descriptor 2",
            procedureDescription: "This test is described by...",
            idSKU:2
        });
    });

    testTestDescriptor(testDescriptor1);                         
    testTestDescriptor(testDescriptor2);                                 
});

async function testTestDescriptor(testDescriptor) {
    test('get testDescriptor', async () => {
        let res = await test_service.getTestDescriptor(testDescriptor.id);
        expect(res[0]).toEqual({
            id: testDescriptor.id,
            name: testDescriptor.name,
            procedureDescription: testDescriptor.procedureDescription,
            idSKU: testDescriptor.idSKU
        });
    });
}

describe("create testDescriptor", () => {
    beforeEach(async () => {
        await controller.dropTableTestDescriptors();
        await controller.newTableTestDescriptor();
    })
    describe("create testDescriptor data", () => {
        test('testDescriptor', async () => {                                        
            const testDescriptor = {
                name:"test descriptor 1",
                procedureDescription: "This test is described by...",
                idSKU: 2
            }

            let res = await test_service.createTestDescriptor(testDescriptor);
            res = await test_service.getTestDescriptor(1);
            expect(res[0]).toEqual({
                id: 1,
                name: testDescriptor.name,
                procedureDescription: testDescriptor.procedureDescription,
                idSKU: testDescriptor.idSKU
            });
        })

        
        test('testDescriptor no sku associated idSKU', async () => {                                           // test 5
            const testDescriptor = {
                name:"test descriptor 3",
                procedureDescription: "This test is described by...",
                idSKU:3
            }
            try{    
                let res = await test_service.createTestDescriptor(testDescriptor);
            }
            catch(err){
                expect(err).toEqual("no sku associated idSKU");
            }
        })
        
    });
});

describe("modify testDescriptor", () => {
    beforeEach(async () => {
        await controller.dropTableTestDescriptors();
        await controller.newTableTestDescriptor();
        await test_service.createTestDescriptor(testDescriptor1);
    })

    describe("modify testDescriptor data with success", () => {
        test('testDescriptor', async () => {                                      
            const newTestDescriptor = {
                newName:"new test descriptor",
                newProcedureDescription: "This test is described by...",
                newIdSKU:2
            }

            let res = await test_service.modifyTestDescriptor(1, newTestDescriptor);
            res = await test_service.getTestDescriptor(1);
            
            expect(res[0]).toEqual({
                id: 1,
                name: newTestDescriptor.newName,
                procedureDescription: newTestDescriptor.newProcedureDescription,
                idSKU: newTestDescriptor.newIdSKU
            });
        })

        test('testDescriptor no test descriptor associated id or no sku associated to IDSku', async () => {                                           // test 5
            const newTestDescriptor = {
                newName:"new test descriptor",
                newProcedureDescription: "This test is described by...",
                newIdSKU:2
            }

            try{    
                let res = await test_service.modifyTestDescriptor(2, newTestDescriptor);
            }
            catch(err){
                expect(err).toEqual("no test descriptor associated id or no sku associated to IDSku");
            }
        })
    });
});
