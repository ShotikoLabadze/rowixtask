class UserService {
  constructor() {
    this.users = [];
  }

  create(name) {
    const user = { id: Date.now().toString(), name };
    this.users.push(user);
    return user;
  }

  getAll() {
    return this.users;
  }

  getId(id) {
    return this.users.find(u => u.id === id);
  }
}

module.exports = new UserService();
