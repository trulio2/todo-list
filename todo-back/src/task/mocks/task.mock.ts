import { CreateTaskInput, GetTasksFilterInput, UpdateTaskInput } from '../dto'
import { Task } from '../schemas'

class ExtendedTask extends Task {
  _id: string
}

export const mockId = 'objectId'

export const mockTask: ExtendedTask = {
  _id: mockId,
  description: 'description',
  duedate: new Date('2023-01-01').toISOString(),
  done: false,
  hide: false,
}

export const mockDoneTask: ExtendedTask = {
  _id: mockId,
  description: 'description',
  duedate: new Date('2023-01-01').toISOString(),
  done: true,
  hide: false,
}

export const mockHideTask: ExtendedTask = {
  _id: mockId,
  description: 'description',
  duedate: new Date('2023-01-01').toISOString(),
  done: true,
  hide: true,
}

export const mockGetTasksFilterInput: GetTasksFilterInput = {
  description: 'description',
  hide: false,
}

export const mockCreateTaskInput: CreateTaskInput = {
  description: 'description',
  duedate: '2023-01-01',
}

export const mockUpdateTaskInput: UpdateTaskInput = {
  description: 'updated description',
  duedate: '2023-01-02',
}
