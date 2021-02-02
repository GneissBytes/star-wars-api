import { IsString, Matches } from 'class-validator';

export class CategoryDto {
  @IsString()
  @Matches(/^[a-zA-Z]+\b/, { message: 'Category parameter can contain letters only' })
  category: string;
}
