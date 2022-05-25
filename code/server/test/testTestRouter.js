const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test testDescriptor apis', () => {

    beforeEach(async () => {
        await agent.delete('/api/deleteAllTestResults');
        await agent.delete('/api/deleteAllTestDescriptors');
        await agent.delete('/api/deleteSKUItemTable');
        await agent.post('/api/skuitem').send({
            RFID:"12345678901234567890123456789015",
            SKUId:1,
            DateOfStock:"2021/11/29 12:30"
        });
    })

    deleteAllTestResults(204);
    deleteAllTestDescriptors(204);

    // TEST DESCRIPTORS
    
    getTestDescriptors(200, "test descriptor 1", "This test is described by...", 1);
    getTestDescriptor(200, "test descriptor 1", "This test is described by...", 1);
    getTestDescriptor(404, "test descriptor 1", "This test is described by...", 1);

    createTestDescriptor(201, "test descriptor 1", "This test is described by...", 1);
    createTestDescriptor(404, "test descriptor 1", "This test is described by...", 999);
    createTestDescriptor(422, "", "", 1);

    modifyTestDescriptor(200, "test descriptor 1", "This test is described by...", 1);
    modifyTestDescriptor(404, "test descriptor 1", "This test is described by...", 999);
    modifyTestDescriptor(422, "test descriptor 1", "This test is described by...", 1);

    deleteTestDescriptor(204, "test descriptor 1", "This test is described by...", 1);
    deleteTestDescriptor(422, "test descriptor 1", "This test is described by...", 1);

    // TEST RESULTS

    getTestResults(200, "12345678901234567890123456789015", 1, "2021/11/28", 1);
    getTestResults(404, "12345678901234567890123456789015", 1, "2021/11/28", 1);
    getTestResult(200, "12345678901234567890123456789015", 1, "2021/11/28", 1);
    getTestResult(404, "12345678901234567890123456789015", 1, "2021/11/28", 1);

    createTestResult(201, "12345678901234567890123456789015", 1, "2021/11/28", 1);
    createTestResult(404, "99999999999999999999999999999999", 1, "2021/11/28", 1);
    createTestResult(422, "", 1, "", 1);

    modifyTestResult(200, "12345678901234567890123456789015", 1, "2021/11/28", 1);
    modifyTestResult(404, "12345678901234567890123456789015", 1, "2021/11/28", 1);
    modifyTestResult(422, "12345678901234567890123456789015", 1, "2021/11/28", 1);

    deleteTestResult(204, "12345678901234567890123456789015", 1, "2021/11/28", 1);
    deleteTestResult(422, "12345678901234567890123456789015", 1, "2021/11/28", 1);
});

// test descriptors

function deleteAllTestResults(expectedHTTPStatus) {
    it('Deleting all testResults data', function (done) {
        agent.delete('/api/deleteAllTestResults')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function deleteAllTestDescriptors(expectedHTTPStatus) {
    it('Deleting all testDescriptors data', function (done) {
        agent.delete('/api/deleteAllTestDescriptors')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function getTestDescriptors(expectedHTTPStatus, name, procedureDescription, idSKU){
    it('getting testDescriptors', function (done) {
        let testDescriptor = {name: name, procedureDescription: procedureDescription, idSKU: idSKU}
        agent.post('/api/testDescriptor')
            .send(testDescriptor)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/testDescriptors')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body[0].id.should.equal(1);
                        r.body[0].name.should.equal(name);
                        r.body[0].procedureDescription.should.equal(procedureDescription);
                        r.body[0].idSKU.should.equal(idSKU);
                        done();
                    });
            });
    });
}

function getTestDescriptor(expectedHTTPStatus, name, procedureDescription, idSKU){
    it('getting testDescriptor', function (done) {
        if(expectedHTTPStatus === 200){
            let testDescriptor = {name: name, procedureDescription: procedureDescription, idSKU: idSKU}
            agent.post('/api/testDescriptor')
            .send(testDescriptor)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/testDescriptors/1')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body[0].id.should.equal(1);
                        r.body[0].name.should.equal(name);
                        r.body[0].procedureDescription.should.equal(procedureDescription);
                        r.body[0].idSKU.should.equal(idSKU);
                        done();
                    });
            });
        }
        else{
            agent.get(`/api/skuitems/1`)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    res.body.error.should.equal("not found");
                    done();
                });
            }
    });
}

function createTestDescriptor(expectedHTTPStatus, name, procedureDescription, idSKU){
    it('creating testDescriptor', function (done) {
        if (expectedHTTPStatus == 201) {
            let testDescriptor = {name: name, procedureDescription: procedureDescription, idSKU: idSKU}
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else if (expectedHTTPStatus == 404) {
            let testDescriptor = {name: name, procedureDescription: procedureDescription, idSKU: idSKU}
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            let testDescriptor = {name: name, procedureDescription: procedureDescription, idSKU: idSKU}
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}

function modifyTestDescriptor(expectedHTTPStatus, name, procedureDescription, idSKU){
    it('modifying testDescriptor', function (done) {
        if (expectedHTTPStatus == 200) {
            let testDescriptor = {name: name, procedureDescription: procedureDescription, idSKU: idSKU}
            agent.post('/api/testDescriptor')
            .send(testDescriptor)
            .then(function (res) {
                res.should.have.status(201);
                let testDescriptor = {newName: "new name", newProcedureDescription: procedureDescription, newIdSKU: idSKU}
                agent.put('/api/testDescriptor/1')
                    .send(testDescriptor)
                    .then(function (res) {
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    });
            });
        } else if ((expectedHTTPStatus == 404)) {
            let testDescriptor = {name: name, procedureDescription: procedureDescription, idSKU: 1}
            agent.post('/api/testDescriptor')
            .send(testDescriptor)
            .then(function (res) {
                res.should.have.status(201);
                let testDescriptor = {newName: "new name", newProcedureDescription: procedureDescription, newIdSKU: idSKU}
                agent.put('/api/testDescriptor/1')
                    .send(testDescriptor)
                    .then(function (res) {
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    });
            });
        } else {
            let testDescriptor = {name: name, procedureDescription: procedureDescription, idSKU: idSKU}
            agent.post('/api/testDescriptor')
            .send(testDescriptor)
            .then(function (res) {
                res.should.have.status(201);
                let testDescriptor = {newName: "", newProcedureDescription: "", newIdSKU: idSKU}
                agent.put('/api/testDescriptor/1')
                    .send(testDescriptor)
                    .then(function (res) {
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    });
            });
        }
    });
}

function deleteTestDescriptor(expectedHTTPStatus, name, procedureDescription, idSKU) {
    it('delete testDescriptor', function (done) {
        if (expectedHTTPStatus == 204) {
            let testDescriptor = {name: name, procedureDescription: procedureDescription, idSKU: idSKU}
            agent.post('/api/testDescriptor')
            .send(testDescriptor)
            .then(function (res) {
                res.should.have.status(201);
                agent.delete(`/api/testDescriptor/1`)
                    .then(function (res) {
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    });
                })
        } else {
            let testDescriptor = {name: name, procedureDescription: procedureDescription, idSKU: idSKU}
            agent.post('/api/testDescriptor')
            .send(testDescriptor)
            .then(function (res) {
                res.should.have.status(201);
                agent.delete(`/api/testDescriptor/2`)
                    .then(function (res) {
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    });
                })
        }
    });
}

// test results

function getTestResults(expectedHTTPStatus, rfid, idTestDescriptor, Date, Result){
    it('getting testResults', function (done) {
        if (expectedHTTPStatus === 200) {
            let testDescriptor = {name: "test descriptor 1", procedureDescription: "This test is described by...", idSKU: 1}
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(201);
                    let testResult = {rfid: rfid, idTestDescriptor: idTestDescriptor, Date: Date, Result: Result}
                    agent.post('/api/skuitems/testResult')
                        .send(testResult)
                        .then(function (res) {
                            res.should.have.status(201);
                            agent.get('/api/skuitems/1/testResults')
                                .then(function (r) {
                                    r.should.have.status(expectedHTTPStatus);
                                    r.body[0].id.should.equal(1);
                                    r.body[0].idTestDescriptor.should.equal(idTestDescriptor);
                                    r.body[0].Date.should.equal(Date);
                                    r.body[0].Result.should.equal(Result);
                                    done();
                                });
                        });
                });
        } else {
            let testDescriptor = {name: "test descriptor 1", procedureDescription: "This test is described by...", idSKU: 1}
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(201);
                    let testResult = {rfid: rfid, idTestDescriptor: idTestDescriptor, Date: Date, Result: Result}
                    agent.post('/api/skuitems/testResult')
                        .send(testResult)
                        .then(function (res) {
                            res.should.have.status(201);
                            agent.get('/api/skuitems/2/testResults')
                                .then(function (r) {
                                    r.should.have.status(expectedHTTPStatus);
                                    done();
                                });
                        });
                });
        }
    });
}

function getTestResult(expectedHTTPStatus, rfid, idTestDescriptor, Date, Result){
    it('getting testResult', function (done) {
        if (expectedHTTPStatus === 200) {
            let testDescriptor = {name: "test descriptor 1", procedureDescription: "This test is described by...", idSKU: 1}
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(201);
                    let testResult = {rfid: rfid, idTestDescriptor: idTestDescriptor, Date: Date, Result: Result}
                    agent.post('/api/skuitems/testResult')
                        .send(testResult)
                        .then(function (res) {
                            res.should.have.status(201);
                            agent.get('/api/skuitems/1/testResults/1')
                                .then(function (r) {
                                    r.should.have.status(expectedHTTPStatus);
                                    r.body[0].id.should.equal(1);
                                    r.body[0].idTestDescriptor.should.equal(idTestDescriptor);
                                    r.body[0].Date.should.equal(Date);
                                    r.body[0].Result.should.equal(Result);
                                    done();
                                });
                        });
                });
        } else {
            let testDescriptor = {name: "test descriptor 1", procedureDescription: "This test is described by...", idSKU: 1}
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(201);
                    let testResult = {rfid: rfid, idTestDescriptor: idTestDescriptor, Date: Date, Result: Result}
                    agent.post('/api/skuitems/testResult')
                        .send(testResult)
                        .then(function (res) {
                            res.should.have.status(201);
                            agent.get('/api/skuitems/2/testResults/1')
                                .then(function (r) {
                                    r.should.have.status(expectedHTTPStatus);
                                    done();
                                });
                        });
                });
        }
    });
}

function createTestResult(expectedHTTPStatus, rfid, idTestDescriptor, Date, Result){
    it('creating testResult', function (done) {
        if (expectedHTTPStatus === 201) {
            let testDescriptor = {name: "test descriptor 1", procedureDescription: "This test is described by...", idSKU: 1}
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(201);
                    let testResult = {rfid: rfid, idTestDescriptor: idTestDescriptor, Date: Date, Result: Result}
                    agent.post('/api/skuitems/testResult')
                        .send(testResult)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done();
                        });
                });
        } else if (expectedHTTPStatus === 404) {
            let testDescriptor = {name: "test descriptor 1", procedureDescription: "This test is described by...", idSKU: 1}
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(201);
                    let testResult = {rfid: rfid, idTestDescriptor: idTestDescriptor, Date: Date, Result: Result}
                    agent.post('/api/skuitems/testResult')
                        .send(testResult)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done()
                        });
                });
        } else {
            let testDescriptor = {name: "test descriptor 1", procedureDescription: "This test is described by...", idSKU: 1}
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(201);
                    let testResult = {rfid: rfid, idTestDescriptor: idTestDescriptor, Date: Date, Result: Result}
                    agent.post('/api/skuitems/testResult')
                        .send(testResult)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done()
                        });
                });
        }
    });
}

function modifyTestResult(expectedHTTPStatus, rfid, idTestDescriptor, Date, Result){
    it('modyfying testResult', function (done) {
        if (expectedHTTPStatus === 200) {
            let testDescriptor = {name: "test descriptor 1", procedureDescription: "This test is described by...", idSKU: 1}
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(201);
                    let testResult = {rfid: rfid, idTestDescriptor: idTestDescriptor, Date: Date, Result: Result}
                    agent.post('/api/skuitems/testResult')
                        .send(testResult)
                        .then(function (res) {
                            res.should.have.status(201);
                            let newTestResult = {newIdTestDescriptor: idTestDescriptor, newDate: Date, newResult: 0}
                            agent.put('/api/skuitems/1/testResult/1')
                                .send(newTestResult)
                                .then(function (res) {
                                    res.should.have.status(expectedHTTPStatus);
                                    done();
                                });
                        });
                });
        } else if (expectedHTTPStatus === 404) {
            let testDescriptor = {name: "test descriptor 1", procedureDescription: "This test is described by...", idSKU: 1}
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(201);
                    let testResult = {rfid: rfid, idTestDescriptor: idTestDescriptor, Date: Date, Result: Result}
                    agent.post('/api/skuitems/testResult')
                        .send(testResult)
                        .then(function (res) {
                            res.should.have.status(201);
                            let newTestResult = {newIdTestDescriptor: idTestDescriptor, newDate: Date, newResult: 0}
                            agent.put('/api/skuitems/1/testResult/2')
                                .send(newTestResult)
                                .then(function (res) {
                                    res.should.have.status(expectedHTTPStatus);
                                    done();
                                });
                        });
                });
        } else {
            let testDescriptor = {name: "test descriptor 1", procedureDescription: "This test is described by...", idSKU: 1}
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(201);
                    let testResult = {rfid: rfid, idTestDescriptor: idTestDescriptor, Date: Date, Result: Result}
                    agent.post('/api/skuitems/testResult')
                        .send(testResult)
                        .then(function (res) {
                            res.should.have.status(201);
                            let newTestResult = {newIdTestDescriptor: idTestDescriptor, newDate: "", newResult: 0}
                            agent.put('/api/skuitems/1/testResult/2')
                                .send(newTestResult)
                                .then(function (res) {
                                    res.should.have.status(expectedHTTPStatus);
                                    done();
                                });
                        });
                });
        }
    });
}

function deleteTestResult(expectedHTTPStatus, rfid, idTestDescriptor, Date, Result) {
    it('delete testResult', function (done) {
        if (expectedHTTPStatus == 204) {
            let testDescriptor = {name: "test descriptor 1", procedureDescription: "This test is described by...", idSKU: 1}
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(201);
                    let testResult = {rfid: rfid, idTestDescriptor: idTestDescriptor, Date: Date, Result: Result}
                    agent.post('/api/skuitems/testResult')
                        .send(testResult)
                        .then(function (res) {
                            res.should.have.status(201);
                            agent.delete(`/api/skuitems/1/testResult/1`)
                            .then(function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                done();
                            });
                        });
                });
        } else {
            let testDescriptor = {name: "test descriptor 1", procedureDescription: "This test is described by...", idSKU: 1}
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(201);
                    let testResult = {rfid: rfid, idTestDescriptor: idTestDescriptor, Date: Date, Result: Result}
                    agent.post('/api/skuitems/testResult')
                        .send(testResult)
                        .then(function (res) {
                            res.should.have.status(201);
                            agent.delete(`/api/skuitems/1/testResult/2`)
                            .then(function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                done();
                            });
                        });
                });
        }
    });
}
