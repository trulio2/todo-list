import { ParseUUIDPipe } from '@nestjs/common'
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql'
import { CreateTaskInput, GetTasksFilterInput, UpdateTaskInput } from './dto'
import { TaskService } from './task.service'
import { RemoveTaskType, TaskType } from './types'
import { Task } from './entities'

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
  async done(@Args('id', ParseUUIDPipe) id: string): Promise<Task> {
    return this.taskService.done(id)
  }

  @Mutation(() => TaskType)
  async hide(@Args('id', ParseUUIDPipe) id: string): Promise<Task> {
    return this.taskService.hide(id)
  }

  @Mutation(() => TaskType)
  create(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ): Promise<Task> {
    return this.taskService.create(createTaskInput)
  }

  @Mutation(() => RemoveTaskType)
  remove(@Args('id', ParseUUIDPipe) id: string): Promise<Task> {
    return this.taskService.remove(id)
  }
  @Mutation(() => TaskType)
  update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
  ): Promise<Task> {
    return this.taskService.update(id, updateTaskInput)
  }
}
