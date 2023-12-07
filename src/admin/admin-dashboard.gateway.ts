import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/guards/ws.guard';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({ namespace: 'dashboard' })
@UseGuards(WsJwtGuard)
export class DashboardGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly postService: PostService, private readonly userService: UserService) {}

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Socket Id', socket.id);
      console.log('Ws connected');
    });
  }

  @SubscribeMessage('fetchUsers')
  async fetchUsers(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const users = await this.userService.findAll();
    this.server.emit('usersUpdated', users);
  }

  @SubscribeMessage('fetchPosts')
  async fetchPosts(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const posts = await this.postService.findAll();
    this.server.emit('postsUpdated', posts);
  }
}
