import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Model } from 'mongoose'
import { Task, TaskDocument } from './schemas'
import {
  mockCreateTaskInput,
  mockDoneTask,
  mockGetTasksFilterInput,
  mockHideTask,
  mockId,
  mockTask,
  mockUpdateTaskInput,
} from './mocks'
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
            create: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            remove: jest.fn(),
            save: jest.fn(),
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
      jest.spyOn(mockTaskModel, 'create').mockReturnValue(mockTask)
      jest.spyOn(mockTaskModel, 'save').mockResolvedValue(mockTask)

      const result = await repository.create(mockCreateTaskInput)

      expect(result).toEqual(mockTask)
      expect(mockTaskModel.save).toHaveBeenCalledWith(result)
    })
  })

  describe('findAll', () => {
    it('should find all tasks, with filter', async () => {
      jest
        .spyOn(mockTaskModel, 'find')
        .mockResolvedValue([mockTask, mockDoneTask, mockHideTask])

      const result = await repository.findAll(mockGetTasksFilterInput)

      expect(result).toEqual([mockTask, mockDoneTask, mockHideTask])
      expect(mockTaskModel.find).toHaveBeenCalledWith({
        order: {
          duedate: 'ASC',
        },
        where: {
          description: {
            $regex: mockGetTasksFilterInput.description,
            $options: 'i',
          },
          hide: mockGetTasksFilterInput.hide,
        },
      })
    })
  })

  describe('findOne', () => {
    it('should find one task by id', async () => {
      jest.spyOn(mockTaskModel, 'findOneBy').mockResolvedValue(mockTask)

      const result = await repository.findOne(mockId)

      expect(result).toEqual(mockTask)
      expect(mockTaskModel.findOneBy).toHaveBeenCalledWith({
        id: mockId,
      })
    })
  })

  describe('done', () => {
    it('should set done a task', async () => {
      jest.spyOn(mockTaskModel, 'save').mockResolvedValue(mockDoneTask)

      const result = await repository.done(mockTask)

      expect(result).toEqual(mockDoneTask)
      expect(mockTaskModel.save).toHaveBeenCalledWith(mockDoneTask)
    })
  })

  describe('hide', () => {
    it('should set hide a task', async () => {
      jest.spyOn(mockTaskModel, 'save').mockResolvedValue(mockHideTask)

      const result = await repository.hide(mockTask)

      expect(result).toEqual(mockHideTask)
      expect(mockTaskModel.save).toHaveBeenCalledWith(mockHideTask)
    })
  })

  describe('remove', () => {
    it('should remove a task', async () => {
      jest.spyOn(mockTaskModel, 'remove').mockResolvedValue(mockTask)

      const result = await repository.remove(mockTask)

      expect(result).toEqual(mockTask)
      expect(mockTaskModel.remove).toHaveBeenCalledWith(mockTask)
    })
  })

  describe('update', () => {
    it('should update a task', async () => {
      jest.spyOn(mockTaskModel, 'save').mockResolvedValue(mockTask)
      const updatedTask = {
        ...mockTask,
        ...mockUpdateTaskInput,
        duedate: new Date(mockUpdateTaskInput.duedate).toISOString(),
      }

      const result = await repository.update(mockTask, mockUpdateTaskInput)

      expect(result).toEqual(updatedTask)
      expect(mockTaskModel.save).toHaveBeenCalledWith(updatedTask)
    })
  })
})
