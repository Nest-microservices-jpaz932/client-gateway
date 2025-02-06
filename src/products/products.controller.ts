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
import { PRODUCT_SERVICE } from 'src/config/services';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
    constructor(
        @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
    ) {}

    @Post()
    createProduct(@Body() product: CreateProductDto) {
        return this.productsClient.send({ cmd: 'createProduct' }, product);
    }

    @Get()
    findAll(@Query() paginationDto: PaginationDto) {
        return this.productsClient.send(
            { cmd: 'findAllProducts' },
            paginationDto,
        );
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productsClient.send({ cmd: 'findOneProduct' }, { id }).pipe(
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
        return this.productsClient
            .send({ cmd: 'updateProduct' }, { id, ...product })
            .pipe(
                catchError((error: RpcException) => {
                    throw new RpcException(error);
                }),
            );
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productsClient.send({ cmd: 'deleteProduct' }, { id }).pipe(
            catchError((error: RpcException) => {
                throw new RpcException(error);
            }),
        );
    }
}
