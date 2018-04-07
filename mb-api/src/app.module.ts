import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { UtilController } from './util.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HealthcareModule } from './healthcare/healthcare.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, AuthModule, HealthcareModule],
  controllers: [AppController, UtilController],
  components: [],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
