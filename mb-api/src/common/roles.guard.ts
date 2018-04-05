import { Guard, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs/Observable';
import { Reflector } from '@nestjs/core';

@Guard()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(req, context: ExecutionContext): boolean {
    const { parent, handler } = context;
    const roles = this.reflector.get<string[]>('roles', handler);
    if (!roles) {
      return true;
    }
    // console.log("reflector.get('roles') ",roles) ;
    const user = req.user;
    const hasRole = () =>
      !!user.roles.find(role => !!roles.find(item => item === role));
    // console.log('roles.guard:', user);
    return user && user.roles && hasRole();
  }
}