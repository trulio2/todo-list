import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { TaskRepository } from './task.repository'
import { TaskService } from './task.service'
import {
  mockCreateTaskInput,
  mockDoneTask,
  mockGetTasksFilterInput,
  mockHideTask,
  mockId,
  mockTask,
  mockUpdateTaskInput,
} from './mocks'

jest.mock('./task.repository')

describe('TaskService', () => {
  let service: TaskService
  let mockRepository: jest.Mocked<TaskRepository>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TaskRepository,
          useFactory: () =>
            ({
              create: jest.fn(),
              done: jest.fn(),
              findAll: jest.fn(),
              findOne: jest.fn(),
              hide: jest.fn(),
              remove: jest.fn(),
              update: jest.fn(),
            }) as Partial<TaskRepository>,
        },
      ],
    }).compile()

    service = module.get<TaskService>(TaskService)
    mockRepository = module.get(TaskRepository)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a task', async () => {
      mockRepository.create.mockResolvedValue(mockTask)

      const result = await service.create(mockCreateTaskInput)

      expect(result).toEqual(mockTask)
      expect(mockRepository.create).toHaveBeenCalledWith(mockCreateTaskInput)
    })
  })

  describe('findAll', () => {
    it('should find all tasks', async () => {
      mockRepository.findAll.mockResolvedValue([mockTask])

      const result = await service.findAll(mockGetTasksFilterInput)

      expect(result).toEqual([mockTask])
      expect(mockRepository.findAll).toHaveBeenCalledWith(
        mockGetTasksFilterInput,
      )
    })

    it('should find all tasks without filter', async () => {
      mockRepository.findAll.mockResolvedValue([mockTask])

      const result = await service.findAll()

      expect(result).toEqual([mockTask])
    })
  })

  describe('findOne', () => {
    it('should find a task by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask)

      const result = await service.findOne(mockId)

      expect(result).toEqual(mockTask)
      expect(mockRepository.findOne).toHaveBeenCalledWith(mockId)
    })

    it('should throw an error if task is not found', async () => {
      await expect(service.findOne(mockId)).rejects.toThrow(NotFoundException)
    })
  })

  describe('done', () => {
    it('should set done a task by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask)
      mockRepository.done.mockResolvedValue(mockDoneTask)
      const doneTask = { ...mockTask, done: true }

      const result = await service.done(mockId)

      expect(result).toEqual(doneTask)
      expect(mockRepository.done).toHaveBeenCalledWith(mockTask)
    })

    it('should throw an error if task is not found', async () => {
      await expect(service.done(mockId)).rejects.toThrow(NotFoundException)
    })
  })

  describe('hide', () => {
    it('should set hide a task by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockDoneTask)
      mockRepository.hide.mockResolvedValue(mockHideTask)
      const hideTask = { ...mockDoneTask, hide: true }

      const result = await service.hide(mockId)

      expect(result).toEqual(hideTask)
      expect(mockRepository.hide).toHaveBeenCalledWith(mockDoneTask)
    })

    it('should throw an error if task is not found', async () => {
      await expect(service.hide(mockId)).rejects.toThrow(NotFoundException)
    })

    it('should throw an error if task is not done', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask)

      await expect(service.hide(mockId)).rejects.toThrow(BadRequestException)
    })
  })

  describe('remove', () => {
    it('should remove a task by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask)
      mockRepository.remove.mockResolvedValue(mockTask)

      const result = await service.remove(mockId)

      expect(result).toEqual(mockTask)
      expect(mockRepository.remove).toHaveBeenCalledWith(mockTask)
    })

    it('should throw an error if task is not found', async () => {
      await expect(service.remove(mockId)).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    it('should update a task by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask)
      mockRepository.update.mockResolvedValue(mockTask)

      const result = await service.update(mockId, mockUpdateTaskInput)

      expect(result).toEqual(mockTask)
      expect(mockRepository.update).toHaveBeenCalledWith(
        mockTask,
        mockUpdateTaskInput,
      )
    })

    it('should throw an error if task is not found', async () => {
      await expect(service.update(mockId, mockUpdateTaskInput)).rejects.toThrow(
        NotFoundException,
      )
    })
  })
})
