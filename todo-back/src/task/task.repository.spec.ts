import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Task } from './entities'
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
  let mockTypeOrmRepository: Repository<Task>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskRepository,
        {
          provide: getRepositoryToken(Task),
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
    mockTypeOrmRepository = module.get<Repository<Task>>(
      getRepositoryToken(Task),
    )
  })

  it('should be defined', () => {
    expect(repository).toBeDefined()
  })

  it('should be defined', () => {
    expect(mockTypeOrmRepository).toBeDefined()
  })

  describe('create', () => {
    it('should create a task', async () => {
      jest.spyOn(mockTypeOrmRepository, 'create').mockReturnValue(mockTask)
      jest.spyOn(mockTypeOrmRepository, 'save').mockResolvedValue(mockTask)

      const result = await repository.create(mockCreateTaskInput)

      expect(result).toEqual(mockTask)
      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(result)
    })
  })

  describe('findAll', () => {
    it('should find all tasks, with filter', async () => {
      jest
        .spyOn(mockTypeOrmRepository, 'find')
        .mockResolvedValue([mockTask, mockDoneTask, mockHideTask])

      const result = await repository.findAll(mockGetTasksFilterInput)

      expect(result).toEqual([mockTask, mockDoneTask, mockHideTask])
      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith({
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
      jest.spyOn(mockTypeOrmRepository, 'findOneBy').mockResolvedValue(mockTask)

      const result = await repository.findOne(mockId)

      expect(result).toEqual(mockTask)
      expect(mockTypeOrmRepository.findOneBy).toHaveBeenCalledWith({
        id: mockId,
      })
    })
  })

  describe('done', () => {
    it('should set done a task', async () => {
      jest.spyOn(mockTypeOrmRepository, 'save').mockResolvedValue(mockDoneTask)

      const result = await repository.done(mockTask)

      expect(result).toEqual(mockDoneTask)
      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(mockDoneTask)
    })
  })

  describe('hide', () => {
    it('should set hide a task', async () => {
      jest.spyOn(mockTypeOrmRepository, 'save').mockResolvedValue(mockHideTask)

      const result = await repository.hide(mockTask)

      expect(result).toEqual(mockHideTask)
      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(mockHideTask)
    })
  })

  describe('remove', () => {
    it('should remove a task', async () => {
      jest.spyOn(mockTypeOrmRepository, 'remove').mockResolvedValue(mockTask)

      const result = await repository.remove(mockTask)

      expect(result).toEqual(mockTask)
      expect(mockTypeOrmRepository.remove).toHaveBeenCalledWith(mockTask)
    })
  })

  describe('update', () => {
    it('should update a task', async () => {
      jest.spyOn(mockTypeOrmRepository, 'save').mockResolvedValue(mockTask)
      const updatedTask = {
        ...mockTask,
        ...mockUpdateTaskInput,
        duedate: new Date(mockUpdateTaskInput.duedate).toISOString(),
      }

      const result = await repository.update(mockTask, mockUpdateTaskInput)

      expect(result).toEqual(updatedTask)
      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(updatedTask)
    })
  })
})
