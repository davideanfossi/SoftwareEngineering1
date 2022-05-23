const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test user apis', () => {

    beforeEach(async () => {
        await agent.delete('/api/allUsers');
    })

    deleteAllData(204);

    // <----- HAPPY CASE ----->
    // SE NON SI "ABILITA" L'INSERIMENTO DEL MANAGER IN NEW USER ALCUNI NON FUNZIONANO (GIUSTAMENTE)
    // GET
    getSuppliers(200, 'john.snow@supplier.ezwh.com', 'John', "Snow", "ciao1234", "supplier")
    getUsers(200, 'john.snow@supplier.ezwh.com', 'John', "Snow", "ciao1234", "customer")

    // POST
    newUser(201, 'john.snow@supplier.ezwh.com', 'John', "Snow", "ciao1234", "supplier");
    managerSession(200, 'john.snow@supplier.ezwh.com', 'John', "Snow", "ciao1234", "manager")
    customerSession(200, 'john.snow@supplier.ezwh.com', 'John', "Snow", "ciao1234", "customer")
    supplierSession(200, 'john.snow@supplier.ezwh.com', 'John', "Snow", "ciao1234", "supplier")
    clerkSession(200, 'john.snow@supplier.ezwh.com', 'John', "Snow", "ciao1234", "clerk")
    qualityEmployeeSession(200, 'john.snow@supplier.ezwh.com', 'John', "Snow", "ciao1234", "qualityEmployee")
    deliveryEmployeeSession(200, 'john.snow@supplier.ezwh.com', 'John', "Snow", "ciao1234", "deliveryEmployee")

    // PUT - DEL
    updateUserType(200, 'john.snow@supplier.ezwh.com', 'John', "Snow", "ciao1234", "deliveryEmployee", "clerk")
    deleteUser(204, 'john.snow@supplier.ezwh.com', 'John', "Snow", "ciao1234", "deliveryEmployee")

    // <----- WRONG CASE ----->
    newUser(422, 'john.snow@supplier.ezwh.com', 'John', "Snow", "ciao1234", "manager");
    newUser(422, 'john.snow@supplier.ezwh.com', 'John', "Snow", "ciao", "customer");
    newUser(409, 'john.snow@supplier.ezwh.com', 'John', "Snow", "ciao1234", "customer");

    updateUserType(404, 'john.snow@supplier.ezwh', 'John', "Snow", "ciao1234", "supplier", "clerk")
    updateUserType(404, 'john.snow@supplier.ezwh.com', 'John', "Snow", "ciao1234", "clerk", "deliveryEmployee")
    updateUserType(422, 'john.snow@supplier.ezwh.com', 'John', "Snow", "ciao1234", "manager", "clerk")

    deleteUser(422, 'john.snow@supplier.ezwh.com', 'John', "Snow", "ciao1234", "manager")
    deleteUser(404, 'john.snow@supplier.ezwh', 'John', "Snow", "ciao1234", "supplier")
    deleteUser(404, 'john.snow@supplier.ezwh.com', 'John', "Snow", "ciao1234", "customer")


});

function deleteAllData(expectedHTTPStatus) {
    it('Deleting data', function (done) {
        agent.delete('/api/allUsers')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}


function getSuppliers(expectedHTTPStatus, username, name, surname, password, type) {
    it('getting supplier data from the system', function (done) {
        let user = { username: username, name: name, surname: surname, password: password, type: type }
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/suppliers')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);


                        r.body[0].name.should.equal(name);
                        r.body[0].surname.should.equal(surname);
                        r.body[0].email.should.equal(username);

                        done();
                    });
            });
    });
}

function getUsers(expectedHTTPStatus, username, name, surname, password, type) {
    it('getting users data from the system', function (done) {
        let user = { username: username, name: name, surname: surname, password: password, type: type }
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/users')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);


                        r.body[0].name.should.equal(name);
                        r.body[0].surname.should.equal(surname);
                        r.body[0].email.should.equal(username);
                        r.body[0].type.should.equal(type);


                        done();
                    });
            });
    });
}

function newUser(expectedHTTPStatus, username, name, surname, password, type) {
    it('adding a new user', function (done) {
        if (expectedHTTPStatus === 409) {

            let user = { username: username, name: name, surname: surname, password: password, type: type }
            agent.post('/api/newUser')
                .send(user)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.post('/api/newUser')
                        .send(user)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done();
                        });

                });
        }
        else if (username !== undefined) {
            let user = { username: username, name: name, surname: surname, password: password, type: type }
            agent.post('/api/newUser')
                .send(user)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/newUser') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function managerSession(expectedHTTPStatus, username, name, surname, password, type) {
    it('manager session', function (done) {
        if (username !== undefined) {
            let user = { username: username, name: name, surname: surname, password: password, type: type }
            agent.post('/api/newUser')
                .send(user)
                .then(function (res) {
                    res.should.have.status(201);
                    let credentials = { credentials: { username: username, password: password } }
                    agent.post('/api/managerSessions')
                        .send(credentials)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);


                            res.body.username.should.equal(username);
                            res.body.name.should.equal(name);

                            done();
                        });
                })

        } else {
            agent.post('/api/managerSessions') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function customerSession(expectedHTTPStatus, username, name, surname, password, type) {
    it('customer session', function (done) {
        if (username !== undefined) {
            let user = { username: username, name: name, surname: surname, password: password, type: type }
            agent.post('/api/newUser')
                .send(user)
                .then(function (res) {
                    res.should.have.status(201);
                    let credentials = { credentials: { username: username, password: password } }
                    agent.post('/api/customerSessions')
                        .send(credentials)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);


                            res.body.username.should.equal(username);
                            res.body.name.should.equal(name);

                            done();
                        });
                })

        } else {
            agent.post('/api/customerSessions') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function supplierSession(expectedHTTPStatus, username, name, surname, password, type) {
    it('supplier session', function (done) {
        if (username !== undefined) {
            let user = { username: username, name: name, surname: surname, password: password, type: type }
            agent.post('/api/newUser')
                .send(user)
                .then(function (res) {
                    res.should.have.status(201);
                    let credentials = { credentials: { username: username, password: password } }
                    agent.post('/api/supplierSessions')
                        .send(credentials)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);


                            res.body.username.should.equal(username);
                            res.body.name.should.equal(name);

                            done();
                        });
                })

        } else {
            agent.post('/api/supplierSessions') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function clerkSession(expectedHTTPStatus, username, name, surname, password, type) {
    it('clerk session', function (done) {
        if (username !== undefined) {
            let user = { username: username, name: name, surname: surname, password: password, type: type }
            agent.post('/api/newUser')
                .send(user)
                .then(function (res) {
                    res.should.have.status(201);
                    let credentials = { credentials: { username: username, password: password } }
                    agent.post('/api/clerkSessions')
                        .send(credentials)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);


                            res.body.username.should.equal(username);
                            res.body.name.should.equal(name);

                            done();
                        });
                })

        } else {
            agent.post('/api/clerkSessions') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function deliveryEmployeeSession(expectedHTTPStatus, username, name, surname, password, type) {
    it('delivery Employee session', function (done) {
        if (username !== undefined) {
            let user = { username: username, name: name, surname: surname, password: password, type: type }
            agent.post('/api/newUser')
                .send(user)
                .then(function (res) {
                    res.should.have.status(201);
                    let credentials = { credentials: { username: username, password: password } }
                    agent.post('/api/deliveryEmployeeSessions')
                        .send(credentials)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);


                            res.body.username.should.equal(username);
                            res.body.name.should.equal(name);

                            done();
                        });
                })

        } else {
            agent.post('/api/deliveryEmployeeSessions') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function qualityEmployeeSession(expectedHTTPStatus, username, name, surname, password, type) {
    it('quality Employee session', function (done) {
        if (username !== undefined) {
            let user = { username: username, name: name, surname: surname, password: password, type: type }
            agent.post('/api/newUser')
                .send(user)
                .then(function (res) {
                    res.should.have.status(201);
                    let credentials = { credentials: { username: username, password: password } }
                    agent.post('/api/qualityEmployeeSessions')
                        .send(credentials)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);


                            res.body.username.should.equal(username);
                            res.body.name.should.equal(name);

                            done();
                        });
                })

        } else {
            agent.post('/api/qualityEmployeeSessions') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}


function updateUserType(expectedHTTPStatus, username, name, surname, password, type, newType) {
    it('changing type', function (done) {

        if (expectedHTTPStatus != 200) {

            let user = { username: 'john.snow@supplier.ezwh.com', name: 'John', surname: "Snow", password: "ciao1234", type: "supplier" }

            agent.post('/api/newUser')
                .send(user)
                .then(function (res) {
                    res.should.have.status(201);
                    let changing = { oldType: type, newType: newType }
                    agent.put(`/api/users/${username}`)
                        .send(changing)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done();
                        });

                })
        } else if (username !== undefined) {
            let user = { username: username, name: name, surname: surname, password: password, type: type }

            agent.post('/api/newUser')
                .send(user)
                .then(function (res) {
                    res.should.have.status(201);
                    let changing = { oldType: type, newType: newType }
                    agent.put(`/api/users/${username}`)
                        .send(changing)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done();
                        });

                })

        }
    });
}

function deleteUser(expectedHTTPStatus, username, name, surname, password, type) {
    it('delete user', function (done) {

        if (expectedHTTPStatus != 204) {

            let user = { username: 'john.snow@supplier.ezwh.com', name: 'John', surname: "Snow", password: "ciao1234", type: "supplier" }
            agent.post('/api/newUser')
                .send(user)
                .then(function (res) {
                    res.should.have.status(201);

                    agent.delete(`/api/users/${username}/${type}`)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done();
                        });

                })
        } else if (username !== undefined) {
            let user = { username: username, name: name, surname: surname, password: password, type: type }

            agent.post('/api/newUser')
                .send(user)
                .then(function (res) {
                    res.should.have.status(201);

                    agent.delete(`/api/users/${username}/${type}`)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done();
                        });

                })

        }
    });
}