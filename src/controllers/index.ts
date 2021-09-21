// import { CustomerController } from './customer';
// import { PingController } from './ping';
import { CustomerController } from './customer';
import { UserController } from './user';
import BCryptPasswordEncrypt from '../utils/password-encrypt/bcrypt-password-encrypt';

export const CONTROLLERS = [new CustomerController(), new UserController(new BCryptPasswordEncrypt())];
