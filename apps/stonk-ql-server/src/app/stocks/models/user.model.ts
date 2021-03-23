
import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class User {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  cashValue: number;
  
  @Field({ nullable: true })
  username: string;

  @Field({ nullable: true })
  stocksOwned: string;

  @Field({ nullable: true })
  stocksCumulativeValue: number;

  @Field({ nullable: true })
  userId: number;
}