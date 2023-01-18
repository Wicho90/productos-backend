import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';

import { JwtGaurd } from './guards/jwt.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        JwtModule.registerAsync({useFactory: () =>({
            secret: 'secret',
            signOptions: { expiresIn: '3600s'}
        })}),
        UserModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtGaurd, JwtStrategy]
})
export class AuthModule {}
