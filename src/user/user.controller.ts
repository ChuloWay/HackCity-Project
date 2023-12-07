import { Controller, Get, Body, Patch, HttpStatus, Next, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Req() req, @Res() res, @Next() next): Promise<User> {
    try {
      const userObject = req.user;
      const userProfile = await this.userService.getUserProfile(userObject.id);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: userProfile,
        message: 'success',
      });
    } catch (error) {
      next(error.message);
    }
  }

  @Patch('/profile')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req, @Res() res, @Next() next): Promise<User> {
    try {
      const userObject = req.user;
      const updatedUser = await this.userService.updateUserProfile(userObject, updateUserDto);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: updatedUser,
        message: 'success',
      });
    } catch (error) {
      next(error.message);
    }
  }

  @Get('/all')
  @UseGuards(JwtAuthGuard)
  async findAllUsers(@Req() req, @Res() res, @Next() next) {
    try {
      const users = await this.userService.findAll();
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: users,
        message: 'success',
      });
    } catch (error) {
      next(error.message);
    }
  }
}
