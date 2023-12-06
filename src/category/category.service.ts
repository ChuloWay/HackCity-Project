import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) {}

  async create(name: string): Promise<Category> {
    const category = await this.findCategoryByName(name);
    if (category) {
      throw new BadRequestException('Category with same name already exist');
    }
    const newCategory = this.categoryRepository.create({ name });
    return await this.categoryRepository.save(newCategory);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findCategoryById(id: string): Promise<Category> {
    return this.categoryRepository.findOneBy({
      id,
    });
  }

  async findCategoryByName(name: string): Promise<Category> {
    return this.categoryRepository.findOneBy({
      name,
    });
  }

  async update(categoryId: string, name: string): Promise<Category | null> {
    const existingCategory = await this.findCategoryByName(name);
    if (existingCategory) {
      throw new BadRequestException('Category with same name already exists');
    }

    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    category.name = name;
    await this.categoryRepository.save(category);
    return category;
  }

  async delete(id: string): Promise<void> {
    await this.categoryRepository.delete({ id });
  }
}
