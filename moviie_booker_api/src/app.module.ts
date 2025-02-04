import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

// Connects to the postgres database :
// Source : https://medium.com/simform-engineering/nestjs-and-postgresql-a-crud-tutorial-32aa78778752
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'Worldpass@cces',
      username: 'postgres',
      entities: [],
      database: 'postgres',
      synchronize: true,
      logging: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
