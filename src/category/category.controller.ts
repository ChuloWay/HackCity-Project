import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Next, Req, Res, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() createCategoryDto: CreateCategoryDto, @Req() req, @Res() res, @Next() next): Promise<Category> {
    try {
      const { name } = createCategoryDto;
      const newCategory = await this.categoryService.create(name);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: newCategory,
        message: 'success',
      });
    } catch (error) {
      next(error.message);
    }
  }

  @Get('/list-all')
  @UseGuards(JwtAuthGuard)
  async listAllCategories(@Req() req, @Res() res, @Next() next): Promise<Category[]> {
    try {
      const categories = await this.categoryService.findAll();
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: categories,
        message: 'success',
      });
    } catch (error) {
      next(error.message);
    }
  }

  @Patch('/update/:categoryId')
  @UseGuards(JwtAuthGuard)
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('categoryId') categoryId: string,
    @Req() req,
    @Res() res,
    @Next() next,
  ): Promise<Category> {
    try {
      const { name } = updateCategoryDto;
      const updatedCategory = await this.categoryService.update(categoryId, name);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: updatedCategory,
        message: 'success',
      });
    } catch (error) {
      next(error.message);
    }
  }

  @Delete('/delete/:categoryId')
  @UseGuards(JwtAuthGuard)
  async deleteCategory(@Param('categoryId') categoryId: string, @Req() req, @Res() res, @Next() next): Promise<void> {
    try {
      await this.categoryService.delete(categoryId);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'success',
      });
    } catch (error) {
      next(error.message);
    }
  }
}
