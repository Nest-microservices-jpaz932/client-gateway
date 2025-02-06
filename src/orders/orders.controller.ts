import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Inject,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ORDERS_SERVICE } from 'src/config/services';
import { ClientGrpcProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { firstValueFrom } from 'rxjs';
import { Order } from './interfaces/order.interface';

@Controller('orders')
export class OrdersController {
    constructor(
        @Inject(ORDERS_SERVICE) private readonly ordersClient: ClientGrpcProxy,
    ) {}

    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersClient.send({ cmd: 'createOrder' }, createOrderDto);
    }

    @Get()
    findAll() {
        return this.ordersClient.send({ cmd: 'findAllOrders' }, {});
    }

    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Order> {
        try {
            return await firstValueFrom<Order>(
                this.ordersClient.send({ cmd: 'findOneOrder' }, { id }),
            );
        } catch (error) {
            throw new RpcException(error as RpcException);
        }
    }
}
