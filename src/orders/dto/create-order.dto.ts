import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsPositive,
} from 'class-validator';
import { OrderStatus } from '../interfaces/order.interface';

export class CreateOrderDto {
    @IsNumber()
    @IsPositive()
    public totalAmount: number;

    @IsNumber()
    @IsPositive()
    public totalItems: number;

    @IsEnum(OrderStatus, {
        message: `Status must be one of the following values: ${Object.values(OrderStatus).join(', ')}`,
    })
    @IsOptional()
    public status: OrderStatus = OrderStatus.PENDING;

    @IsOptional()
    @IsBoolean()
    public paid: boolean = false;
}
