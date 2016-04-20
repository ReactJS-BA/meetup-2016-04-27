import React, { Component } from 'react';

export default class Header extends Component {
  render() {
    return (
      <div>
        <nav>
          <div className="nav-wrapper">
            <div className="container">
              <a href="#" className="brand-logo">React.js BA</a>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
