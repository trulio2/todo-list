import { gql } from '@apollo/client'

export const DONE_TASK = gql`
  mutation Done($doneId: String!) {
    done(id: $doneId) {
      id
      description
      duedate
      done
      hide
    }
  }
`
