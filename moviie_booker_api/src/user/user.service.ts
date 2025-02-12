import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}


  async findOne(email: string): Promise<User | undefined> {
    let user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      return user;
    }
    return undefined;
  }

  async register(registerDto: RegisterDto) {
    const user = this.userRepository.create({
      username: registerDto.username,
      email: registerDto.email,
      password: registerDto.password,
      role: registerDto.role,
    });
    await this.userRepository.save(user);
    return {
      message: 'User successfully added',
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.findOne(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Inncorrect  or password');
    }
    // console.log(user.password);
    // console.log(loginDto.password);
    // let password_hash = await bcrypt.hash(loginDto.password, 10);
    // console.log(password_hash);
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password or email');
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    // const test = this.jwtService.decode(token);
    // console.log(test);

    return {
      message: 'Connexion succesfull',
      access_token: token,
    };
  }
  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}