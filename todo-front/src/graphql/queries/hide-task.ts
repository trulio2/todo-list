import { gql } from '@apollo/client'

export const HIDE_TASK = gql`
  mutation Hide($hideId: String!) {
    hide(id: $hideId) {
      id
      description
      duedate
      done
      hide
    }
  }
`
