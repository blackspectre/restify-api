// import { CustomerController } from './customer';
// import { PingController } from './ping';
import { CustomerController } from './customer';
import { UserController } from './user';
import EncryptPassword from '../utils/password-encrypt';

export const CONTROLLERS = [new CustomerController(), new UserController(new EncryptPassword())];
