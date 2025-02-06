import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BookReservation } from './dto/bookReservation.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';
import { User } from '../entities/user.entity';


@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    async registerReservation(registerDto: BookReservation, token: string) {
        if (!token || !token.startsWith('Bearer')) {
            throw new UnauthorizedException('Invalid token format');
        }

        const jwt = token.split(' ')[1];
        let decodedToken;
        try {
            decodedToken = this.jwtService.verify(jwt);
        } catch (error) {
            throw new UnauthorizedException(`Invalid token. ${error.message}`);
        }

        const userId = decodedToken.sub;

        if (!userId) {
            throw new UnauthorizedException('Invalid token payload');
        }

        if (!registerDto.movie_id || !registerDto.reservation_begins) {
            throw new UnauthorizedException('Invalid reservation data');
        }

        if(await this.verifyIfNewReservationCrossingAlreadyBookedOnes(registerDto, userId)) {
            throw new UnauthorizedException('Reservation is crossing already booked ones');
        }
        
        const reservation = this.reservationRepository.create({
            movie_id: registerDto.movie_id,
            reservation_begins: registerDto.reservation_begins,
            user: { id: userId }
        });
        return this.reservationRepository.save(reservation);
    }

    async getReservations(token: string) {
        if (!token || !token.startsWith('Bearer ')) {
            throw new UnauthorizedException('Invalid token format');
        }

        const jwt = token.split(' ')[1];
        let decodedToken;

        try {
            decodedToken = this.jwtService.verify(jwt);
        } catch (error) {
            throw new UnauthorizedException(`Invalid token. ${error.message}`);
        }

        const userId = decodedToken.sub;
        if (!userId) {
            throw new UnauthorizedException('Invalid token payload');
        }

        return this.reservationRepository.find({ where: { user: { id: userId } } });
    }

    async deleteReservations(id: number, token: string) {
        if (!token || !token.startsWith('Bearer')) {
            throw new UnauthorizedException('Invalid token format');
        }

        const jwt = token.split(' ')[1];
        let decodedToken;
        try {
            decodedToken = this.jwtService.verify(jwt);
        } catch (error) {
            throw new UnauthorizedException(`Invalid token. ${error.message}`);
        }

        const userId = decodedToken.sub;

        if (!userId) {
            throw new UnauthorizedException('Invalid token payload');
        }
        
        let userReservations = this.reservationRepository.findOne({ where: { id: id, user: { id: userId } } });

        if (!userReservations) {
            throw new UnauthorizedException('Reservation not found or you do not have permission to delete it');
        }

        return this.reservationRepository.delete(id);
    }

    //helpers
    async verifyIfNewReservationCrossingAlreadyBookedOnes(registerDto: BookReservation, userId: number): Promise<boolean> {
        const userReservations = this.reservationRepository.find({ where: { user: { id: userId } } });
        userReservations.then(reservations => {
            reservations.forEach(reservation => {
                let reservationDate = new Date(reservation.reservation_begins);
                let reservationEnd = new Date(reservationDate.getTime() + 2 * 60 * 60 * 1000);
                let newReservationDate = new Date(registerDto.reservation_begins);
                let newReservationEnd = new Date(newReservationDate.getTime() + 2 * 60 * 60 * 1000);

                if ((newReservationDate >= reservationDate && newReservationDate <= reservationEnd) || (newReservationEnd >= reservationDate && newReservationEnd <= reservationEnd)) {
                    return false;
                }
            });
        });
        return true;
    }
}
