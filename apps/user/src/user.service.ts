import { UserModel } from "./user.model";
import { User } from "./types/user";
import {
  UndefinedUserError,
  UsedEmailError,
  ValidationError,
} from "./utils/errors";
import { hashPassword } from "./utils/hashPassword";
import {
  userSchemaValidation,
  userUpdateSchemaValidation,
} from "./utils/userSchemaValidation";
import { logger } from "./config/loggerConfig";

export async function getAllUsersService() {
  return UserModel.find({});
}

export async function createUserService(userData:  User) {
  const { email, password } = userData;

  const validationResult = userSchemaValidation.safeParse(userData);
  if (!validationResult.success) {
    logger.error("Invalid user data");
    throw new ValidationError("Invalid user data");
  }

  const doesUserExist = await UserModel.findOne({ email });
  if (doesUserExist) {
    logger.error("Email is already in use");
    throw new UsedEmailError();
  }

  const hashedPassword = await hashPassword(password);

  const user = {
    ...userData,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const newUser = new UserModel(user);
  await newUser.save();

  logger.info({ user }, "User created successfully");

  return newUser;
}

export async function getUserByIDService(id: string) {
  const user = await UserModel.findOne({ "_id": id });
  if (!user) {
    logger.error("The user does not exist");
    throw new UndefinedUserError();
  }
  return user;
}

export async function updateUserByIDService(id: string, userData:  User) {
  const validationResult = userUpdateSchemaValidation.safeParse(userData);
  if (!validationResult.success) {
    logger.error("Invalid user data");
    throw new ValidationError("Invalid user data");
  }

  const user = await UserModel.findOneAndUpdate(
    { "_id": id },
    { ...userData, updatedAt: new Date().toISOString() },
    { new: true },
  );
  if (!user) {
    logger.error("The user does not exist");
    throw new UndefinedUserError();
  }

  logger.info({ user }, "User updated successfully");

  return user;
}

export async function deleteUserByIdService(id: string) {
  const result = await UserModel.deleteOne({ "_id": id });

  if (!result.deletedCount) {
    logger.error("The user does not exist");
    throw new UndefinedUserError();
  }

  logger.info("User deleted successfully");

  return result;
}
