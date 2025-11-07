class User {
    constructor(id, username, password, role = 'user') {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role; // pode ser 'user' ou 'admin'
    }

    toSafeObject() {
        return {
            id: this.id,
            username: this.username,
            role: this.role
        };
    }
}

module.exports = User;
