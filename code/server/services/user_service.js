class UserService {
    dao;

    constructor(dao) {
        this.dao = dao;
    }

    createUser = async (data) => {

        const res = await service.checkUser(user, 'newUser')

        if (res === undefined)
            return 409;
        
        const lastId = await this.dao.createUser(data);
        return lastId;
    }

    getUsers = async () => {
        const users = await this.dao.getUsers();

        let usersDTO = users.map((user) => ({

            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.username,
            type: user.type

        }))
        return usersDTO;
    }

    checkUser = async (data, type) => {
        res = await this.dao.checkUser(data, type);
        console.log(res);
        return res;
    }

    getSuppliers = async () => {
        const suppliers = await this.dao.getSuppliers();

        let suppliersDTO = suppliers.map((supplier) => ({

            id: supplier.id,
            name: supplier.name,
            surname: supplier.surname,
            email: supplier.username
        }));

        return suppliersDTO;
    }

    session = async (data, type) => {

        const info = await this.dao.session(data, type);

        let infoDTO = {

            id: info.id,
            username: info.username,
            name: info.name

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
    }
}

module.exports = UserService;
