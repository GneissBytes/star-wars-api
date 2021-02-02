import { IsString } from 'class-validator';

export class TokenResponseDto {
  @IsString()
  token: string;

  @IsString()
  message: 'signup' | 'signin';
}
