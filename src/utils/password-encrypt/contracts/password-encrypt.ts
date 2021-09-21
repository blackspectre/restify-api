export interface PasswordEncrypt {
  hashIt(password: string): Promise<string>;
  compareIt(password: string, hashedPassword: string): Promise<boolean>;
}
