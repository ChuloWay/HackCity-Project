import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardGateway } from './dashboard.gateway';
import { UserModule } from 'src/user/user.module';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [UserModule, PostModule],
  providers: [DashboardGateway, DashboardService],
})
export class DashboardModule {}
