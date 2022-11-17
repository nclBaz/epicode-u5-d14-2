import { Model, Document } from "mongoose"

interface User {
  firstName: string
  lastName: string
  email: string
  password: string
  role: "User" | "Admin"
}

export interface UserDocument extends User, Document {}

export interface UsersModel extends Model<UserDocument> {
  checkCredentials(email: string, plainPassword: string): Promise<UserDocument | null>
}
