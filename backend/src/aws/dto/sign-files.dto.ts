import { IsString } from 'class-validator';

export class SignFilesDto {
   @IsString({ each: true })
   fileNames!: string[];
}
