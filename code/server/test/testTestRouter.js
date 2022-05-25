const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe.only('test testDescriptor apis', () => {

    beforeEach(async () => {
        await agent.delete('/api/deleteAllTestResults');
        await agent.delete('/api/deleteAllTestDescriptors');
    })

    deleteAllTestResults(204);
    deleteAllTestDescriptors(204);
    
    getTestDescriptors(200, "test descriptor 1", "This test is described by...", 1);
    getTestDescriptor(200, "test descriptor 1", "This test is described by...", 1);
    getTestDescriptor(404, "test descriptor 1", "This test is described by...", 1);

    createTestDescriptor(201, "test descriptor 1", "This test is described by...", 1);
    createTestDescriptor(404, "test descriptor 1", "This test is described by...", 999);

    
    /*
    // <----- HAPPY CASE ----->
    

    // // POST
    createSKUItem(201, "12345678901234567890123456789015", 1, "2021/11/29 12:30");


    // // PUT - DEL
    modifySKUItem(200, "12345678901234567890123456789015", 1, 1, "2021/11/29 12:30");
    deleteSKUItem(204, "12345678901234567890123456789015", 1, "2021/11/29 12:30");

    // // <----- WRONG CASE ----->
    createSKUItem(422, "12345678901234567890123456789015", -3, "2021/11/29 12:30");
    createSKUItem(422, "12345678901234567890123456789015", 2, "2023/11/70 12:30");
    
    getSKUItem(404, "12345678901234567890123456789015", 1, "2021/11/29 12:30")
    getSKUItemsAvailable(404, "12345678901234567890123456789015", 1, "2021/11/29 12:30")
    getSKUItemsAvailable(422, "12345678901234567890123456789015", -3, "2021/11/29 12:30")

    modifySKUItem(422, "12345678901234567890123456789015", 1, -1, "2021/11/29 12:30");
    */
});

function deleteAllTestResults(expectedHTTPStatus) {
    it('Deleting testResults data', function (done) {
        agent.delete('/api/deleteAllTestResults')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function deleteAllTestDescriptors(expectedHTTPStatus) {
    it('Deleting testDescriptors data', function (done) {
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
    it('adding a new SKUItem', function (done) {
        if (idSKU == 1) {
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