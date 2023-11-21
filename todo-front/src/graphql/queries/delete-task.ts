import { gql } from '@apollo/client'

export const REMOVE_TASK = gql`
  mutation Remove($removeId: String!) {
    remove(id: $removeId) {
      description
      duedate
      done
      hide
    }
  }
`
