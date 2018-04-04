import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UtilController } from './util.controller';

@Module({
  imports: [],
  controllers: [AppController,UtilController],
  components: [],
})
export class AppModule {}
