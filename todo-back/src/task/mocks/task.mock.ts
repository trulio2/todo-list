import { CreateTaskInput, GetTasksFilterInput, UpdateTaskInput } from '../dto'
import { Task } from '../schemas'

export const mockId = 'uuid'

export const mockTask: Task = {
  description: 'description',
  duedate: new Date().toISOString(),
  done: false,
  hide: false,
}

export const mockDoneTask: Task = {
  description: 'description',
  duedate: new Date().toISOString(),
  done: true,
  hide: false,
}

export const mockHideTask: Task = {
  description: 'description',
  duedate: new Date().toISOString(),
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
