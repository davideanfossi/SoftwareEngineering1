const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const SKU ={
    description : "another sku",
    weight : 101,
    volume : 60,
    notes : "second SKU",
    availableQuantity : 55,
    price : 10.99,
}

position = {
    positionID:"800234543412",
    aisleID: "8002",
    row: "3454",
    col: "3412",
    maxWeight: 1000,
    maxVolume: 1000
}

describe('test SKU apis', () => {

    beforeEach(async () => {
        await agent.delete('/api/deletePositionTable');
        await agent.post('/api/position').send(position);
        await agent.delete('/api/deleteAllTestDescriptors');
        await agent.delete('/api/deleteAllTestResults');
        await agent.delete('/api/deleteSKUItemTable');
        await agent.delete('/api/deleteItemTable');
        await agent.delete('/api/deleteSKUTable');
    })

    getSKUs(200, "a new sku", 100, 50, "first SKU", 10.99, 50);
    getSKU(200, "a new sku", 100, 50, "first SKU", 10.99, 50);
    getSKU(404, "a new sku", 100, 50, "first SKU", 10.99, 50);

    createSKU(201, "a new sku", 100, 50, "first SKU", 10.99, 50);
    createSKU(422, "", "", "", "", "", "");

    modifySKU(200, "a new sku", 100, 50, "first SKU", 10.99, 50);
    modifySKU(404, "a new sku", 100, 50, "first SKU", 10.99, 50);
    modifySKU(422, "a new sku", 100, 50, "first SKU", 10.99, 50);

    modifySkuPositon(200, position.positionID, "a new sku", 100, 50, "first SKU", 10.99, 50);
    modifySkuPositon(404, "5234541545", "a new sku", 100, 50, "first SKU", 10.99, 50);
    modifySkuPositon(422, "", "a new sku", 100, 50, "first SKU", 10.99, 50),

    deleteSKU(204, "a new sku", 100, 50, "first SKU", 10.99, 50);
    deleteSKU(422, "a new sku", 100, 50, "first SKU", 10.99, 50);
});


function getSKUs(expectedHTTPStatus, description, weight, volume, notes, price, availableQuantity) {
    it('getting SKUs', function (done) {
        let SKU = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity}
        agent.post('/api/sku')
            .send(SKU)
            .then(function (res) {
                agent.get('/api/skus')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body[0].id.should.equal(1);
                        r.body[0].description.should.equal(description);
                        r.body[0].weight.should.equal(weight);
                        r.body[0].volume.should.equal(volume);
                        r.body[0].notes.should.equal(notes);
                        r.body[0].price.should.equal(price);
                        r.body[0].availableQuantity.should.equal(availableQuantity);
                        done();
                    });
            });
        });
}

function getSKU(expectedHTTPStatus, description, weight, volume, notes, price, availableQuantity) {
    if (expectedHTTPStatus === 200) {
        it('getting SKU', function (done) {
            let SKU = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity}
            agent.post('/api/sku')
                .send(SKU)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get('/api/skus/1')
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            r.body[0].id.should.equal(1);
                            r.body[0].description.should.equal(description);
                            r.body[0].weight.should.equal(weight);
                            r.body[0].volume.should.equal(volume);
                            r.body[0].notes.should.equal(notes);
                            r.body[0].price.should.equal(price);
                            r.body[0].availableQuantity.should.equal(availableQuantity);
                            done();
                        });
                });
            });
    } else {
        it('getting SKU with wrong id', function (done) {
            let SKU = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity}
            agent.post('/api/sku')
                .send(SKU)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get('/api/skus/2')
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        });
                });
            });
    }
}

function createSKU(expectedHTTPStatus, description, weight, volume, notes, price, availableQuantity) {
    if (expectedHTTPStatus === 201){
        it('creating SKU', function (done) {
        let SKU = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity}
        agent.post('/api/sku')
            .send(SKU)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        });
    } else {
        it('creating SKU with empty body', function (done) {
            let SKU = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity}
            agent.post('/api/sku')
                .send(SKU)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
            });
    }
    
}

function modifySKU(expectedHTTPStatus, description, weight, volume, notes, price, availableQuantity) {
    if (expectedHTTPStatus === 200){
        it('modifying SKU', function (done) {
        let SKU = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity}
        agent.post('/api/sku')
            .send(SKU)
            .then(function (res) {
                res.should.have.status(201);
                let newSKU = { newDescription: "a modified sku", newWeight: weight, newVolume: volume, newNotes: notes, newPrice: 8.8, newAvailableQuantity: 3}
                agent.put('/api/sku/1')
                    .send(newSKU)
                    .then(function (res) {
                        res.should.have.status(expectedHTTPStatus); 
                        done();
                });
            });
        });
    } else if (expectedHTTPStatus === 404) {
        it('modifying SKU with wrong id', function (done) {
            let SKU = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity}
            agent.post('/api/sku')
                .send(SKU)
                .then(function (res) {
                    res.should.have.status(201);
                    let newSKU = { newDescription: "a modified sku", newWeight: weight, newVolume: volume, newNotes: notes, newPrice: 8.8, newAvailableQuantity: 3}
                    agent.put('/api/sku/2')
                        .send(newSKU)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus); 
                            done();
                    });
                });
            });
    } else {
        it('modifying SKU with empty body', function (done) {
            let SKU = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity}
            agent.post('/api/sku')
                .send(SKU)
                .then(function (res) {
                    res.should.have.status(201);
                    let newSKU = { newDescription: "", newWeight: weight, newVolume: volume, newNotes: "", newPrice: 8.8, newAvailableQuantity: 3}
                    agent.put('/api/sku/1')
                        .send(newSKU)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus); 
                            done();
                    });
                });
            });
    }
    
}

function modifySkuPositon(expectedHTTPStatus, positionId, description, weight, volume, notes, price, availableQuantity) {
    if (expectedHTTPStatus === 200){
        it('modifying SKU positon', function (done) {
        let SKU = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity}
        agent.post('/api/sku')
            .send(SKU)
            .then(function (res) {
                res.should.have.status(201);
                let position = { position: positionId};
                agent.put('/api/sku/1/position')
                    .send(position)
                    .then(function (res) {
                        res.should.have.status(expectedHTTPStatus); 
                        done();
                });
            });
        });
    } else if (expectedHTTPStatus === 404) {
        it('modifying SKU positon with wrong position id', function (done) {
            let SKU = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity}
            agent.post('/api/sku')
                .send(SKU)
                .then(function (res) {
                    res.should.have.status(201);
                    let position = { position: positionId};
                    agent.put('/api/sku/1/position')
                        .send(position)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus); 
                            done();
                    });
                });
            });
    } else {
        it('modifying SKU positon with empty body', function (done) {
            let SKU = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity}
            agent.post('/api/sku')
                .send(SKU)
                .then(function (res) {
                    res.should.have.status(201);
                    let position = { position: positionId};
                    agent.put('/api/sku/1/position')
                        .send(position)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus); 
                            done();
                    });
                });
            });
    }
}

function deleteSKU(expectedHTTPStatus, description, weight, volume, notes, price, availableQuantity) {
    if (expectedHTTPStatus === 204){
        it('deleting SKU', function (done) {
        let SKU = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity}
        agent.post('/api/sku')
            .send(SKU)
            .then(function (res) {
                res.should.have.status(201);
                agent.delete('/api/skus/1')
                    .then(function (res) {
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    });
            });
        });
    } else {
        it('deleting SKU with wrong id', function (done) {
            let SKU = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity}
            agent.post('/api/sku')
                .send(SKU)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete('/api/skus/2')
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done();
                        });
                });
            });
    }
    
}



describe('test SKUItem apis', () => {

    beforeEach(async () => {
        await agent.delete('/api/deleteAllSKUItem');
        await agent.delete('/api/deleteSKUTable');
        await agent.post('/api/sku')
        .send(SKU)
    })

    deleteAllSKUItem(204);

    // <----- HAPPY CASE ----->
    // GET
    getSKUItems(200, '12345678901234567890123456789015', 1, "2021/11/29 12:30")
    getSKUItem(200, "12345678901234567890123456789015", 1, "2021/11/29 12:30")
    getSKUItemsAvailable(200, "12345678901234567890123456789015", 1, "2021/11/29 12:30")

    // // // POST
    createSKUItem(201, "12345678901234567890123456789015", 1, "2021/11/29 12:30");


    // // // PUT - DEL
    modifySKUItem(200, "12345678901234567890123456789015", 1, 1, "2021/11/29 12:30");
    deleteSKUItem(204, "12345678901234567890123456789015", 1, "2021/11/29 12:30");

    // // // <----- WRONG CASE ----->
    createSKUItem(422, "12345678901234567890123456789015", -3, "2021/11/29 12:30");
    createSKUItem(422, "12345678901234567890123456789015", 2, "2023/11/70 12:30");
    
    getSKUItem(404, "12345678901234567890123456789015", 1, "2021/11/29 12:30")
    getSKUItemsAvailable(404, "12345678901234567890123456789015", 1, "2021/11/29 12:30")
    getSKUItemsAvailable(422, "12345678901234567890123456789015", -3, "2021/11/29 12:30")

    modifySKUItem(422, "12345678901234567890123456789015", 1, -1, "2021/11/29 12:30");
});

function deleteAllSKUItem(expectedHTTPStatus) {
    it('Deleting data', function (done) {
        agent.delete('/api/deleteAllSKUItem')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function getSKUItems(expectedHTTPStatus, RFID, SKUId, DateOfStock) {
    it('getting SKUItems', function (done) {
        let SKUItem = { RFID: RFID, SKUId: SKUId, DateOfStock: DateOfStock}
        agent.post('/api/skuitem')
            .send(SKUItem)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/skuitems')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body[0].RFID.should.equal(RFID);
                        r.body[0].SKUId.should.equal(SKUId);
                        r.body[0].Available.should.equal(0);
                        r.body[0].DateOfStock.should.equal(DateOfStock);
                        done();
                    });
            });
        });
}

function getSKUItemsAvailable(expectedHTTPStatus, RFID, SKUId, DateOfStock) {
    it('getting SKUItems available', function (done) {
        if(expectedHTTPStatus === 200){
            let SKUItem = { RFID: RFID, SKUId: SKUId, DateOfStock: DateOfStock}
            agent.post('/api/skuitem')
                .send(SKUItem)
                .then(function (res) {
                    res.should.have.status(201);
                    let newSKUItemdata = { newRFID: "12345678901234567890123456789014", newAvailable: 1, newDateOfStock: DateOfStock}
                        agent.put(`/api/skuitems/${RFID}`)
                        .send(newSKUItemdata)
                        .then(function (res) {
                            res.should.have.status(200);
                            agent.get(`/api/skuitems/sku/${SKUId}`)
                            .then(function (r) {
                                r.should.have.status(expectedHTTPStatus);
                                r.body[0].RFID.should.equal(newSKUItemdata.newRFID);
                                r.body[0].SKUId.should.equal(SKUId);
                                r.body[0].Available.should.equal(newSKUItemdata.newAvailable);
                                r.body[0].DateOfStock.should.equal(newSKUItemdata.newDateOfStock);
                                done();
                    });
                });
            });
        }
        else if(expectedHTTPStatus === 422) {
            let SKUItem = { RFID: RFID, SKUId: 1, DateOfStock: DateOfStock}
            agent.post('/api/skuitem')
                .send(SKUItem)
                .then(function (res) {
                    res.should.have.status(201);
                    let newSKUItemdata = { newRFID: "12345678901234567890123456789014", newAvailable: 0, newDateOfStock: DateOfStock}
                        agent.put(`/api/skuitems/${RFID}`)
                        .send(newSKUItemdata)
                        .then(function (res) {
                            res.should.have.status(200);
                            agent.get(`/api/skuitems/sku/${SKUId}`)
                            .then(function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                res.body.error.should.equal("Invalid id");
                                done();
                    });
                });
            });
        }
        else if(expectedHTTPStatus === 404) {
            let SKUItem = { RFID: RFID, SKUId: SKUId, DateOfStock: DateOfStock}
            agent.post('/api/skuitem')
                .send(SKUItem)
                .then(function (res) {
                    res.should.have.status(201);
                    let newSKUItemdata = { newRFID: "12345678901234567890123456789014", newAvailable: 0, newDateOfStock: DateOfStock}
                        agent.put(`/api/skuitems/${RFID}`)
                        .send(newSKUItemdata)
                        .then(function (res) {
                            res.should.have.status(200);
                            agent.get(`/api/skuitems/sku/${SKUId}`)
                            .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            res.body.error.should.equal("no SKUItemAvailable found");
                            done();
                    });
                });
            });
        }
    });
}

function modifySKUItem(expectedHTTPStatus, RFID, SKUId, newAvailable, DateOfStock) {
    it('modify getSKUItem', function (done) {
        if(expectedHTTPStatus === 200){
            let SKUItem = { RFID: RFID, SKUId: SKUId, DateOfStock: DateOfStock}
            agent.post('/api/skuitem')
                .send(SKUItem)
                .then(function (res) {
                    res.should.have.status(201);
                    let newSKUItemdata = { newRFID: "12345678901234567890123456789014", newAvailable: newAvailable, newDateOfStock: DateOfStock}
                        agent.put(`/api/skuitems/${RFID}`)
                        .send(newSKUItemdata)
                        .then(function (res) {
                            res.should.have.status(200);
                            agent.get('/api/skuitems')
                            .then(function (r) {
                                r.should.have.status(expectedHTTPStatus);
                                r.body[0].RFID.should.equal(newSKUItemdata.newRFID);
                                r.body[0].SKUId.should.equal(SKUId);
                                r.body[0].Available.should.equal(newAvailable);
                                r.body[0].DateOfStock.should.equal(newSKUItemdata.newDateOfStock);
                                done();
                    });
                });
            });
        }
        else{
            let SKUItem = { RFID: RFID, SKUId: SKUId, DateOfStock: DateOfStock}
            agent.post('/api/skuitem')
                .send(SKUItem)
                .then(function (res) {
                    res.should.have.status(201);
                    let newSKUItemdata = { newRFID: "12345678901234567890123456789014", newAvailable: newAvailable, newDateOfStock: DateOfStock}
                        agent.put(`/api/skuitems/${RFID}`)
                        .send(newSKUItemdata)
                        .then(function (res) {
                            res.should.have.status(422);
                            res.body.error.should.equal("Invalid newAvailable");
                            done();
                    });
            });
        }
    });
}

function getSKUItem(expectedHTTPStatus, RFID, SKUId, DateOfStock) {
    it('getting getSKUItem', function (done) {
        if(expectedHTTPStatus === 200){
            let SKUItem = { RFID: "12345678901234567890123456789015", SKUId: SKUId, DateOfStock: DateOfStock}
            agent.post('/api/skuitem')
                .send(SKUItem)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get(`/api/skuitems/${RFID}`)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            r.body[0].RFID.should.equal(RFID);
                            r.body[0].SKUId.should.equal(SKUId);
                            r.body[0].Available.should.equal(0);
                            r.body[0].DateOfStock.should.equal(DateOfStock);
                            done();
                    });
            });
        }
        else{
            agent.get(`/api/skuitems/${RFID}`)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    res.body.error.should.equal("not found");
                    done();
                });

        
            }
    });
}

function createSKUItem(expectedHTTPStatus, RFID, SKUId, DateOfStock) {
    it('adding a new SKUItem', function (done) {
        if (RFID === undefined || SKUId < 0 || (new Date(DateOfStock) !== "Invalid Date") && !isNaN(new Date(DateOfStock)) !== true) {
            let SKUItem = { RFID: RFID, SKUId: SKUId, DateOfStock: DateOfStock}
            agent.post('/api/skuitem')
                .send(SKUItem)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            let SKUItem = { RFID: RFID, SKUId: SKUId, DateOfStock: DateOfStock}
            agent.post('/api/skuitem')
                .send(SKUItem)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function deleteSKUItem(expectedHTTPStatus, RFID, SKUId, DateOfStock) {
    it('delete SKUItem', function (done) {
        if (expectedHTTPStatus == 204) {
            let SKUItem = { RFID: "12345678901234567890123456789015", SKUId: SKUId, DateOfStock: DateOfStock}
            agent.post('/api/skuitem')
                .send(SKUItem)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete(`/api/skuitems/${RFID}`)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done();
                        });
                })
        } else if (typeof RFID != 'string') {
            let SKUItem = { RFID: "12345678901234567890123456789015", SKUId: SKUId, DateOfStock: DateOfStock}
            agent.post('/api/skuitem')
                .send(SKUItem)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete(`/api/skuitems/${RFID}`)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done();
                        });

                })

        }
    });
}


describe('test Position apis', () => {

    beforeEach(async () => {
        await agent.delete('/api/deleteAllPosition');
    })

    deleteAllPosition(204);

    // <----- HAPPY CASE ----->
    // GET
    getPositions(200, "800234543412", "8002", "3454", "3412", 1000, 1000)

    // // POST
    createPosition(201, "800234543412", "8002", "3454", "3412", 1000, 1000);


    // // PUT - DEL
    modifyPosition(200, "800234543412", "8002", "3454", "3412", 1000, 1000);
    modifyPositionID(200, "800234543412", "8002", "3454", "3412", 1000, 1000);
    deletePosition(204, "800234543412", "8002", "3454", "3412", 1000, 1000);

    // // <----- WRONG CASE ----->
    createPosition(422, "80023454341", "8002", "3454", "3412", 1000, 1000);
    
    modifyPositionID(422, "800234543412", "8002", "3454", "3412", 1000, 1000);
    modifyPositionID(404, "800234543413", "8002", "3454", "3412", 1000, 1000);
    modifyPosition(422, "800234543412", "8002", "3454", "3412", 1000, 1000);
    modifyPosition(404, "800234543413", "8002", "3454", "3412", 1000, 1000);

    deletePosition(422, "80023454341", "8002", "3454", "3412", 1000, 1000);
});

function deleteAllPosition(expectedHTTPStatus) {
    it('Deleting data', function (done) {
        agent.delete('/api/deleteAllPosition')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function getPositions(expectedHTTPStatus, positionID, aisleID, row, col, maxWeight, maxVolume) {
    it('getting Positions', function (done) {
        let Position = { positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume}
        agent.post('/api/position')
            .send(Position)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/positions')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body[0].positionID.should.equal(positionID);
                        r.body[0].aisleID.should.equal(aisleID);
                        r.body[0].row.should.equal(row);
                        r.body[0].maxWeight.should.equal(maxWeight);
                        r.body[0].maxVolume.should.equal(maxVolume);
                        r.body[0].occupiedWeight.should.equal(0);
                        r.body[0].occupiedVolume.should.equal(0);
                        done();
                    });
            });
    });
}

function modifyPositionID(expectedHTTPStatus, positionID, aisleID, row, col, maxWeight, maxVolume) {
    it('modify PositionID', function (done) {
        if(expectedHTTPStatus === 200){
            let Position = { positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume}
            agent.post('/api/position')
                .send(Position)
                .then(function (res) {
                    res.should.have.status(201);
                    let newPositiondata = { newPositionID: "800334543422"}
                        agent.put(`/api/position/${positionID}/changeID`)
                        .send(newPositiondata)
                        .then(function (res) {
                            res.should.have.status(200);
                            agent.get('/api/positions')
                            .then(function (r) {
                                r.should.have.status(expectedHTTPStatus);
                                r.body[0].positionID.should.equal(newPositiondata.newPositionID);
                                r.body[0].aisleID.should.equal("8003");
                                r.body[0].row.should.equal("3454");
                                r.body[0].col.should.equal("3422");
                                r.body[0].maxWeight.should.equal(maxWeight);
                                r.body[0].maxVolume.should.equal(maxVolume);
                                r.body[0].occupiedWeight.should.equal(0);
                                r.body[0].occupiedVolume.should.equal(0);
                                done();
                    });
                });
            });
        }
        else if (expectedHTTPStatus === 422) {
            let Position = { positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume}
            agent.post('/api/position')
                .send(Position)
                .then(function (res) {
                    res.should.have.status(201);
                    let newPositiondata = { newPositionID: "80033454342t"}
                        agent.put(`/api/position/${positionID}/changeID`)
                        .send(newPositiondata)
                        .then(function (res) {
                            res.should.have.status(422);
                            res.body.error.should.equal("Invalid newPositionID format");
                            done();
                    });
            });
        } else if (expectedHTTPStatus === 404) {
            let Position = { positionID: "800234543412", aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume}
            agent.post('/api/position')
                .send(Position)
                .then(function (res) {
                    res.should.have.status(201);
                    let newPositiondata = { newPositionID: "800334543421"}
                        agent.put(`/api/position/${positionID}/changeID`)
                        .send(newPositiondata)
                        .then(function (res) {
                            res.should.have.status(404);
                            res.body.error.should.equal("no position associated to positionID");
                            done();
                    });
            });
        }
    });
}

function modifyPosition(expectedHTTPStatus, positionID, aisleID, row, col, maxWeight, maxVolume) {
    it('modify Position', function (done) {
        if(expectedHTTPStatus === 200){
            let Position = { positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume}
            agent.post('/api/position')
                .send(Position)
                .then(function (res) {
                    res.should.have.status(201);
                    let newPositiondata = { newAisleID: "9999", newRow: "6666", newCol: "3333", newMaxWeight: 1200, newMaxVolume: 600, newOccupiedWeight: 200, newOccupiedVolume: 100}
                        agent.put(`/api/position/${positionID}`)
                        .send(newPositiondata)
                        .then(function (res) {
                            res.should.have.status(200);
                            agent.get('/api/positions')
                            .then(function (r) {
                                r.should.have.status(expectedHTTPStatus);
                                r.body[0].positionID.should.equal('999966663333');
                                r.body[0].aisleID.should.equal(newPositiondata.newAisleID);
                                r.body[0].row.should.equal(newPositiondata.newRow);
                                r.body[0].col.should.equal(newPositiondata.newCol);
                                r.body[0].maxWeight.should.equal(newPositiondata.newMaxWeight);
                                r.body[0].maxVolume.should.equal(newPositiondata.newMaxVolume);
                                r.body[0].occupiedWeight.should.equal(newPositiondata.newOccupiedWeight);
                                r.body[0].occupiedVolume.should.equal(newPositiondata.newOccupiedVolume);
                                done();
                    });
                });
            });
        }
        else if (expectedHTTPStatus === 422) {
            let Position = { positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume}
            agent.post('/api/position')
                .send(Position)
                .then(function (res) {
                    res.should.have.status(201);
                    let newPositiondata = { newAisleID: "999t", newRow: "6666", newCol: "3333", newMaxWeight: 1200, newMaxVolume: 600, newOccupiedWeight: 200, newOccupiedVolume: 100}
                        agent.put(`/api/position/${positionID}`)
                        .send(newPositiondata)
                        .then(function (res) {
                            res.should.have.status(422);
                            res.body.error.should.equal("Invalid newAisleID format");
                            done();
                    });
            });
        } else if (expectedHTTPStatus === 404) {
            let Position = { positionID: "800234543412", aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume}
            agent.post('/api/position')
                .send(Position)
                .then(function (res) {
                    res.should.have.status(201);
                    let newPositiondata = { newAisleID: "9999", newRow: "6666", newCol: "3333", newMaxWeight: 1200, newMaxVolume: 600, newOccupiedWeight: 200, newOccupiedVolume: 100}
                        agent.put(`/api/position/${positionID}`)
                        .send(newPositiondata)
                        .then(function (res) {
                            res.should.have.status(404);
                            res.body.error.should.equal("no position associated to positionID");
                            done();
                    });
            });
        }
    });
}

function createPosition(expectedHTTPStatus, positionID, aisleID, row, col, maxWeight, maxVolume) {
    it('adding a new Position', function (done) {
        if (positionID.length !== 12 || maxWeight < 0 || maxVolume < 0 || !(positionID.match(/^[0-9]+$/) != null)) {
            let Position = { positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume}
            agent.post('/api/position')
                .send(Position)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            let Position = { positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume}
            agent.post('/api/position')
                .send(Position)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function deletePosition(expectedHTTPStatus, positionID, aisleID, row, col, maxWeight, maxVolume) {
    it('delete Position', function (done) {
        if (expectedHTTPStatus === 204) {
            let Position = { positionID: "800234543412", aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume}
            agent.post('/api/position')
                .send(Position)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete(`/api/position/${positionID}`)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done();
                        });
                })
        } else if (positionID.length !== 12) {
            let Position = { positionID: "800234543412", aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume}
            agent.post('/api/position')
                .send(Position)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete(`/api/position/${positionID}`)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done();
                        });

                })

        }
    });
}


describe('test Item apis', () => {

    beforeEach(async () => {
        await agent.delete('/api/deleteAllItem');
        await agent.delete('/api/deleteSKUTable');
        await agent.post('/api/sku')
        .send(SKU)
    })

    deleteAllItem(204);

    // <----- HAPPY CASE ----->
    //GET
    getItems(200, 12, "a new item", 10.99, 1, 2)
    getItem(200, 12, "a new item", 10.99, 1, 2)

    // // POST
    createItem(201, 3, "a new item", 10.1, 1, 2);


    // // PUT - DEL
    modifyItem(200, 1, "a new item", 10, 1, 2);
    deleteItem(204, 2, "a new item", 10.99, 1, 2);

    // // <----- WRONG CASE ----->
    createItem(422, -2, "a new item", 10, 1, 2);
    createItem(422, 23, "a new item", -6, 1, 2);
    createItem(422, 1, "a new item", 10.1, 1, 2);
    
    modifyItem(422, 1, "a new item", 10, 1, 2);
    modifyItem(404, 1, "a new item", 10, 1, 2);

    getItem(404, 12, "a new item", 10.99, 1, 2)
    getItem(422, -1, "a new item", 10.99, 1, 2)
    deleteItem(422, -3, "a new item", 10.99, 1, 2);
});

function deleteAllItem(expectedHTTPStatus) {
    it('Deleting data', function (done) {
        agent.delete('/api/deleteAllItem')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

    
function getItems(expectedHTTPStatus, id, description, price, SKUId, supplierId) {
    it('getting Items', function (done) {
        let Item = { id: id, description: description, SKUId: SKUId, price: price, supplierId: supplierId}
        agent.post('/api/item')
            .send(Item)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/items')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body[0].id.should.equal(id);
                        r.body[0].description.should.equal(description);
                        r.body[0].price.should.equal(price);
                        r.body[0].SKUId.should.equal(SKUId);
                        r.body[0].supplierId.should.equal(supplierId);
                        done();
                    });
            });
    });
}

function getItem(expectedHTTPStatus, id, description, price, SKUId, supplierId) {
    it('getting Item', function (done) {
        if(expectedHTTPStatus === 200){
            let Item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId}
            agent.post('/api/item')
                .send(Item)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get(`/api/items/${id}`)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            r.body[0].id.should.equal(id);
                            r.body[0].description.should.equal(description);
                            r.body[0].price.should.equal(price);
                            r.body[0].SKUId.should.equal(SKUId);
                            r.body[0].supplierId.should.equal(supplierId);
                            done();
                    });
            });
        }
        else if (expectedHTTPStatus === 404){
            agent.get(`/api/skuitems/${id}`)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    res.body.error.should.equal("not found");
                    done();
                });
        }
        else {
            let Item = { id: 12, description: description, SKUId: SKUId, price: price, supplierId: supplierId}
            agent.post('/api/item')
                .send(Item)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get(`/api/items/${id}`)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            r.body.error.should.equal("Invalid id");
                            done();
                        });
                });
            }
    });
}

function modifyItem(expectedHTTPStatus, id, description, price, SKUId, supplierId) {
    it('modify Item', function (done) {
        if(expectedHTTPStatus === 200){
            let Item = { id: id, description: description, SKUId: SKUId, price: price, supplierId: supplierId}
            agent.post('/api/item')
                .send(Item)
                .then(function (res) {
                    res.should.have.status(201);
                    let newItemdata = { newDescription: "a new sku", newPrice: 10.99}
                        agent.put(`/api/item/${id}`)
                        .send(newItemdata)
                        .then(function (res) {
                            res.should.have.status(200);
                            agent.get('/api/items')
                            .then(function (r) {                             
                                r.should.have.status(200);
                                r.body[0].id.should.equal(id);
                                r.body[0].description.should.equal(newItemdata.newDescription);
                                r.body[0].price.should.equal(newItemdata.newPrice);
                                r.body[0].SKUId.should.equal(SKUId);
                                r.body[0].supplierId.should.equal(supplierId);
                                done();
                    });
                });
            });
        }
        else if (expectedHTTPStatus === 422) {
            let Item = { id: id, description: description, SKUId: SKUId, price: price, supplierId: supplierId}
            agent.post('/api/item')
                .send(Item)
                .then(function (res) {
                    res.should.have.status(201);
                    let newItemdata = { newDescription: "a new sku", newPrice: -9}
                        agent.put(`/api/item/${id}`)
                        .send(newItemdata)
                        .then(function (res) {
                            res.should.have.status(422);
                            res.body.error.should.equal("Invalid newPrice");
                            done();
                    });
            });
        } else if (expectedHTTPStatus === 404) {
            let Item = { id: 3, description: description, SKUId: SKUId, price: price, supplierId: supplierId}
            agent.post('/api/item')
                .send(Item)
                .then(function (res) {
                    res.should.have.status(201);
                    let newItemdata = { newDescription: "a new sku", newPrice: 10.99}
                        agent.put(`/api/item/${id}`)
                        .send(newItemdata)
                        .then(function (res) {
                            res.should.have.status(404);
                            res.body.error.should.equal("no Item associated to id");
                            done();
                    });
            });
        }
    });
}

function createItem(expectedHTTPStatus, id, description, price, SKUId, supplierId) {
    it('adding a new Item', function (done) {
        if (price < 0 || SKUId < 0 || id < 0 || supplierId < 0) {
            let Item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId}
            agent.post('/api/item')
                .send(Item)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else if (expectedHTTPStatus === 201) {
            let Item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId}
            agent.post('/api/item')
                .send(Item)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get('/api/items')
                        .then(function (r) {
                            r.body[0].id.should.equal(id);
                            r.body[0].description.should.equal(description);
                            r.body[0].price.should.equal(price);
                            r.body[0].SKUId.should.equal(SKUId);
                            r.body[0].supplierId.should.equal(supplierId);
                            done();
                    });
                });
            
        } else if (expectedHTTPStatus === 422){
            let Item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId}
            agent.post('/api/item')
                .send(Item)
                .then(function (res) {
                    res.should.have.status(201);
                    let Item2 = { id: 2, description: description, price: price, SKUId: SKUId, supplierId: supplierId}
                    agent.post('/api/item')
                        .send(Item2)
                        .then(function (res) {
                            res.should.have.status(422);
                            res.body.error.should.equal('supplier already sells an item with the same SKUId or same ID');
                            done();
                });
            });

        }

    });
}

function deleteItem(expectedHTTPStatus, id, description, price, SKUId, supplierId) {
    it('delete Item', function (done) {
        if (expectedHTTPStatus === 204) {
            let Item = { id: id, description: description, SKUId: SKUId, price: price, supplierId: supplierId};
            agent.post('/api/item')
            .send(Item)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete(`/api/items/${id}`)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done();
                        });
                })
        } 
        else if (id < 0) {
            let Item = { id: 12, description: description, SKUId: SKUId, price: price, supplierId: supplierId}
            agent.post('/api/item')
            .send(Item)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.delete(`/api/items/${id}`)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            res.body.error.should.equal("Invalid id");
                            done();
                        });

                })
        }
    });
}

