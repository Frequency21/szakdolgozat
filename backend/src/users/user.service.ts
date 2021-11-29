import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entities/users.entity';

@Injectable()
export class UserService {
   constructor(
      @InjectModel(User.name) private userModel: Model<UserDocument>,
   ) {}

   async createUser(createUserDto: CreateUserDto): Promise<User> {
      const createdUser = new this.userModel(createUserDto);
      return createdUser.save();
   }

   async findAll(): Promise<User[]> {
      return this.userModel.find().exec();
   }
}
