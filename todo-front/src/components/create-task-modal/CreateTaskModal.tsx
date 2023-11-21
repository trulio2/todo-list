import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CREATE_TASK } from '../../graphql/queries/create-task'

interface CreateTaskModalProps {
  isModalOpen: boolean
  handleCloseModal: () => void
  refetch: () => void
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isModalOpen,
  handleCloseModal,
  refetch,
}) => {
  const [description, setDescription] = useState('')
  const [duedate, setDuedate] = useState('')

  const [createTask] = useMutation(CREATE_TASK)

  const handleCreateTask = () => {
    if (!description) {
      toast.error('Description is required')
      return
    }
    if (!duedate) {
      toast.error('Due date is required')
      return
    }
    createTask({ variables: { createTaskInput: { description, duedate } } })
      .then(() => {
        refetch()
        handleCloseModal()
      })
      .catch((error) => console.error(error))
  }

  return (
    <Dialog open={isModalOpen} onClose={handleCloseModal} style={{ zIndex: 2 }}>
      <DialogTitle>Create Task</DialogTitle>
      <DialogContent>
        <TextField
          label='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Due Date'
          type='date'
          value={duedate}
          onChange={(e) => setDuedate(e.target.value)}
          fullWidth
          margin='normal'
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button color='success' onClick={handleCreateTask}>
          Create
        </Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  )
}

export default CreateTaskModal
