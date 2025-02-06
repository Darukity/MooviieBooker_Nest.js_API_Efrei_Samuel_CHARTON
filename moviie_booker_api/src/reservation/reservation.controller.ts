import { Controller , Post, Get, Delete, Body, Request , Param, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { BookReservation } from './dto/bookReservation.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiBearerAuth(
  'access-token',
)
@Controller('reservation')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @Post('reservations')
    async registerReservation(@Body() registerDto: BookReservation, @Request() req) {
        return this.reservationService.registerReservation(registerDto, req.headers.authorization);
    }

    @Get('reservations')
    async getReservations(@Request() req) {
        return this.reservationService.getReservations(req.headers.authorization);
    }

    @Delete('reservations/:id')
    async deleteReservation(@Param('id') id: number, @Request() req) {
        return this.reservationService.deleteReservations(id, req.headers.authorization);
    }
}
