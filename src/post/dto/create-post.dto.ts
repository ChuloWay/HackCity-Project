import { IsNotEmpty, IsOptional, IsString, IsArray, IsUUID } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  categories: string[];
}
