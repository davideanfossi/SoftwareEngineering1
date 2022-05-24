
class skuService {
    dao;

    constructor(dao) {
        this.dao = dao;
    }
   
    // SKU

    newTableSku = async () => {
        const res = await this.dao.newTableSku();
    }

    createSku = async (Sku) => {
        return await this.dao.createSku(Sku);
    }

    getSkus = async () => {
        let skus = [];
        const ids = await this.dao.getSkuIds();
        for (const id of ids) {
            const sku = await this.dao.getSkuById(id);
            skus.push(sku[0]);
        }
        return skus;
    }

    getSku = async (id) => {           
        return await this.dao.getSkuById(id);
    }

    modifySku = async(id, sku) => {
        return await this.dao.modifySku(id, sku);
    }

    getWeightVolume = async(id) => {
        return await this.dao.getWeightVolume(id);
    }

    modifySkuPositon = async(id, position) => {
        return await this.dao.modifySkuPositon(id, position);
    }

    updateOccupied = async(weight, volume, position, oldPosition) => {
        return await this.dao.updateOccupied(weight, volume, position, oldPosition);
    }

    deleteSku = async (id) => {
        const res = await this.dao.deleteSku(id);
        return res;
    }

    deleteAllSku = async () => {
        const res = await this.dao.deleteAllSku();
    }
    
    
    // SKUItem
    
    newTableSKUItem = async () => {
        const res = await this.dao.newTableSKUItem();
    }

    createSKUItem = async (SKUItem) => {
        if (SKUItem.DateOfStock != null) {
            const isDate = (date) => {
                return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
            }
            if (isDate(SKUItem.DateOfStock) === true) {
                if (SKUItem.DateOfStock.match(/[0-9]{4}[/](0[1-9]|1[0-2])[/](0[1-9]|[1-2][0-9]|3[0-1])/) === null) {
                    //it is not a date with format YYYY/MM/DD
                    if (SKUItem.DateOfStock.match(/[0-9]{4}[/](0[1-9]|1[0-2])[/](0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/) === null) {
                        //it is not a date with format YYYY/MM/DD HH:MM
                        throw {error: "Invalid DateOfStock format", code:422}; 
                    }
                }
            }
            else
                throw {error: "Invalid DateOfStock", code:422};                 
        }
        if(!Number.isInteger(SKUItem.SKUId))
            throw {error: "Invalid SKUId", code:422}; 
        if(SKUItem.SKUId < 0)
            throw {error: "Invalid SKUId", code:422}; 
        if(!(typeof SKUItem.RFID === 'string'))
            throw {error: "Invalid RFID", code:422}; 
        return await this.dao.createSKUItem(SKUItem);   
    }

    getSKUItem = async (RFID) => {  
        if(!(typeof RFID === 'string'))
            throw {error: "Invalid RFID", code:422}; 
        const SKUItem = await this.dao.getSKUItem(RFID);
        if (SKUItem.length < 1)
            throw {error: "not found", code:404};
        let SKUItemDTO = SKUItem.map((skuItem) => (
            {
            RFID: skuItem.RFID,
            SKUId: skuItem.SKUID,
            Available: skuItem.AVAILABLE,
            DateOfStock: skuItem.DATEOFSTOCK,
        }
        ));
        return SKUItemDTO;
    }

    getSKUItems = async () => {
        const SKUItems = await this.dao.getSKUItems();
        let SKUItemsDTO = SKUItems.map((SKUItem) => (
            {
            RFID: SKUItem.RFID,
            SKUId: SKUItem.SKUID,
            Available: SKUItem.AVAILABLE,
            DateOfStock: SKUItem.DATEOFSTOCK,
        }
        ));
        return SKUItemsDTO;
    }

    getSKUItemsAvailable = async (id) => {
        if(!Number.isInteger(id))
            throw {error: "Invalid id", code:422}; 
        if (id < 0){
            throw {error: "Invalid id", code:422};}
        const SKUItemAvailable = await this.dao.getSKUItemsAvailable(id);
        if (SKUItemAvailable.length < 1)
            throw {error: "no SKUItemAvailable found", code:404};
        let SKUItemAvailableDTO = SKUItemAvailable.map((r) => (
            {
                RFID: r.RFID,
                SKUId: r.SKUID,
                Available: r.AVAILABLE,
                DateOfStock: r.DATEOFSTOCK,
        }
        ));
        return SKUItemAvailableDTO;
    }

    modifySKUItem = async (rfid, data) => {
        if (data.newDateOfStock != null) {
            const isDate = (date) => {
                return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
            }
            if (isDate(data.newDateOfStock) === true) {
                if (data.newDateOfStock.match(/[0-9]{4}[/](0[1-9]|1[0-2])[/](0[1-9]|[1-2][0-9]|3[0-1])/) === null) {
                    //it is not a date with format YYYY/MM/DD
                    if (data.newDateOfStock.match(/[0-9]{4}[/](0[1-9]|1[0-2])[/](0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/) === null) {
                        //it is not a date with format YYYY/MM/DD HH:MM
                        throw {error: "Invalid newDateOfStock format", code:422}; 
                    }
                }
            }
            else
                throw {error: "Invalid newDateOfStock", code:422};                 
        } 
        if(!Number.isInteger(data.newAvailable))
            throw {error: "Invalid newAvailable", code:422}; 
        else if(data.newAvailable > 1 || data.newAvailable < 0)
            throw {error: "Invalid newAvailable", code:422}; 
        if(!(typeof data.newRFID === 'string'))
            throw {error: "Invalid newRFID", code:422}; 
        if(!(typeof rfid === 'string'))
            throw {error: "Invalid RFID", code:422}; 
        return await this.dao.modifySKUItem(rfid, data)
    }

    deleteSKUItem = async (rfid) => { 
        if(!(typeof rfid === 'string'))
            throw {error: "Invalid RFID", code:422}; 
        const res = await this.dao.deleteSKUItem(rfid);
        return res;
    }

    deleteAllSKUItem = async () => {
        const res = await this.dao.deleteAllSKUItem();
    }

    // Position

    newTablePosition = async () => {
        const res = await this.dao.newTablePosition();
    }

    createPosition = async (position) => {
        if(position.positionID.length !== 12)
            throw {error: "Invalid positionID length", code:422};
        if(!(position.positionID.match(/^[0-9]+$/) != null))
            throw {error: "Invalid positionID format", code:422};
        let aisleid = position.positionID.slice(0, 4);
        let row = position.positionID.slice(4, 8);
        let col = position.positionID.slice(8, 12);
        if (!(aisleid === position.aisleID && row === position.row && col === position.col))
            throw {error: "positionID is not derived from aisleID, row and col", code:422};
        if(!Number.isInteger(position.maxWeight))
            throw {error: "Invalid maxWeight", code:422}; 
        else if(position.maxWeight < 0)
            throw {error: "Invalid maxWeight", code:422}; 
        if(!Number.isInteger(position.maxVolume))
            throw {error: "Invalid maxVolume", code:422}; 
        else if(position.maxVolume < 0)
            throw {error: "Invalid maxVolume", code:422}; 
        return await this.dao.createPosition(position);
    }

    getPositions = async () => {
        const Positions = await this.dao.getPositions();
        let PositionsDTO = Positions.map((r) => (
            {
            positionID: r.POSITIONID,
            aisleID: r.AISLEID,
            row: r.ROW,
            col: r.COL,
            maxWeight: r.MAXWEIGHT,
            maxVolume: r.MAXVOLUME,
            occupiedWeight: r.OCCUPIEDWEIGHT,
            occupiedVolume: r.OCCUPIEDVOLUME
        }
        ));
        return PositionsDTO;
    }

    deleteAllPosition = async () => {
        const res = await this.dao.deleteAllPosition();
    }

    modifyPosition = async (positionID, data) => {
        if(positionID.length !== 12)
            throw {error: "Invalid positionID length", code:422};
        if(!(positionID.match(/^[0-9]+$/) != null))
            throw {error: "Invalid positionID format", code:422};
        if(!(data.newAisleID.match(/^[0-9]+$/) != null))
            throw {error: "Invalid newAisleID format", code:422};
        if(!(data.newRow.match(/^[0-9]+$/) != null))
            throw {error: "Invalid newRow format", code:422};
        if(!(data.newCol.match(/^[0-9]+$/) != null))
            throw {error: "Invalid newCol format", code:422};
        if(data.newAisleID.length !== 4)
            throw {error: "Invalid newAisleID length", code:422};
        if(data.newRow.length !== 4)
            throw {error: "Invalid newRow length", code:422};
        if(data.newCol.length !== 4)
            throw {error: "Invalid newCol length", code:422};
        if(!Number.isInteger(data.newMaxWeight))
            throw {error: "Invalid newMaxWeight", code:422}; 
        else if(data.newMaxWeight < 0)
            throw {error: "Invalid newMaxWeight", code:422}; 
        if(!Number.isInteger(data.newMaxVolume))
            throw {error: "Invalid newMaxVolume", code:422}; 
        else if(data.newMaxVolume < 0)
            throw {error: "Invalid newMaxVolume", code:422}; 
        if(!Number.isInteger(data.newOccupiedWeight))
            throw {error: "Invalid newOccupiedWeight", code:422}; 
        else if(data.newOccupiedWeight < 0)
            throw {error: "Invalid newOccupiedWeight", code:422}; 
        if(!Number.isInteger(data.newOccupiedVolume))
            throw {error: "Invalid newOccupiedVolume", code:422}; 
        else if(data.newOccupiedVolume < 0)
            throw {error: "Invalid newOccupiedVolume", code:422};
        if (data.newOccupiedVolume > data.newMaxVolume)
            throw {error: "newOccupiedVolume larger then newMaxVolume", code:422};
        if(data.newOccupiedWeight > data.newOccupiedWeight)
            throw {error: "newOccupiedWeight larger then newMaxWeight", code:422}; 
        let newPositionID = data.newAisleID.concat(data.newRow, data.newCol);
        const res = await this.dao.modifyPosition(newPositionID, positionID, data);
        return res;
    }

    modifyPositionID = async (positionID, newPositionID) => {
        if(positionID.length !== 12)
            throw {error: "Invalid positionID length", code:422};
        if(!(positionID.match(/^[0-9]+$/) != null))
            throw {error: "Invalid positionID format", code:422};
        if(newPositionID.length !== 12)
            throw {error: "Invalid newPositionID length", code:422};
        if(!(newPositionID.match(/^[0-9]+$/) != null))
            throw {error: "Invalid newPositionID format", code:422};
        let aisleid = newPositionID.slice(0, 4);
        let row = newPositionID.slice(4, 8);
        let col = newPositionID.slice(8, 12);
        const res = await this.dao.modifyPositionID(positionID, newPositionID, aisleid, row, col);
        return res;
    }

    deletePosition = async (positionID) => {
        if(positionID.length !== 12)
            throw {error: "Invalid positionID length", code:422};
        if(!(positionID.match(/^[0-9]+$/) != null))
            throw {error: "Invalid positionID format", code:422};
        const res = await this.dao.deletePosition(positionID);
        return res;
    }

    // Item

    newTableItem = async () => {
        const res = await this.dao.newTableItem();
    }

    createItem = async (Item) => {
        if(!Number.isInteger(Item.id))
            throw {error: "Invalid id", code:422}; 
        else if (Item.id < 0)
            throw {error: "Invalid id", code:422};
        if(!(typeof Item.price === 'number'))
            throw {error: "Invalid price", code:422}; 
        else if (Item.price < 0)
            throw {error: "Invalid price", code:422};
        if(!Number.isInteger(Item.SKUId))
            throw {error: "Invalid SKUId", code:422}; 
        else if (Item.SKUId < 0)
            throw {error: "Invalid SKUId", code:422};
        if(!Number.isInteger(Item.supplierId))
            throw {error: "Invalid supplierId", code:422}; 
        else if (Item.supplierId < 0)
            throw {error: "Invalid supplierId", code:422};
        let res = await this.dao.checkExisting(Item);
        if (res.length > 0)
            throw {error: "supplier already sells an item with the same SKUId or same ID", code:422};
        return await this.dao.createItem(Item);
    }

    getItems = async () => {
        const Items = await this.dao.getItems();
        let ItemsDTO = Items.map((r) => (
            {
            id: r.ID,                    
            description: r.DESCRIPTION,
            price: r.PRICE, 
            SKUId: r.SKUID,
            supplierId: r.SUPPLIERID,
        }
        ));
        return ItemsDTO;
    }

    getItem = async (id) => {
        if(!Number.isInteger(id))
            throw {error: "Invalid id", code:422}; 
        else if (id < 0)
            throw {error: "Invalid id", code:422};
        const Item = await this.dao.getItem(id);
        if (Item.length < 1)
            throw {error: "no Item found", code:404};
        let ItemDTO = Item.map((r) => (
            {
                id: r.ID,                    
                description: r.DESCRIPTION,
                price: r.PRICE, 
                SKUId: r.SKUID,
                supplierId: r.SUPPLIERID,
        }
        ));
        return ItemDTO
    }

    modifyItem = async (id, data) => {
        if(!Number.isInteger(id))
            throw {error: "Invalid id", code:422}; 
        if (id < 0)
            throw {error: "Invalid id", code:422};
        if(!(typeof data.newPrice === 'number'))
            throw {error: "Invalid newPrice", code:422}; 
        else if (data.newPrice < 0)
            throw {error: "Invalid newPrice", code:422};    
        
        const res = await this.dao.modifyItem(id, data);
        return res;
    }

    deleteItem = async (id) => {
        if(!Number.isInteger(id))
            throw {error: "Invalid id", code:422}; 
        if (id < 0)
            throw {error: "Invalid id", code:422};
        const res = await this.dao.deleteItem(id);
        return res;
    }

    deleteAllItem = async () => {
        const res = await this.dao.deleteAllItem();
    }

}

module.exports = skuService;