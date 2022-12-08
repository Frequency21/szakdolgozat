import {
   Body,
   ClassSerializerInterceptor,
   Controller,
   Delete,
   Get,
   Param,
   ParseIntPipe,
   Post,
   UseGuards,
   UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { CookieAuthGuard } from 'src/auth/guards/cookie-auth.guard';
import { Product } from 'src/product/entities/product.entity';
import { BuyerRatingStatisticsDto } from 'src/rating/dto/buyer-rating-statistics.dto';
import { SellerRatingStatisticsDto } from 'src/rating/dto/seller-rating-statistics.dto';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
   constructor(private userService: UserService) {}

   @UseGuards(CookieAuthGuard)
   @ApiCreatedResponse({
      type: User,
      description: 'Update user',
   })
   @Post()
   async updateUser(
      @Body() updateUserDto: UpdateUserDto,
      @CurrentUser() user: User,
   ) {
      const res = await this.userService.updateUser(user.id, updateUserDto);
      return plainToClass(User, res);
   }

   @UseGuards(CookieAuthGuard)
   @Get('basket')
   getBasket(@CurrentUser() user: User): Promise<Product[]> {
      return this.userService.getBasket(user);
   }

   @UseGuards(CookieAuthGuard)
   @Post('basket/:productId')
   addToBasket(
      @Param('productId', ParseIntPipe) productId: number,
      @CurrentUser() user: User,
   ): Promise<void> {
      return this.userService.addProductToBasket(user, productId);
   }

   @UseGuards(CookieAuthGuard)
   @Delete('basket/:productId')
   removeFromBasket(
      @Param('productId', ParseIntPipe) productId: number,
      @CurrentUser() user: User,
   ): Promise<void> {
      return this.userService.removeProductFromBasket(user, productId);
   }

   @Get('statistics/:id')
   getStatistics(@Param('id') id: number): Promise<{
      profileData: Pick<User, 'email' | 'name' | 'picture'>;
      sellerRatingStatistics: SellerRatingStatisticsDto | undefined;
      buyerRatingStatistics: BuyerRatingStatisticsDto | undefined;
   }> {
      return this.userService.getStatisticsForUser(id);
   }
}
