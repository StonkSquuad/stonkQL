import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { FooResolver } from './app.service';



@Module({
  imports: [
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      playground: true,
      debug: true
    }),
  ],
  providers: [FooResolver],
})
export class AppModule {}
