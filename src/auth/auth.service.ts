import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from 'src/user/user.service';
import { CreateUserDto, UserDetails, LoginUserDto } from '../user/dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}


    async register(createUserDto: Readonly<CreateUserDto>): Promise<UserDetails> {
        const { password, ...userData } = createUserDto;

        return await this.userService.create({
            ...userData,
            password: await this.hashPassword(password)
        });
    }

    async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
        const user = await this.userService.validateUser(loginUserDto);
        
        return { token: this.getJwtToke({user}) }
    }

    private async hashPassword(password: string): Promise<string> {
        try {
            return await bcrypt.hash(password, 12);
        } catch ( error ) {
            throw new BadRequestException('The password is required'); 
        }
    }

    private getJwtToke( payload: JwtPayload): string{
        const token = this.jwtService.sign(payload);
        return token;
    }
}