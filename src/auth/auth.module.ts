import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.stratey';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt-auth.service';
import { User } from 'src/user/entities/user.entity';
import { SocialLogin } from 'src/user/entities/social-login.entity';
import { Token } from 'src/user/entities/token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user', session: false }),
    JwtModule.register({
      privateKey: process.env.PRIVATE_KEY,
      publicKey: process.env.PUBLIC_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN, algorithm: 'RS256' },
    }),
    TypeOrmModule.forFeature([User, SocialLogin, Token]),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy, JwtAuthService],
  exports: [AuthService, JwtModule, PassportModule, JwtStrategy, JwtAuthService],
})
export class AuthModule {}
