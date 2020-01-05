import React from 'react';
// import logo from './logo.svg';
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import './App.css';
import Editor from "./components/MyEditor";

function App() {
  return (
      <DndProvider backend={Backend}>
        <Editor/>
      </DndProvider>
  );
}

export default App;
