import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity("utente")
export class Utente extends BaseEntity {
  @PrimaryGeneratedColumn() public id: number;

  @Column() public firstName: string;

  @Column() public lastName: string;
}
