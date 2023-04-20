import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class UpdateGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1];
      const user = this.jwtService.verify(token);
      const userId = req.body.idUser;
      if (user.role !== 'ADMIN' && userId != user.idUser) {
        throw new HttpException('Недостаточно прав!', HttpStatus.FORBIDDEN);
      } else return true;
    } catch (e) {
      throw e;
    }
  }
}
