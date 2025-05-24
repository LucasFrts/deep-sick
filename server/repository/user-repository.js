import Repository from './repository.js';
import User from '../models/user.js';


class UserRepository extends Repository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    const user = await this.model.findOne({ email }).lean();
    return user;
  }
}

export default new UserRepository();
