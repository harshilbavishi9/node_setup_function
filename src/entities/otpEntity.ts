import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './userEntity';

@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  otp: number;

  @Column()
  expire_at: Date;

  @OneToOne(() => User, user => user.id)
  @JoinColumn({ name: 'userid' })
  userid: User;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
