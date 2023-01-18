import { Controller, Param } from '@nestjs/common';
import { Body, Get } from '@nestjs/common/decorators';
import { UserDetails } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService,
    ) {}

    @Get(':id')
    getUser(@Param('id') id: string): Promise<UserDetails> {
        return this.userService.findById(id);
    }
}
