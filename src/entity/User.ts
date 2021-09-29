import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Base.users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() public id: number;

  @Column() public email: string;

  @Column() public username: string;

  @Column() public firstName: string;

  @Column() public lastName: string;

  @Column() public password: string;

  @Column() public lastToken: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
