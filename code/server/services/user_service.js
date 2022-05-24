class UserService {
    dao;

    constructor(dao) {
        this.dao = dao;
    }

    createUser = async (data) => {

        try{

            await this.checkUser(data, 'newUser');

        }catch (err){
            throw err;
        }
        

        
        
        const lastId = await this.dao.createUser(data);
        return lastId;
    }

    getUsers = async () => {
        const users = await this.dao.getUsers();

        console.log(users);
        let usersDTO = users.map((user) => ({

            id: user.ID,
            name: user.NAME,
            surname: user.SURNAME,
            email: user.USERNAME,
            type: user.TYPE

        }))
        return usersDTO;
    }

    checkUser = async (data, type) => {
        const res = await this.dao.checkUser(data, type);
        return res;
    }

    getSuppliers = async () => {
        const suppliers = await this.dao.getSuppliers();

        let suppliersDTO = suppliers.map((supplier) => ({

            id: supplier.ID,
            name: supplier.NAME,
            surname: supplier.SURNAME,
            email: supplier.USERNAME

        }));

        return suppliersDTO;
    }

    session = async (data, type) => {

        const info = await this.dao.session(data, type);

        let infoDTO = {

            id: info.ID,
            username: info.USERNAME,
            name: info.NAME

        }

        return infoDTO;
    }

    modifyUserRights = async (username, rights) => {
        const res = await this.dao.modifyUserRights(username, rights);
        return res;
    }

    deleteUser = async (username, type) => {
        const res = await this.dao.deleteUser(username, type);
        return res;
    }

    deleteAll = async () => {
        const res = await this.dao.dropContentUser();
        return res;
    }

    dropSequence = async () => {
        const res = await this.dao.dropSequence();
        return res;
    }
}

module.exports = UserService;
