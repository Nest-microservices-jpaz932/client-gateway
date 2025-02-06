import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common';
import { OrderStatus } from '../interfaces/order.interface';

export class OrderPaginationDto extends PaginationDto {
    @IsOptional()
    @IsEnum(OrderStatus, {
        message: `status must be a valid enum value: ${Object.values(OrderStatus).join(', ')}`,
    })
    public status?: string;
}
