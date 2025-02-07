import { Controller , Post, Get, Delete, Body, Request , Param, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { BookReservation } from './dto/bookReservation.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiBearerAuth(
  'access-token',
)
@Controller('reservation')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @Post('reservations')
    @ApiOperation({ summary: 'Register a new reservation' })
    async registerReservation(@Body() registerDto: BookReservation, @Request() req) {
        return this.reservationService.registerReservation(registerDto, req.headers.authorization);
    }

    @Get('reservations')
    @ApiOperation({ summary: 'Get all reservations for currently logged in user' })
    async getReservations(@Request() req) {
        return this.reservationService.getReservations(req.headers.authorization);
    }

    @Delete('reservations/:id')
    @ApiOperation({ summary: 'Delete a reservation by id' })
    async deleteReservation(@Param('id') id: number, @Request() req) {
        return this.reservationService.deleteReservations(id, req.headers.authorization);
    }    
}
