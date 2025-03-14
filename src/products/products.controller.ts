import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config/services';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

    @Post()
    createProduct(@Body() product: CreateProductDto) {
        return this.client.send('products.create', product);
    }

    @Get()
    findAll(@Query() paginationDto: PaginationDto) {
        return this.client.send('products.findAll', paginationDto);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.client.send('products.findOne', { id }).pipe(
            catchError((error: RpcException) => {
                throw new RpcException(error);
            }),
        );
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() product: UpdateProductDto,
    ) {
        return this.client.send('products.update', { id, ...product }).pipe(
            catchError((error: RpcException) => {
                throw new RpcException(error);
            }),
        );
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.client.send('products.delete', { id }).pipe(
            catchError((error: RpcException) => {
                throw new RpcException(error);
            }),
        );
    }
}
