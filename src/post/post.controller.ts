import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Next, Req, Res, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() createPostDto: CreatePostDto, @Req() req, @Res() res, @Next() next) {
    try {
      const userObject = req.user;
      const newPost = await this.postService.create(userObject, createPostDto);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: newPost,
        message: 'success',
      });
    } catch (error) {
      next(error.message);
    }
  }

  @Get('/all')
  @UseGuards(JwtAuthGuard)
  async findAllPosts(@Req() req, @Res() res, @Next() next) {
    try {
      const allPosts = await this.postService.findAll();
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: allPosts,
        message: 'success',
      });
    } catch (error) {
      next(error.message);
    }
    return this.postService.findAll();
  }

  @Patch('/update/:postId')
  @UseGuards(JwtAuthGuard)
  async updatePost(@Body() updatePostDto: UpdatePostDto, @Param('postId') postId: string, @Req() req, @Res() res, @Next() next) {
    try {
      const updatedPost = await this.postService.edit(postId, updatePostDto);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: updatedPost,
        message: 'success',
      });
    } catch (error) {
      next(error.message);
    }
  }

  @Delete('/delete/:postId')
  @UseGuards(JwtAuthGuard)
  async deletePost(@Param('postId') postId: string, @Req() req, @Res() res, @Next() next): Promise<void> {
    try {
      await this.postService.delete(postId);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'success',
      });
    } catch (error) {
      next(error.message);
    }
  }
}
