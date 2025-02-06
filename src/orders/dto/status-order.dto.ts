import { IsEnum, IsString } from 'class-validator';
import { OrderStatus } from '../interfaces/order.interface';

export class StatusOrderDto {
    @IsString()
    @IsEnum(OrderStatus, {
        message: `status must be a valid enum value: ${Object.values(OrderStatus).join(', ')}`,
    })
    public status: OrderStatus;
}
