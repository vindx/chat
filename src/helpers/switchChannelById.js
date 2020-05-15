export default (channelId, history) => {
  if (channelId) {
    history.push(`/view-channel/${channelId}`);
  }
};
