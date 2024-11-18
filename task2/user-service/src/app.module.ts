import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'qwerty1234567',
      database: 'user_service',
      synchronize: false, // Отключить в production
      autoLoadEntities: true,
    }),
    UsersModule,
  ],
})
export class AppModule {}
