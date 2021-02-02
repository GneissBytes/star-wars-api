import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(process.env.NODE_ENV === 'production' ? 6 : 1, { message: `Password too short. Password must be between ${process.env.NODE_ENV === 'production' ? 6 : 1} and 20 characters long` })
  @MaxLength(30, { message: 'Password too long. Password must be between 6 and 30 characters long' })
  @Matches(process.env.NODE_ENV === 'production' ? /^(?=.*[A-Z]*.*)(?=.*[!@#$&*]*)(?=.*.*[0-9]*)(?=.*[a-z]*.*)$/ : /.*/, { message: 'Password must contain at least one uppercase letter, one special character and at least one number' })
  public password: string;
}
