import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from 'src/config/envs';
import { PRODUCT_SERVICE } from 'src/config/services';

@Module({
    controllers: [ProductsController],
    providers: [],
    imports: [
        ClientsModule.register([
            {
                name: PRODUCT_SERVICE,
                transport: Transport.TCP,
                options: {
                    host: envs.productsMicroserviceHost,
                    port: envs.productsMicroservicePort,
                },
            },
        ]),
    ],
})
export class ProductsModule {}
