import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('Base.customers')
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn() public id: number;

  @Column() public firstName: string;

  @Column() public lastName: string;
}
