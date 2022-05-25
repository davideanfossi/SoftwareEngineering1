class TestService {

    constructor(dao) {
        this.dao = dao;
    }

    getTestDescriptors = async () => {
        const rows = await this.dao.getTestDescriptors();
        const TestDescriptors = rows.map((r) => (
            {
                id: r.ID,
                name: r.NAME,
                procedureDescription: r.PROCEDURE_DESCRIPTION,
                idSKU : r.ID_SKU
            }
        ));
        
        return(TestDescriptors);        
    }

    getTestDescriptor = async (id) => {
        const rows = await this.dao.getTestDescriptor(id);
        const TestDescriptor = rows.map((r) => (
            {
                id: r.ID,
                name: r.NAME,
                procedureDescription: r.PROCEDURE_DESCRIPTION,
                idSKU : r.ID_SKU
            }
        ));
        
        return(TestDescriptor);        
    }

    checkTestDescriptor = async (data) => {
        const res = await this.dao.checkTestDescriptor(data);
        return res;
    }

    createTestDescriptor = async (data) => {
        const res = await this.dao.createTestDescriptor(data);
        return res;
    }

    modifyTestDescriptor = async (id, newTestDescriptor) => {
        const res = await this.dao.modifyTestDescriptor(id, newTestDescriptor);
        return res;
    }

    deleteTestDescriptor = async (id) => {
        const res = await this.dao.deleteTestDescriptor(id);
        return res;
    }

    // -----------------------------------------------------------

    getTestResults = async (rfid) => {
        const rows = await this.dao.getTestResults(rfid);
        if (rows.length < 1) throw {error: "not found", code:404};
        const testResults = rows.map((r) => (
            {
                id: r.ID,
                idTestDescriptor: r.ID_TEST_DESCRIPTOR,
                Date: r.DATE,
                Result : r.RESULT
            }
        ));
        
        return(testResults);        
    }

    getTestResult = async (rfid, id) => {
        const rows = await this.dao.getTestResults(rfid, id);
        if (rows.length < 1) throw {error: "not found", code:404};
        const testResult = rows.map((r) => (
            {
                id: r.ID,
                idTestDescriptor: r.ID_TEST_DESCRIPTOR,
                Date: r.DATE,
                Result : r.RESULT
            }
        ));
        
        return(testResult);        
    }

    checkRfid = async (rfid) => {
        const res = await this.dao.checkRfid(rfid);
        return res;
    }

    checkTestResult = async (data) => {
        const res = await this.dao.checkTestResult(data);
        return res;
    }

    createTestResult = async (data) => {
        const lastId = await this.dao.createTestResult(data);
        return lastId;
    }

    modifyTestResult = async (rfid, id, testResult) => {
        const res = await this.dao.modifyTestResult(rfid, id, testResult);
        return res;
    }

    deleteTestResult = async (rfid, id) => {
        const res = await this.dao.deleteTestResult(id);
        return res;
    }

}

module.exports = TestService;