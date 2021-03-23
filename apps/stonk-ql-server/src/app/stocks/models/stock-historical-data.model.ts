import { Field, Float, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class StockHistoricalData {
  @Field(type => String)
  date: string;

  @Field(type => Float)
  close: number;

  @Field(type => Int)
  id: number;
}
