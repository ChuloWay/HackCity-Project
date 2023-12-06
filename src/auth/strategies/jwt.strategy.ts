import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.PRIVATE_KEY.replace(/\\\\n/gm, '\\n')}`,
      algorithms: ['RS256'],
    });
  }

  /**
   * @description Validate the token and return the user or mover
   * @param payload string
   * @returns User
   */

  async validate(payload: any): Promise<User> {
    let user: User;

    if (payload) {
      const { appName, id } = payload;

      if (appName === 'HackCity') {
        user = await this.userService.findUserById(id);
      } else {
        throw new UnauthorizedException('Invalid user in token');
      }
    }
    // If the user is not found, throw an error
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
