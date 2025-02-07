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
import { ORDERS_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { firstValueFrom } from 'rxjs';
import { Order } from './interfaces/order.interface';
import { OrderPaginationDto } from './dto/pagination-order.dto';
import { PaginationDto } from 'src/common';
import { StatusOrderDto } from './dto/status-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(
        @Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy,
    ) {}

    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersClient.send({ cmd: 'createOrder' }, createOrderDto);
    }

    @Get()
    findAll(@Query() paginationDto: OrderPaginationDto) {
        return this.ordersClient.send({ cmd: 'findAllOrders' }, paginationDto);
    }

    @Get('id/:id')
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Order> {
        try {
            return await firstValueFrom<Order>(
                this.ordersClient.send({ cmd: 'findOneOrder' }, { id }),
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
            return this.ordersClient.send(
                { cmd: 'findAllOrders' },
                { status: statusDto.status, ...paginationDto },
            );
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
            return this.ordersClient.send(
                { cmd: 'changeOrderStatus' },
                { id, status: updateOrderDto.status },
            );
        } catch (error) {
            throw new RpcException(error as RpcException);
        }
    }
}
