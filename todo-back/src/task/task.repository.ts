import { Injectable } from '@nestjs/common'
import { CreateTaskInput, GetTasksFilterInput, UpdateTaskInput } from './dto'
import { Task } from './schemas'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class TaskRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async findAll(getTasksFilterInput: GetTasksFilterInput): Promise<Task[]> {
    const { description, hide } = getTasksFilterInput

    const filter = {}

    if (description) {
      filter['description'] = new RegExp(description, 'i')
    }

    filter['hide'] = hide ?? false

    return this.taskModel.find(filter).sort({ duedate: 1 }).exec()
  }

  async findOne(id: string): Promise<Task> {
    return this.taskModel.findById(id).exec()
  }

  async create(createTaskInput: CreateTaskInput): Promise<Task> {
    const { description, duedate } = createTaskInput

    const newTask = await this.taskModel.create({
      description,
      duedate: new Date(duedate).toISOString(),
      done: false,
      hide: false,
    })

    return newTask.save()
  }

  async done(id: string, task: Task): Promise<Task> {
    task.done = true

    await this.taskModel
      .updateOne({ _id: id }, { $set: { done: task.done } })
      .exec()

    return task
  }

  async hide(id: string, task: Task): Promise<Task> {
    task.hide = true

    await this.taskModel
      .updateOne({ _id: id }, { $set: { hide: task.hide } })
      .exec()

    return task
  }

  async remove(task: Task): Promise<Task> {
    await this.taskModel.deleteOne(task).exec()

    return task
  }

  async update(
    id: string,
    task: Task,
    updateTaskInput: UpdateTaskInput,
  ): Promise<Task> {
    const { description, duedate } = updateTaskInput

    task.description = description
    task.duedate = new Date(duedate).toISOString()

    await this.taskModel
      .updateOne(
        { _id: id },
        {
          $set: {
            description: task.description,
            duedate: task.duedate,
          },
        },
      )
      .exec()

    return task
  }
}
