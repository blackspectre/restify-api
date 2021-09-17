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
      lastName: customer.lastName
    });

    return await Customer.save(newCustomer);
  }

  async list() {
    const customers = await Customer.find();
    return customers;
  }

  public async update(customer: Customer) {
    const entity = await Customer.findOne(customer.id);

    if (!entity) {
      return null;
    } else {
      entity.firstName = customer.firstName;
      entity.lastName = customer.lastName;

      return Customer.save(entity);
    }
  }

  public async delete(id: number) {
    const entity = await Customer.findOne(id);

    return await Customer.remove(entity);
  }
}

export const customerService = new CustomerService();
