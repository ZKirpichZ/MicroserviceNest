import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{

    @PrimaryGeneratedColumn()
    userId: number

    @Column({unique: true})
    login:string;

    @Column()
    password:string;

    @Column({default: "USER"})
    role: string
}