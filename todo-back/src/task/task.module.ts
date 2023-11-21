import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Task } from './entities'
import { TaskRepository } from './task.repository'
import { TaskResolver } from './task.resolver'
import { TaskService } from './task.service'

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TaskRepository, TaskResolver, TaskService],
})
export class TaskModule {}
