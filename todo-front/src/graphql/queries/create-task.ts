import { gql } from '@apollo/client'

export const CREATE_TASK = gql`
  mutation CreateTask($createTaskInput: CreateTaskInput!) {
    create(createTaskInput: $createTaskInput) {
      id
      description
      duedate
      done
      hide
    }
  }
`
