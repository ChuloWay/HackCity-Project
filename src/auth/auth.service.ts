import { Injectable } from '@nestjs/common';
import { JwtAuthService } from './jwt-auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from 'src/user/entities/token.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SocialLogin } from 'src/user/entities/social-login.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(SocialLogin)
    private readonly socialLoginRepository: Repository<SocialLogin>,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  private googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  async handleGoogleAuthRedirect(req: Request) {
    try {
      const googleUser = await this.googleLogin(req);

      if (typeof googleUser !== 'string') {
        const { email, firstName, lastName } = googleUser.user;
        const username = `${firstName} ${lastName}`;

        let user = await this.userRepository.findOne({ where: { email } });

        // If the user does not exist, create a new user in the database
        if (!user) {
          user = await this.userRepository.save({ email, username, isSocialLogin: true });
        }

        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + 6);

        const data = {
          userId: user.id,
          appName: 'HackCity',
        };
        const accessToken = this.jwtAuthService.createToken(data);
        const token = this.tokenRepository.create({ accessToken, user, isActive: true, expiredAt: expirationTime });
        await this.tokenRepository.save(token);

        const socialLogin = this.socialLoginRepository.create({
          provider: googleUser.user.provider,
          providerId: googleUser.user.providerId,
          user,
        });
        await this.socialLoginRepository.save(socialLogin);

        return {
          message: 'Google authentication successful',
          user,
          accessToken,
        };
      } else {
        throw new Error('Invalid Google user response');
      }
    } catch (error) {
      throw error;
    }
  }
}
