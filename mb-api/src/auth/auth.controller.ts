import { Controller, Post, HttpStatus, HttpCode, Get, Response, Request,  UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';

@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService) { }

    @Post('login')
    async loginUser(@Response() res: any, @Body() body: User) {
        if (!(body && body.username && body.password)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Username and password are required!' });
        }
        const user = await this.userService.getUserByUsername(body.username);
        if (user) {
            if (await this.userService.compareHash(body.password, user.passwordHash)) {
                const jwt = await this.authService.createToken(user.id, user.username, user.roles)
                const userData = {
                    id: user.id,
                    username: user.username,
                    isAdmin: user.roles.indexOf('SYSTEM') > -1,
                }
                const r = {
                    user: userData,
                    jwt,
                }
                return res.status(HttpStatus.OK).json(r);
            }
        }
        return res.status(HttpStatus.FORBIDDEN).json({ message: 'Username or password wrong!' });
    }

    // http://localhost:3000/alpha1/auth/register
    // {"username":"alice100","password":"pass", "email": "foo@bar.com", "roles:['USER']"
    @Post('register')
    async registerUser(@Response() res: any, @Body() body: User) {
        if (!(body && body.username && body.password)) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'Username and password are required!' });
        }
        let user = await this.userService.getUserByUsername(body.username);

        if (user) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'Username exists' });
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
