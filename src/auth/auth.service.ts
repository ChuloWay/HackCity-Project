import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtAuthService } from './jwt-auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from 'src/user/entities/token.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SocialLogin } from 'src/user/entities/social-login.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dto/login-dto';
import { compare } from 'bcryptjs';
import { UserLoginResponse } from './interface/login.response';
import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import dataSource from 'src/database/dbConfig';
const logger = new Logger('AuthService');
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
    private readonly userService: UserService,
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

  private async comparePassword(newPassword: string, passwordHash: string): Promise<boolean> {
    try {
      return await compare(newPassword, passwordHash);
    } catch (error) {
      logger.error(`Error during Google authentication: ${error.message}`, error.stack);
      return false;
    }
  }

  private async deleteTokensForUser(userId: string) {
    await this.tokenRepository.createQueryBuilder('tokens').delete().from(Token).where('user.id = :userId', { userId: userId }).execute();
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
      logger.error(`Error during Google authentication: ${error.message}`, error.stack);
      throw error;
    }
  }

  async localRegisterUser(createUserDTO: CreateUserDto) {
    const { email } = createUserDTO;

    // Check if the user with this email exists
    const checkEmail = await this.userService.findOneByEmail(email);
    if (checkEmail) {
      throw new HttpException('An account with this email address already exists.', HttpStatus.BAD_REQUEST);
    }

    return await this.userService.createUser(createUserDTO);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserLoginResponse> {
    const { email, password } = loginUserDto;

    const user = await this.userService.findOneByEmailQuery(email);
    if (!user) {
      throw new NotFoundException('Email does not exist');
    }

    // Check if the given password matches the saved password
    const isValid = await this.comparePassword(password, user.password);
    console.log('data for password here', password, user.password, isValid);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 6);

    const { id } = user;
    const data = {
      id,
      appName: 'HackCity',
    };
    // Generate JWT token
    const accessToken = this.jwtAuthService.createToken(data);
    const token = this.tokenRepository.create({ accessToken, user, isActive: true, expiredAt: expirationTime });
    await this.tokenRepository.save(token);

    // Remove sensitive data from the user object
    delete user.password;

    return { user, token: accessToken };
  }

  async generateResetPasswordToken(user: User): Promise<string> {
    const token = uuidv4();
    const expirationDate = new Date(Date.now() + 60 * 60 * 1000);

    // Delete existing active tokens for the user
    await this.deleteTokensForUser(user.id);

    const newToken = new Token();
    newToken.user = user;
    newToken.accessToken = token;
    newToken.isActive = true;
    newToken.expiredAt = expirationDate;

    await this.tokenRepository.save(newToken);

    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<User | null> {
    const userToken = await this.tokenRepository.findOne({ where: { accessToken: token }, relations: ['user'] });
    if (!userToken || userToken.expiredAt < new Date()) {
      return null;
    }

    const user = userToken.user;

    console.log('user here', user);
    user.password = newPassword;

    await dataSource.manager.transaction(async (entityManager) => {
      await entityManager.save(user);
      await entityManager.remove(userToken);
    });

    // Remove sensitive data from the user object
    delete user.password;

    return user;
  }
}
