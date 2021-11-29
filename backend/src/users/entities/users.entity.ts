import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
   versionKey: false,
})
export class User {
   readonly _id: mongoose.Schema.Types.ObjectId;

   @Prop({ required: true })
   email: string;

   @Prop({ required: true, select: false })
   password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
