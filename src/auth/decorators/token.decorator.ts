import {
    createParamDecorator,
    ExecutionContext,
    InternalServerErrorException,
} from '@nestjs/common';
import { UserI } from '../interfaces/user.interfacce';

export const Token = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx
            .switchToHttp()
            .getRequest<{ user?: UserI; token?: string }>();

        if (!request.token) {
            throw new InternalServerErrorException(
                'Token not found in request object',
            );
        }

        return request.token;
    },
);
