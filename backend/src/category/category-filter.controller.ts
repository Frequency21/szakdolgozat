import {
   Body,
   ClassSerializerInterceptor,
   Controller,
   Delete,
   Param,
   Post,
   UseGuards,
   UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CookieAuthGuard } from 'src/auth/guards/cookie-auth.guard';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CategoryFilterService } from './category-filter.service';
import { CreateCategoryFilterDto } from './dto/create-category-filter.dto';

@ApiTags('category-filter')
@Controller('category-filter')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoryFilterController {
   constructor(private readonly categoryFilterService: CategoryFilterService) {}

   @UseGuards(CookieAuthGuard)
   @Post()
   async create(
      @Body() createCategoryFilter: CreateCategoryFilterDto,
      @CurrentUser() user: User,
   ) {
      await this.categoryFilterService.create(createCategoryFilter, user.id);
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.categoryFilterService.remove(+id);
   }
}
