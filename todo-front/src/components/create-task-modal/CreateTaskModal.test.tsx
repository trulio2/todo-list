import { render, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CreateTaskModal from './CreateTaskModal'
import { MockedProvider } from '@apollo/client/testing'
import { CREATE_TASK } from '../../graphql/queries/create-task'

describe('CreateTaskModal', () => {
  const mockCloseModal = jest.fn()
  const mockRefetch = jest.fn()

  const createTaskMock = {
    request: {
      query: CREATE_TASK,
      variables: {
        createTaskInput: { description: 'Test Task', duedate: '2023-11-30' },
      },
    },
    result: {
      data: {
        create: {
          id: '1',
          description: 'Test Task',
          duedate: '2023-11-30',
          done: false,
          hide: false,
        },
      },
    },
  }

  it('renders correctly', () => {
    const { getByLabelText, getByText } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <CreateTaskModal
          isModalOpen={true}
          handleCloseModal={mockCloseModal}
          refetch={mockRefetch}
        />
      </MockedProvider>
    )
    expect(getByLabelText(/description/i)).toBeInTheDocument()
    expect(getByLabelText(/due date/i)).toBeInTheDocument()
    expect(getByText(/create task/i)).toBeInTheDocument()
  })

  describe('Create Task', () => {
    it('creates a task when form is submitted', async () => {
      const { getByLabelText, getByRole } = render(
        <MockedProvider mocks={[createTaskMock]} addTypename={false}>
          <CreateTaskModal
            isModalOpen={true}
            handleCloseModal={mockCloseModal}
            refetch={mockRefetch}
          />
        </MockedProvider>
      )

      fireEvent.change(getByLabelText(/description/i), {
        target: { value: 'Test Task' },
      })
      fireEvent.change(getByLabelText(/due date/i), {
        target: { value: '2023-11-30' },
      })
      fireEvent.click(getByRole('button', { name: /create/i }))

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled()
        expect(mockCloseModal).toHaveBeenCalled()
      })
    })

    it('shows error message when description is empty', async () => {
      const { getByLabelText, getByRole } = render(
        <MockedProvider mocks={[]} addTypename={false}>
          <CreateTaskModal
            isModalOpen={true}
            handleCloseModal={mockCloseModal}
            refetch={mockRefetch}
          />
        </MockedProvider>
      )

      fireEvent.change(getByLabelText(/description/i), {
        target: { value: '' },
      })
      fireEvent.change(getByLabelText(/due date/i), {
        target: { value: '2023-11-30' },
      })
      fireEvent.click(getByRole('button', { name: /create/i }))

      await waitFor(() => {
        expect(mockRefetch).not.toHaveBeenCalled()
        expect(mockCloseModal).not.toHaveBeenCalled()
      })
    })

    it('shows error message when due date is empty', async () => {
      const { getByLabelText, getByRole } = render(
        <MockedProvider mocks={[]} addTypename={false}>
          <CreateTaskModal
            isModalOpen={true}
            handleCloseModal={mockCloseModal}
            refetch={mockRefetch}
          />
        </MockedProvider>
      )

      fireEvent.change(getByLabelText(/description/i), {
        target: { value: 'Test Task' },
      })
      fireEvent.change(getByLabelText(/due date/i), {
        target: { value: '' },
      })
      fireEvent.click(getByRole('button', { name: /create/i }))

      await waitFor(() => {
        expect(mockRefetch).not.toHaveBeenCalled()
        expect(mockCloseModal).not.toHaveBeenCalled()
      })
    })
  })
})
