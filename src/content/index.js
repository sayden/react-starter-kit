import React, {Component} from 'react';

class Index extends Component {
  render(){
    return(
      <div>
        <div>
          <h3>Runtime Components</h3>
          <ul>
            <li>Somethign</li>
            <li>Something else</li>
            <li>{this.props.path}</li>
            <li>{this.props.content}</li>
          </ul>
        </div>
      </div>
    );
  }
}


export default Index;
