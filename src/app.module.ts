import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, } from '@nestjs/config';
import verifo from './config/verifo';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: [process.cwd() + '/' + (process.env.NODE_ENV || '') + '.env'],
    load: [verifo],
    isGlobal: true,
}),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
