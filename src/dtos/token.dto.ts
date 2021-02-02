import { IsString, Matches } from 'class-validator';

export class VerifyTokenDto {
  @IsString()
  @Matches(/^Bearer .*/, { message: 'Invalid token' })
  public authorization: string;
}
