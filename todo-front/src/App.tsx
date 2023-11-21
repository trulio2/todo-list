import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import CreateTaskModal from './components/create-task-modal/CreateTaskModal'
import TaskModal from './components/task-modal/TaskModal'
import { GET_TASKS } from './graphql/queries'
import { Task } from './types'
import './App.css'

function App() {
  const [description, setDescription] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [taskModalOpen, setTaskModalOpen] = useState<boolean>(false)
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState<boolean>(false)
  const [archivedTasks, setArchivedTasks] = useState<boolean>(false)

  const { loading, error, data, refetch } = useQuery(GET_TASKS, {
    variables: {
      getTasksFilterInput: {},
    },
  })

  useEffect(() => {
    if (loading || error) return
    if (description.length >= 3 || description === '') {
      refetch({
        getTasksFilterInput: {
          description,
          hide: archivedTasks,
        },
      })
    }
  }, [archivedTasks, description, refetch])

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setTaskModalOpen(true)
  }

  const handleCloseTaskModal = () => {
    setTaskModalOpen(false)
    setSelectedTask(null)
  }

  const handleCloseCreateTaskModal = () => {
    setCreateTaskModalOpen(false)
  }

  const handleCheckboxChange = () => {
    setArchivedTasks((archivedTasks) => {
      return !archivedTasks
    })
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error...</p>

  return (
    <div className='App'>
      <header className='App-header'>
        <div className='header-content'>
          <div
            onClick={handleCheckboxChange}
            style={{
              marginRight: '10px',
            }}
          >
            <input
              type='checkbox'
              checked={archivedTasks}
              onChange={handleCheckboxChange}
            />
            <label>Archived Tasks</label>
          </div>
          <input
            type='text'
            placeholder='Search tasks description...'
            className='search-field'
            value={description}
            onChange={handleDescriptionChange}
          />
          <button
            className='new-task-btn'
            onClick={() => setCreateTaskModalOpen(true)}
          >
            Create New Task
          </button>
        </div>
        <div className='tasks-container'>
          {data &&
            data.tasks.map((task: Task) => (
              <div
                className='task-container'
                key={task.id}
                onClick={() => handleTaskClick(task)}
              >
                <p className='task-detail'>Description: {task.description}</p>
                <p className='task-detail'>
                  Due Date: {task.duedate.split('T')[0]}
                </p>
                <p className='task-detail'>
                  Completed: {task.done ? 'Yes' : 'No'}
                </p>
                <p className='task-detail'>
                  Hidden: {task.hide ? 'Yes' : 'No'}
                </p>
              </div>
            ))}
        </div>
      </header>
      {selectedTask && taskModalOpen && (
        <TaskModal
          selectedTask={selectedTask}
          isModalOpen={taskModalOpen}
          handleCloseModal={handleCloseTaskModal}
          refetch={refetch}
        />
      )}
      {createTaskModalOpen && (
        <CreateTaskModal
          isModalOpen={createTaskModalOpen}
          handleCloseModal={handleCloseCreateTaskModal}
          refetch={refetch}
        />
      )}
    </div>
  )
}

export default App
