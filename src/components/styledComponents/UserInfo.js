import styled from 'styled-components';

export const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

export const ProfileImageWrapper = styled.div`
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProfileImage = styled.div`
  width: 100px;
  height: 100px;
  font-size: 50px;
  background-color: orange;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

export const ProfileInfoWrapper = styled.div`
  width: 70%;
  padding: 0 20px;
`;

export const ProfileInfoItemWrapper = styled.div`
  margin: 10px 0;
  width: fit-content;
  > i {
    display: ${({ editMode }) => (editMode ? 'inline-block' : 'none')};
    cursor: pointer;
  }
  &:hover {
    > i {
      display: inline-block;
    }
  }
`;

export const ProfileInfoItemAttribute = styled.span`
  margin-right: 20px;
  font-size: 16px;
  font-style: italic;
`;

export const ProfileInfoItemValue = styled.span`
  margin-right: 10px;
  font-size: 16px;
`;

export const ChannelsInfoWrapper = styled.div`
  overflow-y: auto;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const ButtonSection = styled.div`
  margin-left: 20px;
  display: none;
  > button {
    cursor: pointer;
  }
`;

export const ChannelInfo = styled.div`
  display: flex;
  flex-direction: row;
  display: flex;
  align-items: center;
  padding: 5px 10px 5px 10%;
  &:hover {
    ${ButtonSection} {
      display: inline-block;
    }
  }
`;

export const ChannelName = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  &:active {
    position: relative;
    top: 3px;
    left: 3px;
  }
`;

export const ChannelNameFirstLetter = styled.div`
  width: 30px;
  height: 30px;
  background-color: #679ed2;
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

export const ChannelNameRemainingLetters = styled.div`
  font-size: 16px;
`;

export const MessagesInfoWrapper = styled.div`
  overflow-y: auto;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const MessageInfoWrapper = styled.div`
  max-width: 90%;
  display: flex;
  flex-direction: column;
  width: fit-content;
  padding: 10px 10px 5px 10%;
`;

export const MessageInfoText = styled.div`
  font-size: 16px;
  font-weight: bold;
  word-wrap: break-word;
`;

export const MessageInfoChannelWrapper = styled.div`
  font-size: 12px;
  margin-top: 3px;
`;

export const MessageInfoChannel = styled.span`
  font-size: 14px;
  background-color: #679ed2;
  color: white;
  border-radius: 5px;
  padding: 0 3px 3px 3px;
  margin: 0 5px;
  cursor: pointer;
`;
