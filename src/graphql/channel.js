import { gql } from 'apollo-boost';

export const allChannelsQuery = gql`
  {
    getAllChannels {
      id
      name
    }
  }
`;
