import { DeleteResult } from "typeorm";
import { Customer } from "../entity/customer";

export class CustomerService {
  public async getById(id: number): Promise<any> {
    const customer = await Customer.findOne({ id });

    return customer;
  }

  async create(customer: Customer): Promise<any> {
    console.log("i am in customerservice: ", customer);

    const newCustomer = Customer.create({
      firstName: customer.firstName,
      lastName: customer.lastName,
    });

    return await Customer.save(newCustomer);
  }

  async list(): Promise<Customer[]> {
    const customers = await Customer.find();
    return customers;
  }

  public async update(customer: Customer): Promise<any> {
    const entity = await Customer.findOne(customer.id);

    if (!entity) {
      return null;
    } else {
      entity.firstName = customer.firstName;
      entity.lastName = customer.lastName;

      return Customer.save(entity);
    }
  }

  public async delete(id: number): Promise<DeleteResult | null> {
    const entity = await Customer.findOne(id);
    if (entity) return await Customer.delete(id);
    else return null;
  }
}

export const customerService = new CustomerService();
