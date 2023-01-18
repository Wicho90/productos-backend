import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, UserDetails } from '../user/dto';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('register')
    register(@Body() createUserDto: CreateUserDto): Promise<UserDetails> {
        return this.authService.register(createUserDto);
    }

    @Post('login')
    @HttpCode( HttpStatus.OK )
    login(@Body() loginUserDto: LoginUserDto): Promise<{ token: string }> {
        return this.authService.login(loginUserDto);
    }
}