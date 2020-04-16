import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

const allUsersQuery = gql`
  {
    getAllUsers {
      id
      email
    }
  }
`;

const Home = () => {
  const { loading, error, data: { getAllUsers: users } = {} } = useQuery(allUsersQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return users.map(({ id, email }) => (
    <div key={id}>
      <h2>{email}</h2>
    </div>
  ));
};

export default Home;