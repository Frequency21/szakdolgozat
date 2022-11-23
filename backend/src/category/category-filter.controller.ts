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
import { ApiTags } from '@nestjs/swagger';
import { CookieAuthGuard } from 'src/auth/guards/cookie-auth.guard';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CategoryFilterService } from './category-filter.service';
import { CreateCategoryFilterDto } from './dto/create-category-filter.dto';
import { CategoryFilter } from './entities/category-filter.entity';

@ApiTags('category-filter')
@Controller('category-filter')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoryFilterController {
   constructor(private readonly categoryFilterService: CategoryFilterService) {}

   @UseGuards(CookieAuthGuard)
   @Get()
   getAllFilter(@CurrentUser() user: User): Promise<CategoryFilter[]> {
      return this.categoryFilterService.getAll(user.id);
   }

   @UseGuards(CookieAuthGuard)
   @Post()
   async create(
      @Body() createCategoryFilter: CreateCategoryFilterDto,
      @CurrentUser() user: User,
   ) {
      await this.categoryFilterService.create(createCategoryFilter, user.id);
   }

   @UseGuards(CookieAuthGuard)
   @Delete(':id')
   async remove(
      @Param('id', ParseIntPipe) categoryFilterId: number,
      @CurrentUser() user: User,
   ) {
      await this.categoryFilterService.remove(categoryFilterId, user);
   }
}
