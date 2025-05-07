import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config/services';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';
import { User } from './decorators/user.decorator';
import { UserI } from './interfaces/user.interfacce';
import { Token } from './decorators/token.decorator';

@Controller('auth')
export class AuthController {
    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

    @Post('login')
    login(@Body() loginUserDto: LoginDto) {
        return this.client.send('auth.login.user', loginUserDto).pipe(
            catchError((error) => {
                throw new RpcException(error as RpcException);
            }),
        );
    }

    @Post('register')
    register(@Body() registerUserDto: RegisterDto) {
        return this.client.send('auth.register.user', registerUserDto).pipe(
            catchError((error) => {
                throw new RpcException(error as RpcException);
            }),
        );
    }

    @UseGuards(AuthGuard)
    @Get('verify')
    verify(@User() user: UserI, @Token() token: string) {
        return {
            user,
            token,
        };
    }
}
