import { gql } from '@apollo/client'

export const UPDATE_TASK = gql`
  mutation Update($updateId: String!, $updateTaskInput: UpdateTaskInput!) {
    update(id: $updateId, updateTaskInput: $updateTaskInput) {
      id
      description
      duedate
      done
      hide
    }
  }
`
