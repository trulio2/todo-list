import { Test, TestingModule } from '@nestjs/testing'
import {
  mockCreateTaskInput,
  mockDoneTask,
  mockGetTasksFilterInput,
  mockHideTask,
  mockId,
  mockTask,
  mockUpdateTaskInput,
} from './mocks'
import { TaskResolver } from './task.resolver'
import { TaskService } from './task.service'

jest.mock('./task.service')

describe('TaskResolver', () => {
  let resolver: TaskResolver
  let mockService: jest.Mocked<TaskService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskResolver,
        {
          provide: TaskService,
          useFactory: () =>
            ({
              create: jest.fn(),
              done: jest.fn(),
              findAll: jest.fn(),
              findOne: jest.fn(),
              hide: jest.fn(),
              remove: jest.fn(),
              update: jest.fn(),
            }) as Partial<TaskService>,
        },
      ],
    }).compile()

    resolver = module.get<TaskResolver>(TaskResolver)
    mockService = module.get(TaskService)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  describe('create', () => {
    it('should create a task', async () => {
      mockService.create.mockResolvedValue(mockTask)

      const result = await resolver.create(mockCreateTaskInput)

      expect(result).toEqual(mockTask)
      expect(mockService.create).toHaveBeenCalledWith(mockCreateTaskInput)
    })
  })

  describe('tasks', () => {
    it('should find all tasks, without filter', async () => {
      mockService.findAll.mockResolvedValue([mockTask])

      const result = await resolver.tasks(undefined)

      expect(result).toEqual([mockTask])
      expect(mockService.findAll).toHaveBeenCalledWith(undefined)
    })

    it('should find all tasks, with filter', async () => {
      mockService.findAll.mockResolvedValue([mockTask])

      const result = await resolver.tasks(mockGetTasksFilterInput)

      expect(result).toEqual([mockTask])
      expect(mockService.findAll).toHaveBeenCalledWith(mockGetTasksFilterInput)
    })
  })

  describe('done', () => {
    it('should set done a task', async () => {
      mockService.done.mockResolvedValue(mockDoneTask)

      const result = await resolver.done(mockId)

      expect(result).toEqual(mockDoneTask)
      expect(mockService.done).toHaveBeenCalledWith(mockId)
    })
  })

  describe('hide', () => {
    it('should set hide a task', async () => {
      mockService.hide.mockResolvedValue(mockHideTask)

      const result = await resolver.hide(mockId)

      expect(result).toEqual(mockHideTask)
      expect(mockService.hide).toHaveBeenCalledWith(mockId)
    })
  })

  describe('remove', () => {
    it('should remove a task', async () => {
      mockService.remove.mockResolvedValue(mockTask)

      const result = await resolver.remove(mockId)

      expect(result).toEqual(mockTask)
      expect(mockService.remove).toHaveBeenCalledWith(mockId)
    })
  })

  describe('update', () => {
    it('should update a task', async () => {
      mockService.update.mockResolvedValue(mockTask)

      const result = await resolver.update(mockId, mockUpdateTaskInput)

      expect(result).toEqual(mockTask)
      expect(mockService.update).toHaveBeenCalledWith(
        mockId,
        mockUpdateTaskInput,
      )
    })
  })
})
