import { model, Schema, Document } from 'mongoose';

import { User } from '../interfaces/users.interface';

// User schema
const userSchema: Schema = new Schema({
  email: {
    required: true,
    unique: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  heroUrl: {
    type: String,
  },
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
