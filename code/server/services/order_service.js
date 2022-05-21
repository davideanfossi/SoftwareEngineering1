const dayjs = require('dayjs')

class OrderService {

    constructor(dao) {
        this.dao = dao;
    }

// <------------------------- RESTOCK ORDERS -------------------------------->


    getRestockOrders = async () => {
        try {
            const orders = await this.dao.getRestockOrders();
            const orderDTO = orders.map((r) => (
                {
                    id: r.ID,
                    issueDate: r.ISSUEDATE,
                    state: r.STATE,
                    products: JSON.parse(r.PRODUCTS),
                    supplierID: r.SUPPLIERID,
                    transportNote: JSON.parse(r.TRANSPORTNOTE),
                    skuItems: JSON.parse(r.SKUITEMS)
                }
            ));
            return orderDTO;
        } catch (error) {
            return error
        }
    }

    getIssuedRestockOrders = async () => {
        try {
            const orders = await this.dao.getIssuedRestockOrders();
            const orderDTO = orders.map((r) => (
                {
                    id: r.ID,
                    issueDate: r.ISSUEDATE,
                    state: r.STATE,
                    products: JSON.parse(r.PRODUCTS),
                    supplierID: r.SUPPLIERID,
                    transportNote: JSON.parse(r.TRANSPORTNOTE),
                    skuItems: JSON.parse(r.SKUITEMS)
                }
            ));
            return orderDTO;
        } catch (error) {
            return error
        }

    }

    getRestockOrder = async (id) => {
        if(Number.isInteger(id)){
            throw {error:"Id is not an integer number number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        try {
            const orders = await this.dao.getRestockOrder(id);
            const orderDTO = orders.map((r) => (
                {
                    id: r.ID,
                    issueDate: r.ISSUEDATE,
                    state: r.STATE,
                    products: JSON.parse(r.PRODUCTS),
                    supplierID: r.SUPPLIERID,
                    transportNote: JSON.parse(r.TRANSPORTNOTE),
                    skuItems: JSON.parse(r.SKUITEMS)
                }
            ));
            return orderDTO;
        } catch (error) {
            return error
        }
    }

    getSkuItemsByRestockOrder = async (id) => {
        if(Number.isInteger(id)){
            throw {error:"Id is not an integer number number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        try {
            const orders = await this.dao.getRestockOrder(id);
            orders.map((order)=>{
                if(order.state != 'COMPLETEDRETURN'){
                    throw {error: 'validation of id failed or restock order state != COMPLETEDRETURN', code: 422};
                }
            });
            const items = await this.dao.getSkuItemsByRestockOrder(id);
            const itemsDTO = items.map((r) => (
                {
                    SKUId: r.SKUId,
                    rfid: r.rfid,
                }
            ));
            return itemsDTO;
        } catch (error) {
            return error
        }
    }

    newTableRestockOrder = async () => {
        try {
            await this.dao.newTableRestockOrder();
            return ;
        } catch (error) {
            return error
        }
    }

    newRestockOrder = async (body) => {
        if (body === undefined || body.issueDate === undefined || body.products === undefined || body.supplierId === undefined) {
            throw {error: `Invalid body data`, code:422};
        }
        const date = dayjs(body.issueDate).format('YYYY/MM/DD HH:MM') 
        if(!dayjs(date).isValid()){
            throw {error: "Invalid date!", code:422};
        }
        if(!Number.isInteger(body.supplierId)){
            throw {error: "Invalid supplierId!", code:422};
        }
        try {
            await this.dao.newRestockOrder(body);
            return ;
        } catch (error) {
            return error
        }
    }

    modifyRestockOrderState = async (id, body) => {
        if(Number.isInteger(id)){
            throw {error:"Id is not an integer number number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        if (body === undefined || body.newState === undefined) {
            throw { error: `Invalid body data`, code:422};
        }
        try {
            await this.dao.modifyRestockOrderState(id, body.newState);
            return;
        } catch (error) {
            return error
        }
    }

    modifyRestockOrderSKUs = async (id, body) => {
        if(Number.isInteger(id)){
            throw {error:"Id is not an integer number number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        if (body === undefined || body.skuItems === undefined) {
            throw { error: `Invalid body data`, code:422};
        }
        if (body.skuItems.length<1){
            return { error: `Array must not be empty`, code:422};
        }
        try {
            await this.dao.modifyRestockOrderSKUs(id, body.skuItems);
            return;
        } catch (error) {
            return error
        }
    }

    modifyRestockOrderNote = async (id, body) => {
        if(Number.isInteger(id)){
            throw {error:"Id is not an integer number number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        if (body === undefined || body.transportNote === undefined) {
            throw { error: `Invalid body data`, code:422};
        }
        try {
            await this.dao.modifyRestockOrderNote(id, body.transportNote);
            return;
        } catch (error) {
            return error
        }
    }

    deleteRestockOrder = async (id) => {
        if(Number.isInteger(id)){
            throw {error:"Id is not an integer number number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        try {
            await this.dao.deleteRestockOrder(id);
            return;
        } catch (error) {
            return error
        }
    }

//<--------------------------RETURN ORDER-------------------------------------------------------------->

    getReturnOrders = async () => {
        try {
            const orders = await this.dao.getReturnOrders();
            const orderDTO = orders.map((r) => (
                {
                    id: r.ID,
                    returnDate: r.ISSUEDATE,
                    products: JSON.parse(r.PRODUCTS),
                    restockOrderId: r.SUPPLIERID,
                }
            ));
            return orderDTO;
        } catch (error) {
            return error
        }
    }

    getReturnOrder = async (id) => {
        if(Number.isInteger(id)){
            throw {error:"Id is not an integer number number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        try {
            const orders = await this.dao.getReturnOrder(id);
            const orderDTO = orders.map((r) => (
                {
                    id: r.ID,
                    returnDate: r.ISSUEDATE,
                    products: JSON.parse(r.PRODUCTS),
                    restockOrderId: r.SUPPLIERID,
                }
            ));
            return orderDTO;
        } catch (error) {
            return error
        }
    }

    newTableReturnOrder = async () => {
        try {
            await this.dao.newTableReturnOrder();
            return ;
        } catch (error) {
            return error
        }
    }

    newReturnOrder = async (body) => {
        if (body === undefined || body.returnDate === undefined || body.products === undefined || body.restockOrderId === undefined) {
            throw { error: `Invalid body data`, error:422};
        }
        const date = dayjs(body.issueDate).format('YYYY/MM/DD HH:MM') 
        if(!dayjs(date).isValid()){
            throw {error: "Invalid date!", code:422};
        }
        if(!Number.isInteger(body.restockOrderId)){
            throw {error: "Invalid restockOrderId!", code:422};
        }
        try {
            await this.dao.newReturnOrder(body);
            return ;
        } catch (error) {
            return error
        }
    }

    deleteReturnOrder = async (id) => {
        if(Number.isInteger(id)){
            throw {error:"Id is not an integer number number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        try {
            await this.dao.deleteReturnOrder(id);
            return;
        } catch (error) {
            return error
        }
    }

    // <------------------------------------------------- INTERNAL ORDER ------------------------------->

    getInternalOrders = async () => {
        try {
            const orders = await this.dao.getInternalOrders();
            const orderDTO = orders.map((r) => (
                {
                    id: r.ID,
                    issueDate: r.ISSUEDATE,
                    state: r.STATE,
                    products: JSON.parse(r.PRODUCTS),
                    supplierID: r.CUSTOMERID
                }
            ));
            return orderDTO;
        } catch (error) {
            return error
        }
    }

    getInternalOrdersIssued = async () => {
        try {
            const orders = await this.dao.getInternalOrdersIssued();
            const orderDTO = orders.map((r) => (
                {
                    id: r.ID,
                    issueDate: r.ISSUEDATE,
                    state: r.STATE,
                    products: JSON.parse(r.PRODUCTS),
                    supplierID: r.CUSTOMERID
                }
            ));
            return orderDTO;
        } catch (error) {
            return error
        }
    }

    getInternalOrdersAccepted = async () => {
        try {
            const orders = await this.dao.getInternalOrdersAccepted();
            const orderDTO = orders.map((r) => (
                {
                    id: r.ID,
                    issueDate: r.ISSUEDATE,
                    state: r.STATE,
                    products: JSON.parse(r.PRODUCTS),
                    supplierID: r.CUSTOMERID
                }
            ));
            return orderDTO;
        } catch (error) {
            return error
        }
    }

    getInternalOrder = async (id) => {
        if(Number.isInteger(id)){
            throw {error:"Id is not an integer number number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        try {
            const orders = await this.dao.getInternalOrder(id);
            const orderDTO = orders.map((r) => (
                {
                    id: r.ID,
                    issueDate: r.ISSUEDATE,
                    state: r.STATE,
                    products: JSON.parse(r.PRODUCTS),
                    supplierID: r.CUSTOMERID
                }
            ));
            return orderDTO;
        } catch (error) {
            return error
        }
    }

    newTableInternalOrder = async () => {
        try {
            await this.dao.newTableInternalOrder();
            return ;
        } catch (error) {
            return error
        }
    }

    newInternalOrder = async (body) => {
        if (body === undefined || body.issueDate === undefined || body.products === undefined || body.customerId === undefined) {
            throw { error: `Invalid body data`, code:422};
        }
        const date = dayjs(body.issueDate).format('YYYY/MM/DD HH:MM') 
        if(!dayjs(date).isValid()){
            throw {error: "Invalid date!", code:422};
        }
        if(!Number.isInteger(body.customerId)){
            throw {error: "Invalid customerId!", code:422};
        }
        try {
            await this.dao.newInternalOrder(body);
            return ;
        } catch (error) {
            return error
        }
    }

    modifyInternalOrder = async (id, body) => {
        if(Number.isInteger(id)){
            throw {error:"Id is not an integer number number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        if (body === undefined || body.newState === undefined) {
            throw { error: `Invalid body data` };
        }
        let products = []
        if (body.products !== undefined) {
            products = body.products
        }else{
            throw { error: `Missing products`, code:422 }
        }
        try {
            await this.dao.modifyInternalOrder(id, state, products);
            return;
        } catch (error) {
            return error
        }
    }

    deleteInternalOrder = async (id) => {
        if(Number.isInteger(id)){
            throw {error:"Id is not an integer number number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        try {
            await this.dao.deleteInternalOrder(id);
            return;
        } catch (error) {
            return error
        }
    }

}

module.exports = OrderService;