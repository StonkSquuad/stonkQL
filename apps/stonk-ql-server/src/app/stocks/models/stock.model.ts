
import { Field, ID, ObjectType } from '@nestjs/graphql';

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
  // @Field()
  // codes: object[];
  @Field({ nullable: true })
  url: string;


  // @Field(type => ID)
  // id: string;

  // @Field()
  // name: string;

  // @Field({ nullable: true })
  // description?: string;

  // @Field({ nullable: true })
  // price: number;

  // @Field({ nullable: true })
  // companyName: string;

  // @Field({ nullable: true })
  // stockTicker: string;
}
