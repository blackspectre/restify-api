import { UserController } from './user';
import EncryptPassword from '../utils/password-encrypt';

export const CONTROLLERS = [new UserController(new EncryptPassword())];
