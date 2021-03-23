
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Transaction {
  @Field({ nullable: true })
  ticker: string;

  @Field({ nullable: true })
  totalStockValue: number | null;

  @Field({ nullable: true })
  totalCashValue: number;

  @Field({ nullable: true })
  currentPrice: number;
}