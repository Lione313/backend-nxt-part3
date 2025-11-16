import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Caso {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  nombre!: string;

  @Column()
  descripcion!: string;

  @Column()
  estado!: string;
  
  @Column({ default: true })
  activo!: boolean;
}