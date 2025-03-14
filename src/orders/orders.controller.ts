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
} from '@nestjs/common';
import { NATS_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { firstValueFrom } from 'rxjs';
import { Order } from './interfaces/order.interface';
import { OrderPaginationDto } from './dto/pagination-order.dto';
import { PaginationDto } from 'src/common';
import { StatusOrderDto } from './dto/status-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.client.send('orders.create', createOrderDto);
    }

    @Get()
    findAll(@Query() paginationDto: OrderPaginationDto) {
        return this.client.send('orders.findAll', paginationDto);
    }

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
