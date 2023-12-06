import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Next,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleGuard } from './guards/google.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-dto';
import { ForgotPasswordRequestDTO } from './dto/forgot-password.dto';
import { UserService } from 'src/user/user.service';
import { ResetPasswordRequestDTO } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private userService: UserService) {}

  @Get('/google')
  @UseGuards(GoogleGuard)
  async googleAuth(@Req() req) {}

  @Get('/google/redirect')
  @UseGuards(GoogleGuard)
  googleAuthRedirect(@Req() req) {
    return this.authService.handleGoogleAuthRedirect(req);
  }

  @Post('/register')
  async registerIndividual(@Req() req, @Res() res, @Body() body: CreateUserDto, @Next() next) {
    try {
      const user = await this.authService.localRegisterUser(body);
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.OK,
        data: user,
        message: 'success',
      });
    } catch (error) {
      next(error);
    }
  }

  @Post('/login')
  async login(@Body() body: LoginUserDto, @Res() res, @Req() req, @Next() next) {
    try {
      const user = await this.authService.loginUser(body);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: user,
        message: 'success',
      });
    } catch (error) {
      next(error);
    }
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordRequestDTO, @Res() res, @Req() req, @Next() next) {
    try {
      const { email } = body;

      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        throw new BadRequestException('Invalid email address');
      }
      const token = await this.authService.generateResetPasswordToken(user);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: token,
        message: 'success',
      });
    } catch (error) {
      next(error);
    }
  }

  @Post('/reset-password')
  async resetPassword(@Body() body: ResetPasswordRequestDTO, @Res() res, @Req() req, @Next() next) {
    try {
      const { token, newPassword, confirmPassword } = body;

      if (newPassword !== confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }

      const user = await this.authService.resetPassword(token, newPassword);
      if (!user) {
        throw new UnauthorizedException('Invalid or expired reset password token');
      }
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: user,
        message: 'reset password successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res, @Req() req, @Next() next) {
    try {
      const userObject = req.user;
      await this.authService.logoutUser(userObject);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}
