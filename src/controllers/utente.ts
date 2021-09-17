import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { Request, Response } from 'restify';
import { Utente } from '../entity/Utente';

export class UtenteController implements Controller {
  public initialize(httpServer: HttpServer): any {
    httpServer.get('/utentes', this.list.bind(this));
    httpServer.get('/utente/:id', this.getById.bind(this));
    httpServer.post('/utente', this.create.bind(this));
    // httpServer.put("customer/:id", this.update.bind(this));
    // httpServer.del("customer/id", this.remove.bind(this));
  }

  private async list(req: Request, res: Response): Promise<any> {
    const customers = await Utente.find();

    res.send(customers);
  }

  private async getById(req: Request, res: Response): Promise<any> {
    const utente = await Utente.findOne({ id: req.params.id });

    res.send(utente ? 200 : 404, utente);
  }

  private async create(req: Request, res: Response): Promise<any> {
    const newUtente = Utente.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    res.send(await newUtente.save());
  }

  // private async update(req: Request, res: Response) {}
  // private async remove(req: Request, res: Response) {}
}
