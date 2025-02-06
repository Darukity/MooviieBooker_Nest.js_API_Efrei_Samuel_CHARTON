import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;
  
  @ApiProperty({ example: 'user123', description: 'User username' })
  username: string;

  @ApiProperty({ example: 'securepassword', description: 'User password', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'user', description: 'User role' })
  @IsString()
  @IsEnum(['user', 'admin'], { message: 'Role must be either user or admin' })
  role: string;
}
