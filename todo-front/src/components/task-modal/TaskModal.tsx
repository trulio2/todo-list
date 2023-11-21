import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  DONE_TASK,
  HIDE_TASK,
  REMOVE_TASK,
  UPDATE_TASK,
} from '../../graphql/queries'
import { Task } from '../../types/task'
import './TaskModal.css'

interface TaskModalProps {
  selectedTask: Task
  isModalOpen: boolean
  handleCloseModal: () => void
  refetch: () => void
}

const TaskModal: React.FC<TaskModalProps> = ({
  selectedTask,
  isModalOpen,
  handleCloseModal,
  refetch,
}) => {
  const [updatedDescription, setUpdatedDescription] = useState(
    selectedTask.description
  )
  const [updatedDuedate, setUpdatedDuedate] = useState(
    selectedTask.duedate.split('T')[0]
  )
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false)

  const [removeTask] = useMutation(REMOVE_TASK, {
    onCompleted: () => {
      handleCloseModal()
      refetch()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const [doneTask] = useMutation(DONE_TASK, {
    onCompleted: () => {
      handleCloseModal()
      refetch()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const [hideTask] = useMutation(HIDE_TASK, {
    onCompleted: () => {
      handleCloseModal()
      refetch()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted: () => {
      handleCloseModal()
      refetch()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleDelete = async (task: Task) => {
    try {
      await removeTask({ variables: { removeId: task.id } })
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleDone = (task: Task) => {
    try {
      doneTask({ variables: { doneId: task.id } })
    } catch (error) {
      console.error('Error completing task:', error)
    }
  }

  const handleHide = (task: Task) => {
    try {
      hideTask({ variables: { hideId: task.id } })
    } catch (error) {
      console.error('Error hiding task:', error)
    }
  }

  const handleUpdateTask = () => {
    if (!updatedDescription) {
      toast.error('Description is required')
      return
    }
    if (!updatedDuedate) {
      toast.error('Due date is required')
      return
    }
    try {
      updateTask({
        variables: {
          updateId: selectedTask.id,
          updateTaskInput: {
            description: updatedDescription,
            duedate: updatedDuedate,
          },
        },
      })
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  return (
    <div>
      <Dialog
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this task?
        </DialogContent>
        <DialogActions>
          <Button color={'primary'} onClick={() => setConfirmModalOpen(false)}>
            Cancel
          </Button>
          <Button color={'error'} onClick={() => handleDelete(selectedTask)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={selectedTask !== null && isModalOpen}
        onClose={handleCloseModal}
        style={{ zIndex: 2 }}
      >
        <DialogTitle>
          Task Information
          <button className='update-task-btn' onClick={handleUpdateTask}>
            Update Task
          </button>
        </DialogTitle>
        <DialogContent>
          <div>
            <TextField
              label='Description'
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
              fullWidth
              margin='normal'
            />
            <br />
            <TextField
              label='Due Date'
              type='date'
              value={updatedDuedate}
              onChange={(e) => setUpdatedDuedate(e.target.value)}
              fullWidth
              margin='normal'
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br />
            <br />
            <strong>Completed</strong> {selectedTask.done ? 'Yes' : 'No'}
            <br />
            <br />
            <strong>Hidden</strong> {selectedTask.hide ? 'Yes' : 'No'}
          </div>
        </DialogContent>
        <DialogActions>
          <Button color={'error'} onClick={() => setConfirmModalOpen(true)}>
            Remove Task
          </Button>
          <Button color={'primary'} onClick={() => handleHide(selectedTask)}>
            Hide Task
          </Button>
          <Button color={'success'} onClick={() => handleDone(selectedTask)}>
            Complete Task
          </Button>
        </DialogActions>
        <ToastContainer />
      </Dialog>
    </div>
  )
}

export default TaskModal
