
import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class FooResolver {

  @Query(() => String)
  sayHello(): Record<string, string> {
    return 'Hello World';
  }
}
