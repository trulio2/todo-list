import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType('Task')
export class TaskType {
  @Field(() => ID)
  id: string

  @Field()
  description: string

  @Field()
  duedate: string

  @Field()
  done: boolean

  @Field()
  hide: boolean
}
