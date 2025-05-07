import {
    createParamDecorator,
    ExecutionContext,
    InternalServerErrorException,
} from '@nestjs/common';
import { UserI } from '../interfaces/user.interfacce';

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<{ user?: UserI }>();

        if (!request.user) {
            throw new InternalServerErrorException(
                'User not found in request object',
            );
        }

        return request.user;
    },
);
