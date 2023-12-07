import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
  ) {}

  async create(user: User, createPostDto: CreatePostDto) {
    const post = new Post();
    post.author = user;
    post.authorId = user.id;
    post.title = createPostDto.title;
    post.content = createPostDto.content;

    if (createPostDto.categories && createPostDto.categories.length > 0) {
      const categories = await this.categoryRepository.findBy({
        id: In(createPostDto.categories),
      });
      post.categories = categories;
    }
    return await this.postRepository.save(post);
  }

  async edit(postId: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findPostById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.title = updatePostDto.title;
    post.content = updatePostDto.content;

    if (updatePostDto.categories && updatePostDto.categories.length > 0) {
      const categories = await this.categoryRepository.findBy({
        id: In(updatePostDto.categories),
      });
      post.categories = categories;
    }

    await this.postRepository.save(post);
    return post;
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find();
  }

  async findPostById(id: string): Promise<Post> {
    return this.postRepository.findOneBy({
      id,
    });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async delete(id: string): Promise<void> {
    await this.postRepository.delete({ id });
  }
}
