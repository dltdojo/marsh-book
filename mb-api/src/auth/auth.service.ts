import * as jwt from 'jsonwebtoken';
import { Component, Inject } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Utils } from '../utils';


@Component()
export class AuthService {

    constructor(private userService: UserService) { }

    async createToken(id: number, username: string, roles: string[]) {
        const expiresIn = 60 * 60;
        const algorithm = 'ES256'; 
        const secretOrKey = Utils.loadJwtPrivateKey();
        const user = { id, username , roles};
        const token = jwt.sign(user, secretOrKey, { expiresIn, algorithm });
        return {
            expires_in: expiresIn,
            access_token: token,
        };
    }

    async validate(signedUser): Promise<boolean> {
        if (signedUser && signedUser.username) {
            const user = await this.userService.getUserByUsername(signedUser.username);
            return Boolean(user);
        }
        return false;
    }
}