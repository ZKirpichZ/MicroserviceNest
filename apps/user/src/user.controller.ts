import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import {
  MessagePattern,
  Ctx,
  RmqContext,
  Payload,
} from '@nestjs/microservices';
import { userDto } from './dto/user.dto';
import { oneUser } from './dto/oneUser.dto';


@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}


  @MessagePattern({cmd: 'login'})
  login(@Payload() data: userDto, @Ctx() context: RmqContext) {
    return this.userService.login(data.login, data.password);
  }

  @MessagePattern({ cmd: 'get-user' })
  async getUser(@Ctx() context: RmqContext) {
    const users = await this.userService.getUsers();
    return users;
  }

  @MessagePattern({ cmd: 'get-one-user' })
  async getOneUser(@Payload() data: oneUser, @Ctx() context: RmqContext) {
    const users = await this.userService.getOneUser(data);
    return users;
  }

  @MessagePattern({ cmd: 'create-user' })
  async createUser(@Payload() data: userDto, @Ctx() context: RmqContext) {
    return await this.userService.createUser(data);
  }

  @MessagePattern({ cmd: 'update-user' })
  async updateUser(@Payload() data: userDto, @Ctx() context: RmqContext) {
    return await this.userService.updateUser(data);
  }

  @MessagePattern({ cmd: 'delete-user' })
  async deleteUser(@Payload() data: oneUser, @Ctx() context: RmqContext) {
    return await this.userService.deleteUser(data);
  }
}