import {
   Body,
   ClassSerializerInterceptor,
   Controller,
   Delete,
   Get,
   Param,
   ParseIntPipe,
   Patch,
   Post,
   UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@ApiTags('category')
@Controller('category')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoryController {
   constructor(private readonly categoryService: CategoryService) {}

   @Post()
   create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
      return this.categoryService.create(createCategoryDto);
   }

   @Get()
   findAll(): Promise<Category[]> {
      return this.categoryService.findAll();
   }

   @Get(':id')
   findOne(@Param('id', ParseIntPipe) id: number) {
      return this.categoryService.findOne(+id);
   }

   @Patch(':id')
   update(
      @Param('id') id: string,
      @Body() updateCategoryDto: UpdateCategoryDto,
   ) {
      return this.categoryService.update(+id, updateCategoryDto);
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.categoryService.remove(+id);
   }
}
