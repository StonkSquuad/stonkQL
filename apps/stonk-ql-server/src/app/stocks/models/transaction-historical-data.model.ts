import { Field, Float, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TransactionHistoricalData {
  @Field(type => String)
  date: string;

  @Field(type => Float)
  close: number;
}
