import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { newProfile } from './dto/newProfile.dto';
import { oneProfile } from './dto/oneProfile.dto';
import { profile } from './dto/profile.dto';
import { Profile } from './profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private ProfileRepository: Repository<Profile>,
  ) {}

  async getOneProfile(data: oneProfile) {
    try {
      const Profile = await this.ProfileRepository.findOne({
        where: { idUser: data.idUser },
      });

      if (!Profile) {
        return new ConflictException(
          `Пользователя с id: ${data.idUser} не существует`,
        ).message;
      }

      return Profile;
    } catch (err) {
      const result = new ConflictException(
        `Пользователя с id: ${data.idUser} не существует`,
        err,
      );
      return result.message;
    }
  }

  async getProfiles() {
    const Profiles = await this.ProfileRepository.find();
    return Profiles;
  }

  async createProfile(Profile: newProfile) {
    const id = Profile.idUser;
    const isProfileExist = await this.ProfileRepository.findOne({
      where: { idUser: id },
    });

    if (isProfileExist) {
      const result = new ConflictException('Логин уже занят');
      return result.message;
    }
    const newProfile = await this.ProfileRepository.save(Profile);
    return { ProfileId: newProfile.idProfile };
  }

  async updateProfile(Profile: profile) {
    try {
      const id = Profile.idProfile;
      console.log(id);
      const isProfileExist = await this.ProfileRepository.findOne({
        where: { idProfile: id },
      });
      await this.ProfileRepository.save({ ...isProfileExist, ...Profile });
      return 'Пользователь изменен!';
    } catch (e) {
      const result = new ConflictException('Введите все правильно!');
      return result.message;
    }
  }

  async deleteProfile(data: oneProfile) {
    try {
      console.log(data);

      const Profile = await this.ProfileRepository.findOne({
        where: { idProfile: data.idUser },
      });
      await this.ProfileRepository.remove(Profile);

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
