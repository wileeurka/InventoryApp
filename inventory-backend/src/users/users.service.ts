import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async updateEmail(userId: string, dto: UpdateEmailDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();

    const passwordOk = await bcrypt.compare(dto.currentPassword, user.password);
    if (!passwordOk)
      throw new BadRequestException('Nieprawidłowe aktualne hasło');

    const existing = await this.usersRepository.findOne({
      where: { email: dto.newEmail },
    });
    if (existing) throw new ConflictException('Ten e-mail jest już zajęty');

    user.email = dto.newEmail;
    await this.usersRepository.save(user);
    return { message: 'E-mail został zmieniony' };
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();

    const passwordOk = await bcrypt.compare(dto.currentPassword, user.password);
    if (!passwordOk)
      throw new BadRequestException('Nieprawidłowe aktualne hasło');

    user.password = await bcrypt.hash(dto.newPassword, 12);
    await this.usersRepository.save(user);
    return { message: 'Hasło zostało zmienione' };
  }
}
