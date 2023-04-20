import { Controller, Get } from '@nestjs/common';
import { ProfileService } from './profile.service';
import {
  MessagePattern,
  Ctx,
  RmqContext,
  Payload,
} from '@nestjs/microservices';
import { oneProfile } from './dto/oneProfile.dto';
import { newProfile } from './dto/newProfile.dto';
import { profile } from './dto/profile.dto';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern({ cmd: 'get-profile' })
  async getProfile(@Ctx() context: RmqContext) {
    console.log('ok');

    const profiles = await this.profileService.getProfiles();
    return profiles;
  }

  @MessagePattern({ cmd: 'get-one-profile' })
  async getOneprofile(@Payload() data: oneProfile, @Ctx() context: RmqContext) {
    const profile = await this.profileService.getOneProfile(data);
    return profile;
  }

  @MessagePattern({ cmd: 'create-profile' })
  async createprofile(@Payload() data: newProfile, @Ctx() context: RmqContext) {
    return await this.profileService.createProfile(data);
  }

  @MessagePattern({ cmd: 'update-profile' })
  async updateprofile(@Payload() data: profile, @Ctx() context: RmqContext) {
    return await this.profileService.updateProfile(data);
  }

  @MessagePattern({ cmd: 'delete-profile' })
  async deleteprofile(@Payload() data: oneProfile, @Ctx() context: RmqContext) {
    return await this.profileService.deleteProfile(data);
  }
}
