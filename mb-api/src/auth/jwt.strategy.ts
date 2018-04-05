import * as passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Component, Inject, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Utils } from '../utils';

@Component()
export class JwtStrategy extends Strategy {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true,
            secretOrKey: Utils.loadJwtPublicKey(),
        },
            async (req, payload, next) => await this.verify(req, payload, next)
        );
        passport.use(this);
    }

    public async verify(req, payload, done) {
        const isValid = await this.authService.validate(payload);
        if (!isValid) {
            return done(new UnauthorizedException(), false);
        }
        done(null, payload);
    }
}