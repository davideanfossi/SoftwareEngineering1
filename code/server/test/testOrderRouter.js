const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test orders router', () => {


    beforeEach(async () => {
        await agent.delete('/api/restockOrders');
        await agent.delete('/api/returnOrders');
        await agent.delete('/api/internalOrders');
        //Required users created: {id:1, type:supplier}
        await agent.delete('/api/allUsers');
        await agent.delete('/api/dropSequence');
        let user = { username: 'john.snow@supplier.ezwh.com', name: 'John', surname: 'Snow', password: 'password', type: 'supplier' }
        await agent.post('/api/newUser').send(user);


    });


    const products = [{"SKUId":12,"description":"a product","price":10.99,"qty":30}, {"SKUId":180,"description":"another product","price":11.99,"qty":20}]
    newRestockOrder('should create a restock order', 201, "2021/11/29 09:33", products, 1);
    newRestockOrder('should find supplier as non valid', 404, "2021/11/29 09:33", products, 2);
    newRestockOrder('should find data as non valid', 422, "yesterday", products, 1);

    getRestockOrders('should retrive one object', 200, "2021/11/29 09:33", products, 1);

    const newState1 = {"newState":"COMPLETED"}
    const newState2 = {"newState":"issued"}
    const newState3 = {"newState":"something"}
    modifyRestockOrderState('should update state', 200, "2021/11/29 09:33", products, 1, newState1, 1);
    modifyRestockOrderState('should update state', 200, "2021/11/29 09:33", products, 1, newState2, 1);
    modifyRestockOrderState('should reject update to state', 422, "2021/11/29 09:33", products, 1, newState3, 1);

    getRestockOrdersIssued('should get one issued restock order', 200, "2021/11/29 09:33", products, 1);

    getOneRestockOrder('should get one restock order', 200, "2021/11/29 09:33", products, 1, 1);
    getOneRestockOrder('should not get restock orders assossiated to id', 404, "2021/11/29 09:33", products, 1, 69);
    getOneRestockOrder('should reject the id for its type', 422, "2021/11/29 09:33", products, 1, 'a');

    const newSkuItems1 = {
        "skuItems" : [{"SKUId":12,"rfid":"12345678901234567890123456789016"},
        {"SKUId":12,"rfid":"12345678901234567890123456789017"}]
    }
    const newSkuItems2 = {
        "skuItems" : []
    }
    modifyRestockOrderSkuItems('should update skuItems', 200, "2021/11/29 09:33", products, 1, newSkuItems1, 1);
    modifyRestockOrderSkuItems('should reject skuItems', 422, "2021/11/29 09:33", products, 1, newSkuItems2, 1);

    getRestockOrderSkuItems('should retrive skuItems', 200, "2021/11/29 09:33", products, 1, newSkuItems1, 1);

    const newNote = {"transportNote":{"deliveryDate":"2021/12/29"}}
    modifyRestockOrderNote('should update state', 200, "2021/11/29 09:33", products, 1, newNote, 1);
    modifyRestockOrderNote('should not update state as thers no order w/ the id', 404, "2021/11/29 09:33", products, 1, newNote, 420);

    deleteRestockOrder('should delete a restock order', 204, "2021/11/29 09:33", products, 1, 1);
    deleteRestockOrder('should not find the restock order to delete', 404, "2021/11/29 09:33", products, 1, 5);


});

function newRestockOrder(testName, expectedHTTPStatus, issueDate, products, supplierId){
    it(testName, (done) => {
        const body = {issueDate:issueDate, products:products, supplierId:supplierId}
        agent.post('/api/restockOrder')
            .send(body)
            .then((res) => {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function getRestockOrders(testName, expectedHTTPStatus, issueDate, products, supplierId) {
    it(testName, (done) => {
        const body = {issueDate:issueDate, products:products, supplierId:supplierId}
        agent.post('/api/restockOrder')
            .send(body)
            .then(() => {
                agent.get('/api/restockOrders')
                    .then((res)=>{
                        res.should.have.status(expectedHTTPStatus);
                        res.body.length.should.equal(1);
                        done()
                    });
            });
    });
}

function modifyRestockOrderState(testName, expectedHTTPStatus, issueDate, products, supplierId, newState, id){
    it(testName, (done) => {
        const body = {issueDate:issueDate, products:products, supplierId:supplierId}
        agent.post('/api/restockOrder')
            .send(body)
            .then(()=>{
                agent.put(`/api/restockOrder/${id}`)
                    .send(newState)
                    .then((res)=>{
                        res.should.have.status(expectedHTTPStatus);
                        done()
                    });
            });
    });
}

function getRestockOrdersIssued(testName, expectedHTTPStatus, issueDate, products, supplierId){
    it(testName, (done) => {
        const body = {issueDate:issueDate, products:products, supplierId:supplierId}
        agent.post('/api/restockOrder')
            .send(body)
            .then(()=>{
                agent.put(`/api/restockOrder/1`)
                    .send({"newState":"issued"})
                    .then(()=>{
                        agent.get('/api/restockOrdersIssued')
                        .then((res)=>{
                            res.should.have.status(expectedHTTPStatus);
                            res.body.length.should.equal(1);
                            done()
                        });
                    });
            });
    });
}

function getOneRestockOrder(testName, expectedHTTPStatus, issueDate, products, supplierId, id){
    it(testName, (done) => {
        const body = {issueDate:issueDate, products:products, supplierId:supplierId}
        agent.post('/api/restockOrder')
            .send(body)
            .then(()=>{
                agent.get(`/api/restockOrders/${id}`)
                .then((res)=>{
                    res.should.have.status(expectedHTTPStatus);
                    if(res.status==200){
                        res.body.ID.should.equal(id)
                    }
                    done()
                });   
            });
    });
}

function modifyRestockOrderSkuItems(testName, expectedHTTPStatus, issueDate, products, supplierId, newSkuItems, id){
    it(testName, (done) => {
        const body = {issueDate:issueDate, products:products, supplierId:supplierId}
        agent.post('/api/restockOrder')
            .send(body)
            .then(()=>{
                agent.put(`/api/restockOrder/${id}/skuItems`)
                    .send(newSkuItems)
                    .then((res)=>{
                        res.should.have.status(expectedHTTPStatus);
                        done()
                    });
            });
    });
}

function getRestockOrderSkuItems(testName, expectedHTTPStatus, issueDate, products, supplierId, newSkuItems, id){
    it(testName, (done) => {
        const body = {issueDate:issueDate, products:products, supplierId:supplierId}
        agent.post('/api/restockOrder')
            .send(body)
            .then(()=>{
                agent.put(`/api/restockOrder/${id}/skuItems`)
                    .send(newSkuItems)
                    .then((res)=>{
                        agent.put(`/api/restockOrder/1`)
                            .send({"newState":"delivered"})
                            .then((res)=>{
                                agent.get(`/api/restockOrders/${id}/returnItems`)
                                    .then((res)=>{
                                        res.should.have.status(expectedHTTPStatus);
                                        res.body.length.should.equal(newSkuItems.skuItems.length);
                                        done()
                                    });
                            });
                    });
            });
    });
}

function modifyRestockOrderNote(testName, expectedHTTPStatus, issueDate, products, supplierId, newNote, id){
    it(testName, (done) => {
        const body = {issueDate:issueDate, products:products, supplierId:supplierId}
        agent.post('/api/restockOrder')
            .send(body)
            .then(()=>{
                agent.put(`/api/restockOrder/${id}/transportNote`)
                    .send(newNote)
                    .then((res)=>{
                        res.should.have.status(expectedHTTPStatus);
                        done()
                    });
            });
    });
}

function deleteRestockOrder(testName, expectedHTTPStatus, issueDate, products, supplierId, id){
    it(testName, (done) => {
        const body = {issueDate:issueDate, products:products, supplierId:supplierId}
        agent.post('/api/restockOrder')
            .send(body)
            .then(() => {
                agent.delete(`/api/restockOrder/${id}`)
                    .then((res)=>{
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    });
            });
    });
}