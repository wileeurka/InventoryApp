import { IsString, MinLength, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @Matches(/[!@#$%^&*(),.?":{}|<>]/, {
    message: 'Nowe hasło musi zawierać znak specjalny',
  })
  newPassword: string;
}
