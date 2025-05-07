import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Inject,
    ParseUUIDPipe,
    Query,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { NATS_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { firstValueFrom } from 'rxjs';
import { Order } from './interfaces/order.interface';
import { OrderPaginationDto } from './dto/pagination-order.dto';
import { PaginationDto } from 'src/common';
import { StatusOrderDto } from './dto/status-order.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('orders')
export class OrdersController {
    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.client.send('orders.create', createOrderDto);
    }

    @UseGuards(AuthGuard)
    @Get()
    async findAll(@Query() paginationDto: OrderPaginationDto) {
        try {
            return await firstValueFrom<Order[]>(
                this.client.send('orders.findAll', paginationDto),
            );
        } catch (error) {
            throw new RpcException(error as RpcException);
        }
    }

    @UseGuards(AuthGuard)
    @Get('id/:id')
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Order> {
        try {
            return await firstValueFrom<Order>(
                this.client.send('orders.findOne', { id }),
            );
        } catch (error) {
            throw new RpcException(error as RpcException);
        }
    }

    @UseGuards(AuthGuard)
    @Get(':status')
    findByStatus(
        @Param() statusDto: StatusOrderDto,
        @Query() paginationDto: PaginationDto,
    ) {
        try {
            return this.client.send('orders.findByStatus', {
                status: statusDto.status,
                ...paginationDto,
            });
        } catch (error) {
            throw new RpcException(error as RpcException);
        }
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateOrderDto: StatusOrderDto,
    ) {
        try {
            return this.client.send('orders.changeStatus', {
                id,
                status: updateOrderDto.status,
            });
        } catch (error) {
            throw new RpcException(error as RpcException);
        }
    }
}
