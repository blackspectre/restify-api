import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { Request, Response } from 'restify';
import { User } from '../entity/User';

export class UserController implements Controller {
  public initialize(httpServer: HttpServer): any {
    httpServer.get('/users', this.list.bind(this));
    httpServer.get('/user/:id', this.getById.bind(this));
    httpServer.post('/user', this.create.bind(this));
    // httpServer.put("customer/:id", this.update.bind(this));
    httpServer.del('/user/:email', this.remove.bind(this));
  }

  private async list(req: Request, res: Response): Promise<any> {
    const users = await User.find();

    res.send(users);
  }

  private async getById(req: Request, res: Response): Promise<any> {
    const user = await User.findOne({ email: req.params.email });

    res.send(user ? 200 : 404, user);
  }

  private async create(req: Request, res: Response): Promise<any> {
    const newCustomer = User.create({
      email: req.body.email,
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    });

    res.send(await newCustomer.save());
  }

  // private async update(req: Request, res: Response) {}
  private async remove(req: Request, res: Response): Promise<any> {
    const email = req.params.email;
    console.log(email);
    const user = await User.findOne({ email });

    console.log(user);
    if (user) {
      User.delete({ email: email });
      res.send(user ? 200 : 404, 'user was deleted');
    } else res.send(404, 'user not found');
  }
}
