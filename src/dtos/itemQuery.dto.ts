import { IsNumberString, IsString, Matches } from 'class-validator';

export class ItemDto {
  @IsString()
  @Matches(/^[a-zA-Z]+\b/, { message: 'Category parameter can contain letters only' })
  category: string;
  @IsNumberString()
  id: number;
}
