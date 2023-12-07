import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/dbConfig';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), UserModule, AuthModule, PostModule, CategoryModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
