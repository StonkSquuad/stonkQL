import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class StockHistoricalData {
  @Field(type => Int)
  date: number;

  @Field(type => Int)
  close: number;
}
