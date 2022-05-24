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
        await controller.createTestDescriptor({    
            name:"test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU:1
        });
        await controller.createTestDescriptor({
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

describe("modify testDescriptor", () => {
    beforeEach(async () => {
        await controller.dropTableTestDescriptors();
        await controller.newTableTestDescriptor();
        await controller.createTestDescriptor(testDescriptor1);
    })

    describe("modify testDescriptor data with success", () => {
        test('testDescriptor', async () => {                                      
            const newTestDescriptor = {
                newName:"new test descriptor",
                newProcedureDescription: "This test is described by...",
                newIdSKU:2
            }

            let res = await test_service.modifyTestDescriptor(testDescriptor1.id, newTestDescriptor);
            res = await test_service.getTestDescriptor(testDescriptor1.id);
            
            expect(res[0]).toEqual({
                id: testDescriptor1.id,
                name: newTestDescriptor.newName,
                procedureDescription: newTestDescriptor.newProcedureDescription,
                idSKU: newTestDescriptor.newIdSKU
            });
        })
    });
});
