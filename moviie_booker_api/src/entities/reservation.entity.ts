import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ unique: false })
    movie_id: number;
    
    @ManyToOne(() => User, (user) => user.reservations, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' }) 
    user: User;
    
    @Column({ unique: false })
    reservation_begins: Date;
}