const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test orders apis', () => {

    describe('test restock order apis', () => {
        beforeEach(async () => {
            await agent.delete('/api/restockOrders');
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
        modifyRestockOrderNote('should modify restock order note', 200, "2021/11/29 09:33", products, 1, newNote, 1);
        modifyRestockOrderNote('should not update the note as thers no order w/ the id', 404, "2021/11/29 09:33", products, 1, newNote, 420);

        deleteRestockOrder('should delete a restock order', 204, "2021/11/29 09:33", products, 1, 1);
        deleteRestockOrder('should not find the restock order to delete', 404, "2021/11/29 09:33", products, 1, 5);
    });

    describe('test return order apis', () => {
        beforeEach(async () => {
            await agent.delete('/api/restockOrders');
            await agent.delete('/api/returnOrders');
            //Required users created: {id:1, type:supplier}
            await agent.delete('/api/allUsers');
            await agent.delete('/api/dropSequence');
            let user = { username: 'john.snow@supplier.ezwh.com', name: 'John', surname: 'Snow', password: 'password', type: 'supplier' }
            await agent.post('/api/newUser').send(user);
            //Required restock order
            const products = [{"SKUId":12,"description":"a product","price":10.99,"qty":30}, {"SKUId":180,"description":"another product","price":11.99,"qty":20}]
            let restockOrder = {"issueDate":"2021/11/29 09:33", "products":products, "supplierId":1}
            await agent.post('/api/restockOrder').send(restockOrder);
        });

        const products = [{"SKUId":12,"description":"a product","price":10.99, "RFID":"12345678901234567890123456789016"},
        {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}]
        newReturnOrder('should create a return order', 201, "2021/11/29 09:33", products, 1);
        newReturnOrder('should reject the restock order id', 404, "2021/11/29 09:33", products, 666);
        newReturnOrder('should reject the date', 422, "tomorrow", products, 1);

        getReturnOrders('should retrive all return orders', 200, "2021/11/29 09:33", products, 1);

        getOneReturnOrder('should retrive one return order', 200, "2021/11/29 09:33", products, 1, 1);
        getOneReturnOrder('should not find a return order w/ that id', 404, "2021/11/29 09:33", products, 1, 777);
        getOneReturnOrder('should not process that id', 422, "2021/11/29 09:33", products, 1, 'ciao mondo!');

        deleteReturnOrder('should delete one return order', 204, "2021/11/29 09:33", products, 1, 1);
        deleteReturnOrder('should not find a return order to delete', 404, "2021/11/29 09:33", products, 1, 123);
        deleteReturnOrder('should not accept that id to delete', 422, "2021/11/29 09:33", products, 1, 'uscitemi');
    });

    describe('test internal order apis', () => {
        beforeEach(async () => {
            await agent.delete('/api/internalOrders');
            //Required users created: {id:1, type:supplier}
            await agent.delete('/api/allUsers');
            await agent.delete('/api/dropSequence');
            let user = { username: 'john.snow@supplier.ezwh.com', name: 'Ringo', surname: 'Starr', password: 'drowssap', type: 'customer' }
            await agent.post('/api/newUser').send(user);
        });

        const products = [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
        {"SKUId":180,"description":"another product","price":11.99,"qty":3}]
        newInternalOrder('should create an internal order', 201, "2021/11/29 09:33", products, 1);
        newInternalOrder('should not accept the body ', 422, "today", products, 1);

        getInternalOrders('should retrive all internal orders', 200, "2021/11/29 09:33", products, 1);

        const newState1 = {"newState":"issued"}
        const newState2 = {"newState":"COMPLETED","products":[{"SkuID":1,"RFID":"12345678901234567890123456789016"},{"SkuID":1,"RFID":"12345678901234567890123456789038"}]}
        const newState3 = {"newState":"COMPLETED"}
        modifyInternalOrderState('should update state of order', 200, "2021/11/29 09:33", products, 1, newState1, 1);
        modifyInternalOrderState('should update state of order w/ products', 200, "2021/11/29 09:33", products, 1, newState2, 1);
        modifyInternalOrderState('should not accept body, products missing', 422, "2021/11/29 09:33", products, 1, newState3, 1);
        modifyInternalOrderState('should not match any id', 404, "2021/11/29 09:33", products, 1, newState1, 767);

        getInternalOrderIssued('should retrive one issued order', 200, "2021/11/29 09:33", products, 1, newState1, 1);

        const newState4 = {"newState":"Accepted"}
        getInternalOrderAccepted('should retrive one accepted order', 200, "2021/11/29 09:33", products, 1, newState4, 1);

        getOneInternalOrder('should retrive one internal order', 200, "2021/11/29 09:33", products, 1, 1);
        getOneInternalOrder('should not find any internal order', 404, "2021/11/29 09:33", products, 1, 911);
        getOneInternalOrder('should not accept the id', 422, "2021/11/29 09:33", products, 1, "random bs");

        deleteInternalOrder('should delete one internal order', 204, "2021/11/29 09:33", products, 1, 1);
        deleteInternalOrder('should not find an order to delete', 404, "2021/11/29 09:33", products, 1, 420);
        deleteInternalOrder('should not accept the id', 422, "2021/11/29 09:33", products, 1, 'the last one');

    });
});

//<------------------------------------------ RESTOCK ORDER FUNCTIONS -------------------------------------->

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
                        res.body.id.should.equal(id)
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
                agent.put(`/api/restockOrder/${id}`)
                .send({"newState":"DELIVERED"})
                .then(() => {
                    agent.put(`/api/restockOrder/${id}/skuItems`)
                    .send(newSkuItems)
                    .then((res)=>{
                        res.should.have.status(expectedHTTPStatus);
                        done()
                    });
                });
            });
    });
}

function getRestockOrderSkuItems(testName, expectedHTTPStatus, issueDate, products, supplierId, newSkuItems, id){
    it(testName, (done) => {
        const body = {issueDate:issueDate, products:products, supplierId:supplierId}
        agent.post('/api/restockOrder')
            .send(body)
            .then((res)=>{
                agent.put(`/api/restockOrder/1`)
                    .send({"newState":"DELIVERED"})
                    .then(()=>{
                        agent.put(`/api/restockOrder/${id}/skuItems`)
                        .send(newSkuItems)
                        .then(()=>{
                            agent.put(`/api/restockOrder/1`)
                                .send({"newState":"COMPLETEDRETURN"})
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
    });
}

function modifyRestockOrderNote(testName, expectedHTTPStatus, issueDate, products, supplierId, newNote, id){
    it(testName, (done) => {
        const body = {issueDate:issueDate, products:products, supplierId:supplierId}
        agent.post('/api/restockOrder')
            .send(body)
            .then(()=>{
                agent.put(`/api/restockOrder/1`)
                    .send({"newState":"DELIVERY"})
                    .then(()=>{
                        agent.put(`/api/restockOrder/${id}/transportNote`)
                        .send(newNote)
                        .then((res)=>{
                            res.should.have.status(expectedHTTPStatus);
                            done()
                        });
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

//<------------------------------------------ RETURN ORDER FUNCTIONS -------------------------------------->

function newReturnOrder(testName, expectedHTTPStatus, returnDate, products, restockOrderId){
    it(testName, (done) => {
        const body = {returnDate:returnDate, products:products, restockOrderId:restockOrderId}
        agent.post('/api/returnOrder')
            .send(body)
            .then((res) => {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function getReturnOrders(testName, expectedHTTPStatus, returnDate, products, restockOrderId) {
    it(testName, (done) => {
        const body = {returnDate:returnDate, products:products, restockOrderId:restockOrderId}
        agent.post('/api/returnOrder')
            .send(body)
            .then(() => {
                agent.get('/api/returnOrders')
                    .then((res)=>{
                        res.should.have.status(expectedHTTPStatus);
                        res.body.length.should.equal(1);
                        done()
                    });
            });
    });
}

function getOneReturnOrder(testName, expectedHTTPStatus, returnDate, products, restockOrderId, id){
    it(testName, (done) => {
        const body = {returnDate:returnDate, products:products, restockOrderId:restockOrderId}
        agent.post('/api/returnOrder')
            .send(body)
            .then(()=>{
                agent.get(`/api/returnOrders/${id}`)
                .then((res)=>{
                    res.should.have.status(expectedHTTPStatus);
                    if(res.status==200){
                        res.body.id.should.equal(id)
                    }
                    done()
                });   
            });
    });
}

function deleteReturnOrder(testName, expectedHTTPStatus, returnDate, products, restockOrderId, id){
    it(testName, (done) => {
        const body = {returnDate:returnDate, products:products, restockOrderId:restockOrderId}
        agent.post('/api/returnOrder')
            .send(body)
            .then(() => {
                agent.delete(`/api/returnOrder/${id}`)
                    .then((res)=>{
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    });
            });
    });
}

//<------------------------------------------ INTERNAL ORDER FUNCTIONS -------------------------------------->

function newInternalOrder(testName, expectedHTTPStatus, issueDate, products, customerId){
    it(testName, (done) => {
        const body = {issueDate:issueDate, products:products, customerId:customerId}
        agent.post('/api/internalOrders')
            .send(body)
            .then((res) => {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function getInternalOrders(testName, expectedHTTPStatus, issueDate, products, customerId) {
    it(testName, (done) => {
        const body = {issueDate:issueDate, products:products, customerId:customerId}
        agent.post('/api/internalOrders')
            .send(body)
            .then(() => {
                agent.get('/api/internalOrders')
                    .then((res)=>{
                        res.should.have.status(expectedHTTPStatus);
                        res.body.length.should.equal(1);
                        done()
                    });
            });
    });
}

function modifyInternalOrderState(testName, expectedHTTPStatus, issueDate, products, customerId, newData, id){
    it(testName, (done) => {
        const body = {issueDate:issueDate, products:products, customerId:customerId}
        agent.post('/api/internalOrders')
            .send(body)
            .then(()=>{
                agent.put(`/api/internalOrders/${id}`)
                    .send(newData)
                    .then((res)=>{
                        res.should.have.status(expectedHTTPStatus);
                        done()
                    });
            });
    });
}

function getInternalOrderIssued(testName, expectedHTTPStatus, issueDate, products, customerId, newData, id){
    it(testName, (done) => {
        const body = {issueDate:issueDate, products:products, customerId:customerId}
        agent.post('/api/internalOrders')
            .send(body)
            .then(()=>{
                agent.put(`/api/internalOrders/${id}`)
                    .send(newData)
                    .then(()=>{
                        agent.get('/api/internalOrdersIssued')
                            .then((res)=>{
                                res.should.have.status(expectedHTTPStatus);
                                if(res.status==200){
                                    res.body.length.should.equal(1)
                                }
                                done()
                            });
                    });
            });
    });
}

function getInternalOrderAccepted(testName, expectedHTTPStatus, issueDate, products, customerId, newData, id){
    it(testName, (done) => {
        const body = {issueDate:issueDate, products:products, customerId:customerId}
        agent.post('/api/internalOrders')
            .send(body)
            .then(()=>{
                agent.put(`/api/internalOrders/${id}`)
                    .send(newData)
                    .then(()=>{
                        agent.get('/api/internalOrdersAccepted')
                            .then((res)=>{
                                res.should.have.status(expectedHTTPStatus);
                                if(res.status==200){
                                    res.body.length.should.equal(1)
                                }
                                done()
                            });
                    });
            });
    });
}

function getOneInternalOrder(testName, expectedHTTPStatus, issueDate, products, customerId, id){
    it(testName, (done) => {
        const body = {issueDate:issueDate, products:products, customerId:customerId}
        agent.post('/api/internalOrders')
            .send(body)
            .then(()=>{
                agent.get(`/api/internalOrders/${id}`)
                .then((res)=>{
                    res.should.have.status(expectedHTTPStatus);
                    if(res.status==200){
                        res.body.id.should.equal(id)
                    }
                    done()
                });   
            });
    });
}

function deleteInternalOrder(testName, expectedHTTPStatus, issueDate, products, customerId, id){
    it(testName, (done) => {
        const body = {issueDate:issueDate, products:products, customerId:customerId}
        agent.post('/api/internalOrders')
            .send(body)
            .then(() => {
                agent.delete(`/api/internalOrders/${id}`)
                    .then((res)=>{
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    });
            });
    });
}