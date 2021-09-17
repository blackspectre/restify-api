import { CustomerController } from './customer';
import { PingController } from './ping';
import { UtenteController } from './utente';

export const CONTROLLERS = [new CustomerController(), new PingController(), new UtenteController()];
