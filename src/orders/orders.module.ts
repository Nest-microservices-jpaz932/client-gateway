import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { OrdersController } from './orders.controller';
import { envs } from 'src/config/envs';
import { ORDERS_SERVICE } from 'src/config/services';

@Module({
    controllers: [OrdersController],
    providers: [],
    imports: [
        ClientsModule.register([
            {
                name: ORDERS_SERVICE,
                transport: Transport.TCP,
                options: {
                    host: envs.ordersMicroserviceHost,
                    port: envs.ordersMicroservicePort,
                },
            },
        ]),
    ],
})
export class OrdersModule {}
