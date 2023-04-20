import {
  Injectable,
  HttpException,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';


import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { oneUser } from './dto/oneUser.dto';
import { newUser } from './dto/newUser.dto';
import { userDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async generateToken(user: User) {
    const payload = { idUser: user.userId, role: user.role };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async login(login: string, password: string) {
    try {
      const user = await this.userRepository.findOneBy({ login });
      if (!user) {
        return new HttpException(
          `Неверный логин или пароль`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const isPassEquals = await bcrypt.compare(password, user.password);
      if (!isPassEquals) {
        return new HttpException(
          `Неверный логин или пароль`,
          HttpStatus.BAD_REQUEST,
        );
      }
      return this.generateToken(user);
    } catch (e) {
      return e.message;
    }
  }

  async getOneUser(data: oneUser) {
    try {
      const user = await this.userRepository.findOne({
        where: { userId: data.idUser },
      });

      if (!user) {
        return new ConflictException(
          `Пользователя с id: ${data.idUser} не существует`,
        ).message;
      }

      return user;
    } catch (err) {
      const result = new ConflictException(
        `Пользователя с id: ${data.idUser} не существует`,
        err,
      );
      return result.message;
    }
  }

  async getUsers() {
    const users = await this.userRepository.find();
    return users;
  }

  async createUser(user: newUser) {
    const login = user.login;
    const isUserExist = await this.userRepository.findOneBy({ login });

    if (isUserExist) {
      const result = new ConflictException('Логин уже занят');
      return result.message;
    }
    user.password = await bcrypt.hash(user.password, 2);
    const newUser = await this.userRepository.save(user);

    return { userId: newUser.userId };
  }

  async updateUser(user: userDto) {
    try {
      const id = user.idUser;
      const isUserExist = await this.userRepository.findOne({
        where: { userId: id },
      });
      await this.userRepository.save({ ...isUserExist, ...user });
      return 'Пользователь изменен!';
    } catch (e) {
      const result = new ConflictException('Неверные данные');
      return result.message;
    }
  }

  async deleteUser(data: oneUser) {
    console.log(data);
    try {
      const user = await this.userRepository.findOne({
        where: { userId: data.idUser },
      });
      await this.userRepository.remove(user);

      return `Пользователь с id: ${data.idUser} удален`;
    } catch (error) {
      const result = new ConflictException(
        `Пользователя с id: ${data.idUser} не существует`,
        error,
      );
      return result.message;
    }
  }
}
