import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/[!@#$%^&*(),.?":{}|<>]/, {
    message: 'Hasło musi zawierać znak specjalny',
  })
  password: string;
}
