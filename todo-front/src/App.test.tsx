import { MockedProvider } from '@apollo/client/testing'
import { render, waitFor, fireEvent } from '@testing-library/react'
import App from './App'
import { GET_TASKS } from './graphql/queries'

describe('App Component', () => {
  const getTasksMock = {
    request: {
      query: GET_TASKS,
      variables: {
        getTasksFilterInput: {},
      },
    },
    result: {
      data: {
        tasks: [
          {
            id: '1',
            description: 'Test Task',
            duedate: '2023-11-30',
            done: false,
            hide: false,
          },
        ],
      },
    },
  }
  it('renders without crashing', async () => {
    const { getByPlaceholderText } = render(
      <MockedProvider mocks={[getTasksMock]} addTypename={false}>
        <App />
      </MockedProvider>
    )
    await waitFor(() => {
      expect(
        getByPlaceholderText(/Search tasks description.../i)
      ).toBeInTheDocument()
    })
  })

  it('renders task descriptions after loading', async () => {
    const { getByText } = render(
      <MockedProvider mocks={[getTasksMock]} addTypename={false}>
        <App />
      </MockedProvider>
    )

    await waitFor(() => {
      expect(getByText(/Test Task/i)).toBeInTheDocument()
    })
  })

  it('displays loading state initially', () => {
    const { getByText } = render(
      <MockedProvider mocks={[getTasksMock]} addTypename={false}>
        <App />
      </MockedProvider>
    )
    expect(getByText(/loading.../i)).toBeInTheDocument()
  })

  it('displays error state', async () => {
    const getTasksErrorMock = {
      request: {
        query: GET_TASKS,
        variables: {
          getTasksFilterInput: {},
        },
      },
      error: new Error('An error occurred'),
    }
    const { getByText } = render(
      <MockedProvider mocks={[getTasksErrorMock]} addTypename={false}>
        <App />
      </MockedProvider>
    )
    await waitFor(() => {
      expect(getByText(/error.../i)).toBeInTheDocument()
    })
  })

  it('refetches tasks when description is changed', async () => {
    const getTasksFilterMock = {
      ...getTasksMock,
      request: {
        query: GET_TASKS,
        variables: {
          getTasksFilterInput: {
            description: 'Test Task',
            hide: false,
          },
        },
      },
    }
    const { getByPlaceholderText, getByText } = render(
      <MockedProvider
        mocks={[getTasksMock, getTasksFilterMock]}
        addTypename={false}
      >
        <App />
      </MockedProvider>
    )

    await waitFor(() => {
      expect(
        getByPlaceholderText(/Search tasks description.../i)
      ).toBeInTheDocument()
    })

    const input = getByPlaceholderText(/Search tasks description.../i)

    fireEvent.change(input, { target: { value: 'Test Task' } })

    await waitFor(() => {
      expect(input).toHaveValue('Test Task')
    })

    await waitFor(() => {
      expect(getByText(/Test Task/i)).toBeInTheDocument()
    })
  })

  it('opens create task modal when create task button is clicked', async () => {
    const { getByRole, getByText } = render(
      <MockedProvider mocks={[getTasksMock]} addTypename={false}>
        <App />
      </MockedProvider>
    )

    await waitFor(() => {
      expect(getByText(/Test Task/i)).toBeInTheDocument()
    })

    const createTaskButton = getByRole('button', { name: /Create New Task/i })

    fireEvent.click(createTaskButton)

    await waitFor(() => {
      expect(getByRole('button', { name: /Create/i })).toBeInTheDocument()
    })
  })

  it('opens task modal when task is clicked', async () => {
    const { getByText, getByRole } = render(
      <MockedProvider mocks={[getTasksMock]} addTypename={false}>
        <App />
      </MockedProvider>
    )

    await waitFor(() => {
      expect(getByText(/Test Task/i)).toBeInTheDocument()
    })

    const task = getByText(/Test Task/i)

    fireEvent.click(task)

    await waitFor(() => {
      expect(getByRole('button', { name: /remove/i })).toBeInTheDocument()
    })
  })
})
