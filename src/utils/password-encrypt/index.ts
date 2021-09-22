import { PasswordEncrypt } from './protocols/password-encrypt';
import * as bcrypt from 'bcrypt';

export default class BCryptPasswordEncrypt implements PasswordEncrypt {
  async hashIt(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(6);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
  }
  async compareIt(password: string, hashedPassword: string): Promise<boolean> {
    const validPassword = await bcrypt.compare(password, hashedPassword);
    return validPassword;
  }
}
