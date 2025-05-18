import Repository from './repository.js';
import User from '../models/user.js';

const UserRepository = new Repository(User);
export default UserRepository;
