import * as passport from 'passport';
import {
    Module,
    NestModule,
    MiddlewaresConsumer,
    RequestMethod,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';

@Module({
    imports: [UserModule],
    components: [AuthService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule implements NestModule {
    public configure(consumber: MiddlewaresConsumer) {
        consumber.apply(passport.authenticate('jwt', { session: false }))
            .forRoutes(
                { path: '/user/users', method: RequestMethod.GET },
                { path: '/util/authorized', method: RequestMethod.ALL },
        );
    }
}