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

    getSkuById = async (id) => {           
        return await this.dao.getSkuById(id);
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
        return await this.dao.createSKUItem(SKUItem);
    }

    getSKUItem = async (RFID) => {           
        return await this.dao.getSKUItem(RFID);
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

    deleteAllSKUItem = async () => {
        const res = await this.dao.deleteAllSKUItem();
    }

    getSKUItemsAvailable = async (id) => {
        return await this.dao.getSKUItemsAvailable(RFID);
    }

    modifySKUItem = async (rfid, data) => {
        const res = await this.dao.modifySKUItem(rfid, data)
        return res;
    }

    deleteSKUItem = async (rfid) => {
        const res = await this.dao.deleteSKUItem(rfid);
        return res;
    }

    // Position

    newTablePosition = async () => {
        const res = await this.dao.newTablePosition();
    }

    createPosition = async (position) => {
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
        const res = await this.dao.modifyPosition(positionID, data);
        return res;
    }

    modifyPositionID = async (positionID, newPositionID) => {
        const res = await this.dao.modifyPositionID(positionID, newPositionID);
        return res;
    }

    deletePosition = async (positionID) => {
        const res = await this.dao.deletePosition(positionID);
        return res;
    }

    // Item

    newTableItem = async () => {
        const res = await this.dao.newTableItem();
    }

    createItem = async (Item) => {
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
        return await this.dao.getItem(id);
    }

    modifyItem = async (id, data) => {
        const res = await this.dao.modifyItem(id, data);
        return res;
    }

    deleteItem = async (id) => {
        const res = await this.dao.deleteItem(id);
        return res;
    }

    deleteAllItem = async () => {
        const res = await this.dao.deleteAllItem();
    }

}

module.exports = skuService;