module.exports = `
type Channel {
  id: ID!
  name: String!
  owner: User!
  messages: [Message!]
  members: [User!]!
}`;
