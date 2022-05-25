const dayjs = require('dayjs')

class OrderService {

    constructor(dao) {
        this.dao = dao;
    }

// <------------------------- RESTOCK ORDERS -------------------------------->


    getRestockOrders = async () => {
        try {
            const orders = await this.dao.getRestockOrders();
            return orders;
        } catch (error) {
            throw error
        }
    }

    getIssuedRestockOrders = async () => {
        try {
            const orders = await this.dao.getIssuedRestockOrders();
            return orders;
        } catch (error) {
            throw error
        }

    }

    getRestockOrder = async (id) => {
        if(Number.isNaN(parseInt(id))){
            throw {error:"Id is not a number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        try {
            const orders = await this.dao.getRestockOrder(id);
            const orderDTO = orders[0];
            return orderDTO;
        } catch (error) {
            throw error
        }
    }

    getSkuItemsByRestockOrder = async (id) => {
        if(Number.isNaN(parseInt(id))){
            throw {error:"Id is not a number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        try {
            const orders = await this.dao.getRestockOrder(id);
            if(orders.length<1){
                throw {error: 'Restock order with given id not found', code: 404};
            }
            orders.map((order)=>{
                if(order.state != 'COMPLETEDRETURN'){
                    throw {error: 'Restock order state is not COMPLETEDRETURN', code: 422};
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
            throw error
        }
    }

    newTableRestockOrder = async () => {
        try {
            await this.dao.newTableRestockOrder();
            return ;
        } catch (error) {
            throw error
        }
    }

    newRestockOrder = async (body) => {
        if (body === undefined || body.issueDate === undefined || body.products === undefined || body.supplierId === undefined) {
            throw {error: `Invalid body data`, code:422};
        }
        const date = dayjs(body.issueDate).format('YYYY/MM/DD HH:mm') 
        if(!dayjs(date).isValid()){
            throw {error: "Invalid date!", code:422};
        }
        if(Number.isNaN(body.supplierId)){
            throw {error: "Invalid supplierId!", code:422};
        }
        try {
            await this.dao.newRestockOrder(body);
            return ;
        } catch (error) {
            throw error
        }
    }

    modifyRestockOrderState = async (id, body) => {
        if(Number.isNaN(parseInt(id))){
            throw {error:"Id is not a number number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        if (body === undefined || body.newState === undefined) {
            throw { error: `Invalid body data`, code:422};
        }
        const states = ['ISSUED', 'DELIVERY', 'DELIVERED', 'TESTED', 'COMPLETEDRETURN', 'COMPLETED']
        if(!states.includes(body.newState.toUpperCase())){
            throw {error: `Invalid state`, code:422};
        }
        try {
            await this.dao.modifyRestockOrderState(id, body.newState);
            return;
        } catch (error) {
            throw error
        }
    }

    modifyRestockOrderSKUs = async (id, body) => {
        if(Number.isNaN(parseInt(id))){
            throw {error:"Id is not a number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        if (body === undefined || body.skuItems === undefined) {
            throw { error: `Invalid body data`, code:422};
        }
        if (body.skuItems.length<1){
            throw { error: `Array must not be empty`, code:422};
        }
        const orders = await this.dao.getRestockOrder(id);
        if(orders.length<1){
            throw {error: 'Restock order with given id not found', code: 404};
        }
        orders.map((order)=>{
            if(order.state != 'DELIVERED'){
                throw {error: 'Restock order state is not DELIVERED', code: 422};
            }
        });
        try {
            await this.dao.modifyRestockOrderSKUs(id, body.skuItems);
            return;
        } catch (error) {
            throw error
        }
    }

    modifyRestockOrderNote = async (id, body) => {
        if(Number.isNaN(parseInt(id))){
            throw {error:"Id is not a number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        if (body === undefined || body.transportNote === undefined) {
            throw { error: `Invalid body data`, code:422};
        }
        const orders = await this.dao.getRestockOrder(id);
        orders.map((order)=>{
            if(order.state != 'DELIVERY'){
                throw {error: 'Restock order state is not DELIVERY', code: 422};
            }
            if(dayjs(body.transportNote.deliveryDate).isBefore(dayjs(order.issueDate))){
                throw {error: 'Dates dont match', code: 422};
            }
        });
        try {
            await this.dao.modifyRestockOrderNote(id, body.transportNote);
            return;
        } catch (error) {
            throw error
        }
    }

    deleteRestockOrder = async (id) => {
        if(Number.isNaN(parseInt(id))){
            throw {error:"Id is not a number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        try {
            await this.dao.deleteRestockOrder(id);
            return;
        } catch (error) {
            throw error
        }
    }

    dropTable = async () => {
        try {
            await this.dao.dropTable();
            return;
        } catch (error) {
            throw error
        }
    }

//<--------------------------RETURN ORDER-------------------------------------------------------------->

    getReturnOrders = async () => {
        try {
            const orderDTO = await this.dao.getReturnOrders();
            return orderDTO;
        } catch (error) {
            throw error
        }
    }

    getReturnOrder = async (id) => {
        if(Number.isNaN(parseInt(id))){
            throw {error:"Id is not a number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        try {
            const orderDTO = await this.dao.getReturnOrder(id);
            return orderDTO;
        } catch (error) {
            throw error
        }
    }

    newTableReturnOrder = async () => {
        try {
            await this.dao.newTableReturnOrder();
            return ;
        } catch (error) {
            throw error
        }
    }

    newReturnOrder = async (body) => {
        if (body === undefined || body.returnDate === undefined || body.products === undefined || body.restockOrderId === undefined) {
            throw { error: `Invalid body data`, error:422};
        }
        const date = dayjs(body.returnDate).format('YYYY/MM/DD HH:mm') 
        if(!dayjs(date).isValid()){
            throw {error: "Invalid date!", code:422};
        }
        try {
            await this.dao.newReturnOrder(body);
            return ;
        } catch (error) {
            throw error
        }
    }

    deleteReturnOrder = async (id) => {
        if(Number.isNaN(parseInt(id))){
            throw {error:"Id is not a number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        try {
            await this.dao.deleteReturnOrder(id);
            return;
        } catch (error) {
            throw error
        }
    }

    dropTableReturnOrder = async () => {
        try {
            await this.dao.dropTableReturnOrder();
            return;
        } catch (error) {
            throw error
        }
    }

    // <------------------------------------------------- INTERNAL ORDER ------------------------------->

    getInternalOrders = async () => {
        try {
            const orderDTO = await this.dao.getInternalOrders();
            return orderDTO;
        } catch (error) {
            throw error
        }
    }

    getInternalOrdersIssued = async () => {
        try {
            const orderDTO = await this.dao.getInternalOrdersIssued();
            return orderDTO;
        } catch (error) {
            throw error
        }
    }

    getInternalOrdersAccepted = async () => {
        try {
            const orderDTO = await this.dao.getInternalOrdersAccepted();
            return orderDTO;
        } catch (error) {
            throw error
        }
    }

    getInternalOrder = async (id) => {
        if(Number.isNaN(parseInt(id))){
            throw {error:"Id is not a number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        try {
            const orderDTO = await this.dao.getInternalOrder(id);
            return orderDTO;
        } catch (error) {
            throw error
        }
    }

    newTableInternalOrder = async () => {
        try {
            await this.dao.newTableInternalOrder();
            return ;
        } catch (error) {
            throw error
        }
    }

    newInternalOrder = async (body) => {
        if (body === undefined || body.issueDate === undefined || body.products === undefined || body.customerId === undefined) {
            throw { error: `Invalid body data`, code:422};
        }
        const date = dayjs(body.issueDate).format('YYYY/MM/DD HH:mm') 
        if(!dayjs(date).isValid()){
            throw {error: "Invalid date!", code:422};
        }
        if(Number.isNaN(body.customerId)){
            throw {error: "Invalid customerId!", code:422};
        }
        try {
            await this.dao.newInternalOrder(body);
            return ;
        } catch (error) {
            throw error
        }
    }

    modifyInternalOrder = async (id, body) => {
        if(Number.isNaN(parseInt(id))){
            throw {error:"Id is not a number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        if (body === undefined || body.newState === undefined) {
            throw { error: `Invalid body, missing state`, code:422};
        }
        const states = ['ISSUED', 'ACCEPTED', 'REFUSED', 'CANCELED', 'COMPLETED']
        if(!states.includes(body.newState.toUpperCase())){
            throw { error: `The provided state is not valid`, code:422};
        }
        if (body.newState.toUpperCase() =='COMPLETED' && body.products === undefined){
            throw { error: `Missing products array`, code:422};
        }else{
            body.products = 0;
        }
        try {
            await this.dao.modifyInternalOrder(id, body.newState, body.products);
            return;
        } catch (error) {
            throw error
        }
    }

    deleteInternalOrder = async (id) => {
        if(Number.isNaN(parseInt(id))){
            throw {error:"Id is not a number", code:422}
        }
        if(id<=0){
            throw {error:"Id is less or equal than 0", code:422}
        }
        try {
            await this.dao.deleteInternalOrder(id);
            return;
        } catch (error) {
            throw error
        }
    }

    dropTableInternalOrder = async () => {
        try {
            await this.dao.dropTableInternalOrder();
            return;
        } catch (error) {
            throw error
        }
    }

}

module.exports = OrderService;