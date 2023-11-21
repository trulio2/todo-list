import { Field, InputType } from '@nestjs/graphql'
import { IsDateString, IsString } from 'class-validator'

@InputType()
export class CreateTaskInput {
  @Field()
  @IsString()
  description: string

  @Field()
  @IsDateString()
  duedate: string
}
