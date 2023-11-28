import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Model } from 'mongoose'
import {
  mockCreateTaskInput,
  mockGetTasksFilterInput,
  mockId,
  mockTask,
  mockUpdateTaskInput,
} from './mocks'
import { Task, TaskDocument } from './schemas'
import { TaskRepository } from './task.repository'

describe('TaskRepository', () => {
  let repository: TaskRepository
  let mockTaskModel: Model<TaskDocument>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskRepository,
        {
          provide: getModelToken(Task.name),
          useFactory: () => ({
            create: jest.fn().mockResolvedValue({
              ...mockTask,
              save: jest.fn().mockResolvedValue(mockTask),
            }),
            find: jest.fn().mockReturnValue({
              sort: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue([mockTask]),
              }),
            }),
            findById: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockTask),
            }),
            updateOne: jest.fn().mockReturnValue({
              exec: jest.fn(),
            }),
            deleteOne: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockTask),
            }),
          }),
        },
      ],
    }).compile()

    repository = module.get<TaskRepository>(TaskRepository)
    mockTaskModel = module.get<Model<TaskDocument>>(getModelToken(Task.name))
  })

  it('should be defined', () => {
    expect(repository).toBeDefined()
  })

  it('should be defined', () => {
    expect(mockTaskModel).toBeDefined()
  })

  describe('create', () => {
    it('should create a task', async () => {
      const result = await repository.create(mockCreateTaskInput)

      expect(result).toEqual(mockTask)
      expect(mockTaskModel.create).toHaveBeenCalledWith({
        description: mockCreateTaskInput.description,
        duedate: new Date(mockCreateTaskInput.duedate).toISOString(),
        done: false,
        hide: false,
      })
    })
  })

  describe('findAll', () => {
    it('should find all tasks, with filter', async () => {
      const result = await repository.findAll(mockGetTasksFilterInput)

      expect(result).toEqual([mockTask])
      expect(mockTaskModel.find).toHaveBeenCalledWith({
        description: new RegExp(mockGetTasksFilterInput.description, 'i'),
        hide: mockGetTasksFilterInput.hide ?? false,
      })
    })
  })

  describe('findOne', () => {
    it('should find one task by id', async () => {
      const result = await repository.findOne(mockId)

      expect(result).toEqual(mockTask)
      expect(mockTaskModel.findById).toHaveBeenCalledWith(mockId)
    })
  })

  describe('done', () => {
    it('should set a task as done', async () => {
      const result = await repository.done(mockId, { ...mockTask })

      expect(result.done).toBeTruthy()
      expect(mockTaskModel.updateOne).toHaveBeenCalledWith(
        { _id: mockId },
        { $set: { done: true } },
      )
    })
  })

  describe('hide', () => {
    it('should set a task as hidden', async () => {
      const result = await repository.hide(mockId, { ...mockTask })

      expect(result.hide).toBeTruthy()
      expect(mockTaskModel.updateOne).toHaveBeenCalledWith(
        { _id: mockId },
        { $set: { hide: true } },
      )
    })
  })

  describe('remove', () => {
    it('should remove a task', async () => {
      const result = await repository.remove(mockTask)

      expect(result).toEqual(mockTask)
      expect(mockTaskModel.deleteOne).toHaveBeenCalledWith(mockTask)
    })
  })

  describe('update', () => {
    it('should update a task', async () => {
      const result = await repository.update(
        mockId,
        { ...mockTask },
        mockUpdateTaskInput,
      )
      
      expect(result).toEqual({
        ...mockTask,
        description: mockUpdateTaskInput.description,
        duedate: new Date(mockUpdateTaskInput.duedate).toISOString(),
      })
      expect(mockTaskModel.updateOne).toHaveBeenCalledWith(
        { _id: mockId },
        {
          $set: {
            description: mockUpdateTaskInput.description,
            duedate: new Date(mockUpdateTaskInput.duedate).toISOString(),
          },
        },
      )
    })
  })
})
