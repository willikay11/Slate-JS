import styled from 'styled-components';

export const TextBox = styled.div`
  background-color: white;
  &:hover {
    border: 1px dashed gray;
  }
`;

export const Paragraph = styled.p`
    padding: 0.5rem;
`;

export const Preview = styled.div`
    flex: 1;
    flex-direction: row;
    display: flex;
    align-items: center;
    backgroundColor: gray;
    max-height: 60px;
    max-width: 90px;
    padding: 10px;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 5px;
    background-color: #f4f4f4;
`;