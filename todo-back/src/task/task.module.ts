import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Task, TaskSchema } from './schemas'
import { TaskRepository } from './task.repository'
import { TaskResolver } from './task.resolver'
import { TaskService } from './task.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  providers: [TaskRepository, TaskResolver, TaskService],
})
export class TaskModule {}
