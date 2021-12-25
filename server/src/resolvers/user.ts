import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { MyContext } from '../types';
import { User } from '../entities/User';
import * as argon2 from 'argon2';
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from '../constants';
import { sendEmail } from '../utils/sendEmail';
import { v4 } from 'uuid';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
  @Field()
  email: string;
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
  @Mutation(() => UserResponse, {nullable: true})
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() {req, em, redis}: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length < 8) {
      return {
        errors: [
          {
            field: 'newPassword',
            message: 'password must be at least 8 characters'
          }
        ]
      };
    }
    const userId = await redis.get(FORGOT_PASSWORD_PREFIX + token);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired"
          }
        ]
      };
    }

    const user = await em.findOne(User, {id: parseInt(userId, 10)});
    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'User no longer exists'
          }
        ]
      };
    }

    user.password = await argon2.hash(newPassword);
    await em.persistAndFlush(user);

    req.session.userId = user.id;
    await redis.del(FORGOT_PASSWORD_PREFIX + token);
    return {
      user
    };
  }

  @Query(() => User, {nullable: true})
  async me(@Ctx() {em, req}: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    return await em.findOne(User, {id: req.session.userId});
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() {em, req}: MyContext
  ): Promise<UserResponse> {
    if (options.username.includes('@')) {
      return {
        errors: [
          {
            field: 'username',
            message: 'cannot include an @'
          }
        ]
      };
    }
    if (!options.email.includes('@')) {
      return {
        errors: [
          {
            field: 'email',
            message: 'invalid email'
          }
        ]
      };
    }
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
    if (options.password.length < 8) {
      return {
        errors: [
          {
            field: 'password',
            message: 'password must be at least 8 characters'
          }
        ]
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      email: options.email,
      password: hashedPassword
    });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.detail.includes('already exists')) {
        return {
          errors: [
            {
              field: 'email',
              message: 'this is taken already'
            },
            {
              field: 'username',
              message: 'or this is taken already'
            }
          ]
        };
      }
    }

    req.session.userId = user.id;
    return {
      user
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() {em, req}: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, usernameOrEmail.includes('@')
      ? {email: usernameOrEmail}
      : {username: usernameOrEmail});
    if (!user) {
      return {
        errors: [
          {
            field: 'usernameOrEmail',
            message: `User not found`
          },
        ]
      };
    }
    const isPasswordValid = await argon2.verify(user.password, password);
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

    req.session.userId = user.id;

    return {
      user
    };
  }

  @Mutation(() => Boolean)
  async logout(
    @Ctx() {req, res}: MyContext
  ) {
    return new Promise(resolve => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(err);
          return;
        }

        resolve(true);
      });
    });
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() {em, redis}: MyContext
  ) {
    const user = await em.findOne(User, {email: email});
    if (!user) {
      // email is not in the db
      return true;
    }

    const token = v4();
    await redis.set(FORGOT_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 60 * 24);

    await sendEmail(
      email,
      'Password recovery',
      `<a href="http://localhost:3000/change-password/${token}">Reset password</a>`
    );

    return true;
  }
}
