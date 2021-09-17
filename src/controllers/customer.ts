import { Controller } from "./controller";
import { HttpServer } from "../server/httpServer";
import { Request, Response } from "restify";
import { Customer } from "../entity/Customer";

export class CustomerController implements Controller {
  public initialize(httpServer: HttpServer): any {
    httpServer.get("/customers", this.list.bind(this));
    httpServer.get("/customer/:id", this.getById.bind(this));
    httpServer.post("/customer", this.create.bind(this));
    // httpServer.put("customer/:id", this.update.bind(this));
    // httpServer.del("customer/id", this.remove.bind(this));
  }

  private async list(req: Request, res: Response): Promise<any> {
    const customers = await Customer.find();

    res.send(customers);
  }

  private async getById(req: Request, res: Response): Promise<any> {
    const customer = await Customer.findOne({ id: req.params.id });

    res.send(customer ? 200 : 404, customer);
  }

  private async create(req: Request, res: Response): Promise<any> {
    const newCustomer = Customer.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    res.send(await newCustomer.save());
  }

  // private async update(req: Request, res: Response) {}
  // private async remove(req: Request, res: Response) {}
}
