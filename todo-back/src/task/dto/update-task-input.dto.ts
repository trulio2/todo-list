import { Field, InputType } from '@nestjs/graphql'
import { IsDateString, IsString } from 'class-validator'

@InputType()
export class UpdateTaskInput {
  @Field()
  @IsString()
  description: string

  @Field()
  @IsDateString()
  duedate: string
}
