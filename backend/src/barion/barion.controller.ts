import {
   BadRequestException,
   Body,
   Controller,
   HttpCode,
   Logger,
   Post,
   Query,
   UseGuards,
} from '@nestjs/common';
import { CookieAuthGuard } from 'src/auth/guards/cookie-auth.guard';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { BarionService } from './barion.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';

@Controller('barion')
export class BarionController {
   logger = new Logger(BarionController.name);

   constructor(private barionService: BarionService) {}

   @UseGuards(CookieAuthGuard)
   @Post()
   async initializePayment(
      @CurrentUser() user: User,
      @Body() dto: InitializePaymentDto,
   ): Promise<{ barionGatewayUrl: string }> {
      const barionGatewayUrl = await this.barionService.initializePayment(
         user,
         dto.productIds,
      );
      return { barionGatewayUrl };
   }

   @Post('callback')
   @HttpCode(200)
   async barionCallback(@Query('paymentId') paymentId: string) {
      if (!paymentId) {
         this.logger.error(`Bad request, paymentId: ${paymentId}`);
         throw new BadRequestException();
      }
      const { message } = await this.barionService.processPayment(paymentId);

      this.logger.debug(`Returning message '${message}'`);

      return { message };
   }
}
