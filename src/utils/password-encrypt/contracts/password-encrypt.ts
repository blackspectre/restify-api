export interface PasswordEncrypt {
  hashIt(password: string): Promise<string>;
  public compareIt(password: string, hashedPassword: string): Promise<boolean>;
}
