import { gql } from '@apollo/client'

export const GET_TASKS = gql`
  query Task($getTasksFilterInput: GetTasksFilterInput) {
    tasks(getTasksFilterInput: $getTasksFilterInput) {
      id
      description
      duedate
      done
      hide
    }
  }
`
