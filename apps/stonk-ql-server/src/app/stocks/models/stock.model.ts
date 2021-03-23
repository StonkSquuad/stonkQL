
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Stock {

  @Field({ nullable: true })
  ticker: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  market: string;

  @Field({ nullable: true })
  locale: string;

  @Field({ nullable: true })
  currency: string;

  @Field({ nullable: true })
  active: boolean;

  @Field({ nullable: true })
  primaryExch: string;

  @Field({ nullable: true })
  updated: string;
  
  @Field({ nullable: true })
  url: string;
}
