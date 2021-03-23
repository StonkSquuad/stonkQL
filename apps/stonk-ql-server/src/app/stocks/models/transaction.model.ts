
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Transaction {
  @Field({ nullable: true })
  tickerSymbol: string;

  @Field({ nullable: true })
  quantity: number;

  @Field({ nullable: true })
  transactionResult: boolean;
}