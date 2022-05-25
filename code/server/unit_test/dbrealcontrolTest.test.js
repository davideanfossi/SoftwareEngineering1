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
        await controller.dropTableTestResult(); 
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

describe("delete testDescriptor", () => {
    beforeEach(async () => {
        await controller.dropTableTestDescriptors();
        await controller.newTableTestDescriptor();
    })

    test('delete testDescriptor', async () => {    
        await test_service.createTestDescriptor(testDescriptor1);
        await test_service.deleteTestDescriptor(1);
        let res = await test_service.getTestDescriptors();
        expect(res.length).toEqual(0);
    })

    test('delete testDescriptor validation of id failed', async () => { 
        await test_service.createTestDescriptor(testDescriptor1);                                         
        try{         
            await test_service.deleteTestDescriptor(2);
        } catch(err){
            expect(err).toEqual('validation of id failed');
        }
    })
});


// testResults tests

const testResult1 = {
    rfid:"1",
    id:1,
    idTestDescriptor:1,
    Date:"2021/11/29",
    Result: 0
};

const testResult2 = {
    rfid:"2",
    id:2,
    idTestDescriptor:2,
    Date:"2022/01/14",
    Result: 1
};

describe("get testResult", () => {
    beforeEach(async () => {
        await controller.dropTableTestResult();

        // create testDescriptors
        await controller.dropTableTestDescriptors();
        await controller.newTableTestDescriptor();
        await test_service.createTestDescriptor(testDescriptor1);
        await test_service.createTestDescriptor(testDescriptor2);

        // create testResult
        await controller.newTableTestResults();
        await test_service.createTestResult({  
            rfid:"1",  
            idTestDescriptor:1,
            Date:"2021/11/29",
            Result: 0
        });
        await test_service.createTestResult({    
            rfid:"2",
            idTestDescriptor:2,
            Date:"2022/01/14",
            Result: 1
        });
    });

    testTestResult(testResult1);                         
    testTestResult(testResult2);                                 
});

async function testTestResult(testResult) {
    test('get testResult', async () => {
        let res = await test_service.getTestResult(testResult.rfid, testResult.id);
        expect(res[0]).toEqual({
            id:testResult.id,
            idTestDescriptor:testResult.idTestDescriptor,
            Date:testResult.Date,
            Result: testResult.Result
        });
    });
}

describe("create testResult", () => {
    beforeEach(async () => {
        // create testResult
        await controller.dropTableTestResult();
        await controller.newTableTestResults();

        // create testDescriptors
        await controller.dropTableTestDescriptors();
        await controller.newTableTestDescriptor();
        await test_service.createTestDescriptor(testDescriptor1);
    })
    describe("create testResult data", () => {
        test('testResult', async () => {                                        
            const testResult = {
                rfid:"1",  
                idTestDescriptor:1,
                Date:"2021/11/29",
                Result: 0
            }

            let res = await test_service.createTestResult(testResult);
            res = await test_service.getTestResult(testResult.rfid, 1);
            expect(res[0]).toEqual({
                id:1,
                idTestDescriptor:testResult.idTestDescriptor,
                Date:testResult.Date,
                Result: testResult.Result
            });
        })

        
        test('testResult no sku item associated to rfid or no test descriptor associated to idTestDescriptor', async () => {                                           // test 5
            const testResult = {
                rfid:"1",  
                idTestDescriptor: 2,
                Date:"2021/11/29",
                Result: 0
            }

            try{    
                let res = await test_service.createTestResult(testResult);
            }
            catch(err){
                expect(err).toEqual("no sku item associated to rfid or no test descriptor associated to idTestDescriptor");
            }
        })
        
    });
});

describe("modify testResult", () => {
    beforeEach(async () => {
        // create testResult
        await controller.dropTableTestResult();
        await controller.newTableTestResults();

        // create testDescriptors
        await controller.dropTableTestDescriptors();
        await controller.newTableTestDescriptor();
        await test_service.createTestDescriptor(testDescriptor1);

        await test_service.createTestResult({  
            rfid:"1",  
            idTestDescriptor:1,
            Date:"2021/11/29",
            Result: 0
        });
    })
    describe("modify testResult data", () => {
        test('testResult', async () => {                                        
            const testResult = {
                newRfid:"1",
                newIdTestDescriptor:1,
                newDate:"2022/01/14",
                newResult: 1
            }

            let res = await test_service.modifyTestResult(testResult1.rfid, 1, testResult);
            res = await test_service.getTestResult(testResult.newRfid, 1);
            expect(res[0]).toEqual({
                id:1,
                idTestDescriptor:testResult.newIdTestDescriptor,
                Date:testResult.newDate,
                Result: testResult.newResult
            });
        })

        
        test('testResult no sku item associated to rfid or no test descriptor associated to idTestDescriptor', async () => {                                           // test 5
            const testResult = {
                newRfid:"1",  
                newIdTestDescriptor: 2,
                newDate:"2021/11/29",
                newResult: 0
            }

            try{    
                let res = await test_service.createTestResult(testResult);
            }
            catch(err){
                expect(err).toEqual("no sku item associated to rfid or no test descriptor associated to idTestDescriptor");
            }
        })
        
    });
});

describe("delete testResults", () => {
    beforeEach(async () => {
        await controller.dropTableTestResult();
        await controller.newTableTestResults();
    })

    test('delete testResults', async () => {    
        await test_service.createTestResult({  
            rfid:"1",  
            idTestDescriptor:1,
            Date:"2021/11/29",
            Result: 0
        });
        await test_service.deleteTestResult(1);
        try {
            let res = await test_service.getTestResults(testResult1.rfid);
        } catch (err) {
            expect(err.code).toEqual(404);
        }
    })

    test('delete testResults validation of id failed', async () => {  
        await test_service.createTestResult(testResult1);                                       
        try{
            await test_service.deleteTestResult(2);
        }
        catch(err){
            expect(err).toEqual('validation of id failed');
        }
    })
});