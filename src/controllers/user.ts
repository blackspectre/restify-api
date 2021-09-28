import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { Request, Response } from 'restify';
import { User } from '../entity/User';
import { PasswordEncrypt } from '../utils/password-encrypt/protocols/password-encrypt';

import * as jwt from 'jsonwebtoken';
import { config } from '../../config';

import { checkJwtTokenFn } from '../utils/check-token/';

export class UserController implements Controller {
  private encryptPassword: PasswordEncrypt;
  constructor(encryptPassword: PasswordEncrypt) {
    this.encryptPassword = encryptPassword;
  }

  public initialize(httpServer: HttpServer): any {
    httpServer.post('/authenticate', this.authenticate.bind(this));
    httpServer.get('/users', this.list.bind(this));
    httpServer.get('/user/:id', this.getById.bind(this));
    httpServer.post('/user', this.create.bind(this));
    httpServer.put('/user/updatebyemail/:email', this.updateByEmail.bind(this));
    httpServer.put('/user/updatebyid/:id', this.updateById.bind(this));
    httpServer.put('/user/updatepassword', this.updatePassword.bind(this));
    httpServer.del('/user/:email', this.remove.bind(this));
  }

  private async list(req: Request, res: Response): Promise<any> {
    const isAuth = checkJwtTokenFn(req, res);
    if (!isAuth) return res.send(401, 'Not authenticated');

    const users = await User.find();

    return res.send(users);
  }

  private async getById(req: Request, res: Response): Promise<any> {
    const isAuth = checkJwtTokenFn(req, res);
    if (!isAuth) return res.send(401, 'Not authenticated');

    const user = await User.findOne({ email: req.params.email });

    return res.send(user ? 200 : 404, user);
  }

  private async create(req: Request, res: Response): Promise<any> {
    const isAuth = checkJwtTokenFn(req, res);
    if (!isAuth) return res.send(401, 'Not authenticated');

    const password = req.body.password;
    const hashedPassword = await this.encryptPassword.hashIt(password);

    const newCustomer = User.create({
      email: req.body.email,
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPassword,
    });

    return res.send(await newCustomer.save());
  }

  private async updateByEmail(req: Request, res: Response): Promise<any> {
    const isAuth = checkJwtTokenFn(req, res);
    if (!isAuth) return res.send(401, 'Not authenticated');

    const email = req.params.email;
    const { firstName, lastName, username } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const updatedUser = await User.update({ email }, { firstName, lastName, username });
      return res.send(200, updatedUser);
    } else return res.send(404, 'user not found');
  }

  private async updateById(req: Request, res: Response): Promise<any> {
    const isAuth = checkJwtTokenFn(req, res);
    if (!isAuth) return res.send(401, 'Not authenticated');

    const id = req.params.id;
    const { firstName, lastName, username } = req.body;
    const user = await User.findOne({ id });

    if (user) {
      const updatedUser = await User.update({ id }, { firstName, lastName, username });
      return res.send(200, updatedUser);
    } else return res.send(404, 'user not found');
  }

  private async updatePassword(req: Request, res: Response): Promise<any> {
    const isAuth = checkJwtTokenFn(req, res);
    if (!isAuth) return res.send(401, 'Not authenticated');

    const { oldPassword, newPassword, email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const isValid = await this.encryptPassword.compareIt(oldPassword, user.password);

      if (isValid) {
        const newHashedPassword = await this.encryptPassword.hashIt(newPassword);

        User.update({ email }, { password: newHashedPassword });
        return res.send(200, 'password updated');
      } else return res.send(404, 'invalid password');
    } else return res.send(404, 'user not found');
  }

  private async remove(req: Request, res: Response): Promise<any> {
    const isAuth = checkJwtTokenFn(req, res);
    if (!isAuth) return res.send(401, 'Not authenticated');

    const email = req.params.email;
    const user = await User.findOne({ email });

    if (user) {
      User.delete({ email: email });
      return res.send(user ? 200 : 404, 'user was deleted');
    } else return res.send(404, 'user not found');
  }

  private async authenticate(req: Request, res: Response): Promise<any> {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user) {
      const isValid = await this.encryptPassword.compareIt(password, user.password);
      if (isValid) {
        const token = jwt.sign({ username }, config.jwt.secret, {
          expiresIn: '30s',
        });

        return res.send(200, token);
      } else return res.send(404, 'invalid password');
    } else return res.send(404, 'user not found');
  }
}
