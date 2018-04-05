import { Controller, Post, HttpStatus, HttpCode, Get, Response, Request,  UseGuards, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';

@Controller('user')
@UseGuards(RolesGuard)
export class UserController {

    constructor(
        private readonly userService: UserService) { }

    @Get('users')
    @Roles('SYSTEM')
    async getUsers(){
        return await this.userService.getUsers()
    }

    @Post('register')
    async registerUser(@Response() res: any, @Body() body: User) {
        if (!(body && body.username && body.password && body.email && body.roles)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Username, password, email and roles are required!' });
        }
        let user = await this.userService.getUserByUsername(body.username);

        if (user) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Username exists' });
        } else {
            console.log('register user=', body)
            user = await this.userService.createUser(body);
            if (user) {
                user.passwordHash = undefined;
            }
        }

        return res.status(HttpStatus.OK).json(user);
    }
}
