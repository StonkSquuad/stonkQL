
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Stock {
  @Field(type => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  price: number;

  @Field({ nullable: true })
  companyName: string;
}
