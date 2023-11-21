import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { CreateTaskInput, GetTasksFilterInput, UpdateTaskInput } from './dto'
import { Task } from './entities'

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async findAll(getTasksFilterInput: GetTasksFilterInput): Promise<Task[]> {
    const { description, hide } = getTasksFilterInput

    let query = {}

    if (description) {
      query = {
        description: { $regex: description, $options: 'i' },
      }
    }
    query = { ...query, hide: hide ?? false }

    return this.taskRepository.find({
      where: query,
      order: {
        duedate: 'ASC',
      },
    })
  }

  findOne(id: string): Promise<Task> {
    return this.taskRepository.findOneBy({ id })
  }

  create(createTaskInput: CreateTaskInput): Promise<Task> {
    const { description, duedate } = createTaskInput

    const task = this.taskRepository.create({
      id: uuid(),
      description,
      duedate: new Date(duedate).toISOString(),
      done: false,
      hide: false,
    })

    return this.taskRepository.save(task)
  }

  done(task: Task): Promise<Task> {
    task.done = true

    return this.taskRepository.save(task)
  }

  hide(task: Task): Promise<Task> {
    task.hide = true

    return this.taskRepository.save(task)
  }

  remove(task: Task): Promise<Task> {
    return this.taskRepository.remove(task)
  }
  update(task: Task, updateTaskInput: UpdateTaskInput): Promise<Task> {
    const { description, duedate } = updateTaskInput

    task.description = description
    task.duedate = new Date(duedate).toISOString()

    return this.taskRepository.save(task)
  }
}
