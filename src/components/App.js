import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header.js';
import Title from './Title.js';
import MyEditor from './MyEditor.js';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Title />
        <MyEditor />
        <div className="overlay" />
      </div>
    );
  }
}