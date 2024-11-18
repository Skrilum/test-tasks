import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' }) // Сопоставление first_name -> firstName
  firstName: string;

  @Column({ name: 'last_name' }) // Сопоставление last_name -> lastName
  lastName: string;

  @Column()
  age: number;

  @Column()
  gender: 'male' | 'female';

  @Column({ name: 'has_problems', default: false })
  hasProblems: boolean;
}
