import decode from 'jwt-decode';

export default (userId) => {
  const {
    user: { id: activeUserId },
  } = decode(localStorage.getItem('token'));
  return userId !== activeUserId;
};
