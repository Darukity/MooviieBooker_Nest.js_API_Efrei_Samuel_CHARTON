import { IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BookReservation {
  @ApiProperty({example: 1, description: 'Movie ID to reserve'})
  @IsNumber()
  movie_id: number;

  @ApiProperty({
      example: new Date(Date.now()).toISOString(),
      description: 'Reservation start date (movies are always 2 hours long)'
  })
  @IsDateString()
  reservation_begins: Date;
}
