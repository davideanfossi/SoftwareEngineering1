const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test user apis', () => {

    beforeEach(async () => {
        await agent.delete('/users/allUsers');
    })

    deleteAllData(204);
    /* 
    newUser(201, 'mmz', 'Maurizio', "Morisio", "admin");
    newUser(422);
    getUser(200, 'mmz', 'Maurizio', "Morisio", "admin"); */

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
                res.body.username.should.equal(username);
                agent.get('/api/suppliers')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.id.should.equal(id);
                        r.body.name.should.equal(name);
                        r.body.surname.should.equal(surname);
                        r.body.email.should.equal(email);

                        done();
                    });
            });
    });
}

function getUsers(expectedHTTPStatus,  username, name, surname, password, type) {
    it('getting users data from the system', function (done) {
        let user = { username: username, name: name, surname: surname, password: password, type: type }
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                res.body.username.should.equal(username);
                agent.get('/api/users')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.id.should.equal(id);
                        r.body.name.should.equal(name);
                        r.body.surname.should.equal(surname);
                        r.body.email.should.equal(email);
                        r.body.type.should.equal(type);

                        done();
                    });
            });
    });
}

function newUser(expectedHTTPStatus, username, name, surname, password, type) {
    it('adding a new user', function (done) {
        if (username !== undefined) {
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
            agent.post('/api/managerSessions')
                .send(user)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);

                    res.body.id.should.equal(1);
                    res.body.username.should.equal(username);
                    res.body.name.should.equal(name);

                    done();
                });
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
            agent.post('/api/customerSessions')
                .send(user)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);

                    res.body.id.should.equal(1);
                    res.body.username.should.equal(username);
                    res.body.name.should.equal(name);

                    done();
                });
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
            agent.post('/api/supplierSessions')
                .send(user)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);

                    res.body.id.should.equal(1);
                    res.body.username.should.equal(username);
                    res.body.name.should.equal(name);
                    
                    done();
                });
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
            agent.post('/api/clerkSessions')
                .send(user)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);

                    res.body.id.should.equal(1);
                    res.body.username.should.equal(username);
                    res.body.name.should.equal(name);
                    
                    done();
                });
        } else {
            agent.post('/api/clerkSessions') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function qualityEmplyeeSession(expectedHTTPStatus, username, name, surname, password, type) {
    it('quality employee session', function (done) {
        if (username !== undefined) {
            let user = { username: username, name: name, surname: surname, password: password, type: type }
            agent.post('/api/qualityEmployeeSessions')
                .send(user)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);

                    res.body.id.should.equal(1);
                    res.body.username.should.equal(username);
                    res.body.name.should.equal(name);
                    
                    done();
                });
        } else {
            agent.post('/api/qualityEmployeeSessions') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function deliveryEmployeeSession(expectedHTTPStatus, username, name, surname, password, type) {
    it('delivery employee session', function (done) {
        if (username !== undefined) {
            let user = { username: username, name: name, surname: surname, password: password, type: type }
            agent.post('/api/deliveryEmplyeeSessions')
                .send(user)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);

                    res.body.id.should.equal(1);
                    res.body.username.should.equal(username);
                    res.body.name.should.equal(name);
                    
                    done();
                });
        } else {
            agent.post('/api/deliveryEmplyeeSessions') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function updateUserType(expectedHTTPStatus, username, oldType, newType) {
    it('changing type', function (done) {
        if (username !== undefined) {
            let user = { oldType: oldType, newType: newType }
            agent.put(`/api/users/${username}`)
                .send(user)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);

                    res.body.id.should.equal(1);
                    res.body.username.should.equal(username);
                    res.body.name.should.equal(name);
                    
                    done();
                });
        }
    });
}