
import { Injectable, CanActivate, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Model } from 'mongoose';

import { JwtPayload } from '../interfaces';
import { User } from '../../user/entities/user-entity';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) {
        super({
            secretOrKey: 'secret',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false
        });
    }

    async validate( payload: JwtPayload) {

        console.log(payload);
        
        const user = await this.userModel.findById(payload.user.id);

        if ( !user )
            throw new UnauthorizedException('Token is not valid');

        return {
            ...payload.user
        };
    }
}