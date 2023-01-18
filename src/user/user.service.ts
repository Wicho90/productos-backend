import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user-entity';
import { UserDetails, CreateUserDto, LoginUserDto } from './dto';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) {}


    async create(createUserDto: CreateUserDto): Promise<UserDetails> {
        try {
            const user = await this.userModel.create(createUserDto);

            return this.getUserDetails(user);

        } catch (error) {
            this.handleErrors(error);
        }

    }
    
    

    async validateUser( loginUserDto: LoginUserDto ): Promise<UserDetails> {
        const user = await this.userModel.findOne({ email: loginUserDto.email });

        if (!user)
            throw new NotFoundException('Credentials are not valid'); // (email)

        if ( !bcrypt.compareSync( loginUserDto.password, user.password ) ) 
            throw new UnauthorizedException('Credentials are not valid'); // (password)
        
        return this.getUserDetails(user);
    
    }

    async findById( id: string ): Promise<UserDetails> {

        const user = await this.userModel.findById(id).exec();
        
        if ( !user )
            throw new NotFoundException('There is no user with this id');

        return this.getUserDetails(user);
    }

    



    private getUserDetails(user: User): UserDetails {

        return {
            id: user._id,
            name: user.name,
            email: user.email
        }
    }
    
    private handleErrors(error: any): never {
        if (error.code === 11000 )
            throw new BadRequestException(`Email is taken ${ JSON.stringify( error.keyValue ) }`);
        console.log('Controlado pa');
        
        console.log(error);

        throw new InternalServerErrorException('Please check server logs');
        
    } 

}