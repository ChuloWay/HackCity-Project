import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { AdminService } from 'src/admin/admin.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private adminService: AdminService, private userService: UserService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }

    const client: Socket = context.switchToWs().getClient<Socket>();

    let { authorization } = client.handshake.headers;
    if (!authorization) authorization = client.handshake.auth.authorization;

    return this.validateToken(client, context);
  }

  async validateToken(client: Socket, context): Promise<boolean> {
    let { authorization } = client.handshake.headers;
    if (!authorization) authorization = client.handshake.auth.authorization;

    if (!authorization) {
      throw new HttpException('Authorization token not passed', HttpStatus.UNAUTHORIZED);
    }

    const token: string = authorization.split(' ')[1];

    const payload = verify(token, process.env.PRIVATE_KEY);

    if (!payload) {
      return false;
    }
    //@ts-ignore
    const { appName, email } = payload;

    if (appName !== 'HackCity') {
      throw new HttpException('Invalid token for admin service', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.adminService.findOneByEmailQuery(email);

    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    // Store user information securely
    // context.switchToWs().getData().user = user;

    return true;
  }
}
