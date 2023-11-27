import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type TaskDocument = HydratedDocument<Task>

@Schema()
export class Task {
  @Prop()
  description: string

  @Prop()
  duedate: string

  @Prop()
  done: boolean

  @Prop()
  hide: boolean
}

export const TaskSchema = SchemaFactory.createForClass(Task)
