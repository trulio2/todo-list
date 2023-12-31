import { Args, Query, Mutation, Resolver } from '@nestjs/graphql'
import { ParseObjectIdPipe } from '../pipes'
import { CreateTaskInput, GetTasksFilterInput, UpdateTaskInput } from './dto'
import { Task } from './schemas'
import { TaskService } from './task.service'
import { RemoveTaskType, TaskType } from './types'

@Resolver(() => TaskType)
export class TaskResolver {
  constructor(private taskService: TaskService) {}

  @Query(() => [TaskType])
  tasks(
    @Args('getTasksFilterInput', { nullable: true })
    getTasksFilterInput: GetTasksFilterInput,
  ): Promise<Task[]> {
    return this.taskService.findAll(getTasksFilterInput)
  }

  @Mutation(() => TaskType)
  async done(@Args('id', ParseObjectIdPipe) id: string): Promise<Task> {
    return this.taskService.done(id)
  }

  @Mutation(() => TaskType)
  async hide(@Args('id', ParseObjectIdPipe) id: string): Promise<Task> {
    return this.taskService.hide(id)
  }

  @Mutation(() => TaskType)
  create(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ): Promise<Task> {
    return this.taskService.create(createTaskInput)
  }

  @Mutation(() => RemoveTaskType)
  remove(@Args('id', ParseObjectIdPipe) id: string): Promise<Task> {
    return this.taskService.remove(id)
  }

  @Mutation(() => TaskType)
  update(
    @Args('id', ParseObjectIdPipe) id: string,
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
  ): Promise<Task> {
    return this.taskService.update(id, updateTaskInput)
  }
}
