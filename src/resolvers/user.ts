import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import { MyContext } from '../types';
import { User } from '../entities/User';
import * as argon2 from 'argon2';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[];
  @Field(() => User, {nullable: true})
  user?: User;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() {em}: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: 'username',
            message: 'username too short'
          }
        ]
      };
    }
    if (options.password.length <= 7) {
      return {
        errors: [
          {
            field: 'password',
            message: 'password must be at least 8 characters'
          }
        ]
      }
    }
    const existingUser = await em.findOne(User, {username: options.username})
    if (existingUser) {
      return {
        errors: [
          {
            field: 'username',
            message: 'this username is already taken'
          }
        ]
      }
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword
    });
    await em.persistAndFlush(user);

    return {
      user
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() {em}: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {username: options.username});
    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: `Couldn't fiend such a user with login ${options.username}`
          },
        ]
      };
    }
    const isPasswordValid = await argon2.verify(user.password, options.password);
    if (!isPasswordValid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Wrong password'
          }
        ]
      };
    }

    return {
      user
    };
  }
}
