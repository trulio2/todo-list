import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('RemoveTask')
export class RemoveTaskType {
  @Field()
  description: string

  @Field()
  duedate: string

  @Field()
  done: boolean

  @Field()
  hide: boolean
}
