import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateTaskInput, GetTasksFilterInput, UpdateTaskInput } from './dto'
import { Task } from './schemas'
import { TaskRepository } from './task.repository'

@Injectable()
export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  async findAll(getTasksFilterInput?: GetTasksFilterInput): Promise<Task[]> {
    const tasks = await this.repository.findAll(
      getTasksFilterInput ?? ({} as GetTasksFilterInput),
    )

    return tasks
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.repository.findOne(id)

    if (!task) throw new NotFoundException('Task not found')

    return task
  }

  create(createTaskInput: CreateTaskInput): Promise<Task> {
    return this.repository.create(createTaskInput)
  }

  async done(id: string): Promise<Task> {
    const task = await this.findOne(id)

    return this.repository.done(id, task)
  }

  async hide(id: string): Promise<Task> {
    const task = await this.findOne(id)

    if (!task.done) throw new BadRequestException('Task is not done')

    return this.repository.hide(id, task)
  }

  async remove(id: string): Promise<Task> {
    const task = await this.findOne(id)

    return this.repository.remove(task)
  }

  async update(id: string, updateTaskInput: UpdateTaskInput): Promise<Task> {
    const task = await this.findOne(id)

    return this.repository.update(id, task, updateTaskInput)
  }
}
