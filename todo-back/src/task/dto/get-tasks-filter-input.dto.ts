import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsOptional, IsBoolean } from 'class-validator'

@InputType()
export class GetTasksFilterInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  hide?: boolean
}
