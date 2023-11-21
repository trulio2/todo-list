import { fireEvent, render, waitFor } from '@testing-library/react'
import {
  DONE_TASK,
  HIDE_TASK,
  REMOVE_TASK,
  UPDATE_TASK,
} from '../../graphql/queries'
import { MockedProvider } from '@apollo/client/testing'
import TaskModal from './TaskModal'

describe('TaskModal', () => {
  const mockCloseModal = jest.fn()
  const mockRefetch = jest.fn()
  const mockSelectedTask = {
    id: '1',
    description: 'Test Task',
    duedate: '2023-11-30',
    done: false,
    hide: false,
  }

  const doneTaskMock = {
    request: {
      query: DONE_TASK,
      variables: {
        doneId: '1',
      },
    },
    result: {
      data: {
        done: mockSelectedTask,
      },
    },
  }

  const hideTaskMock = {
    request: {
      query: HIDE_TASK,
      variables: {
        hideId: '1',
      },
    },
    result: {
      data: {
        hide: mockSelectedTask,
      },
    },
  }

  const removeTaskMock = {
    request: {
      query: REMOVE_TASK,
      variables: {
        removeId: '1',
      },
    },
    result: {
      data: {
        remove: mockSelectedTask,
      },
    },
  }

  const updateTaskMock = {
    request: {
      query: UPDATE_TASK,
      variables: {
        updateId: '1',
        updateTaskInput: {
          description: 'Test Task',
          duedate: '2023-11-30',
        },
      },
    },
    result: {
      data: {
        update: mockSelectedTask,
      },
    },
  }

  it('renders correctly', () => {
    const { getByLabelText, getByText } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <TaskModal
          isModalOpen={true}
          handleCloseModal={mockCloseModal}
          refetch={mockRefetch}
          selectedTask={mockSelectedTask}
        />
      </MockedProvider>
    )
    expect(getByLabelText(/description/i)).toBeInTheDocument()
    expect(getByLabelText(/due date/i)).toBeInTheDocument()
    expect(getByText(/update task/i)).toBeInTheDocument()
  })

  describe('done', () => {
    it('sets a task as done when button is clicked', async () => {
      const { getByRole } = render(
        <MockedProvider mocks={[doneTaskMock]} addTypename={false}>
          <TaskModal
            isModalOpen={true}
            handleCloseModal={mockCloseModal}
            refetch={mockRefetch}
            selectedTask={mockSelectedTask}
          />
        </MockedProvider>
      )

      fireEvent.click(getByRole('button', { name: /Complete Task/i }))

      await waitFor(() => {
        expect(mockCloseModal).toHaveBeenCalledTimes(1)
        expect(mockRefetch).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('hide', () => {
    it('sets a task as hidden when button is clicked', async () => {
      const { getByRole } = render(
        <MockedProvider mocks={[hideTaskMock]} addTypename={false}>
          <TaskModal
            isModalOpen={true}
            handleCloseModal={mockCloseModal}
            refetch={mockRefetch}
            selectedTask={mockSelectedTask}
          />
        </MockedProvider>
      )

      fireEvent.click(getByRole('button', { name: /Hide Task/i }))

      await waitFor(() => {
        expect(mockCloseModal).toHaveBeenCalledTimes(1)
        expect(mockRefetch).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('remove', () => {
    it('removes a task when button is clicked', async () => {
      const { getByRole } = render(
        <MockedProvider mocks={[removeTaskMock]} addTypename={false}>
          <TaskModal
            isModalOpen={true}
            handleCloseModal={mockCloseModal}
            refetch={mockRefetch}
            selectedTask={mockSelectedTask}
          />
        </MockedProvider>
      )

      fireEvent.click(getByRole('button', { name: /Remove Task/i }))

      fireEvent.click(getByRole('button', { name: /Delete/i }))

      await waitFor(() => {
        expect(mockCloseModal).toHaveBeenCalledTimes(1)
        expect(mockRefetch).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('update', () => {
    it('updates a task when form is submitted', async () => {
      const { getByLabelText, getByRole } = render(
        <MockedProvider mocks={[updateTaskMock]} addTypename={false}>
          <TaskModal
            isModalOpen={true}
            handleCloseModal={mockCloseModal}
            refetch={mockRefetch}
            selectedTask={mockSelectedTask}
          />
        </MockedProvider>
      )

      fireEvent.change(getByLabelText(/description/i), {
        target: { value: 'Test Task' },
      })
      fireEvent.change(getByLabelText(/due date/i), {
        target: { value: '2023-11-30' },
      })

      fireEvent.click(getByRole('button', { name: /Update task/i }))

      await waitFor(() => {
        expect(mockCloseModal).toHaveBeenCalledTimes(1)
        expect(mockRefetch).toHaveBeenCalledTimes(1)
      })
    })
  })
})
