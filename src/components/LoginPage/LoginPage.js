/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './LoginPage.scss';
import withStyles from '../../decorators/withStyles';
import GoogleButton from './loginButtons/GoogleButton.jsx';
import FacebookButton from './loginButtons/FacebookButton.jsx';

@withStyles(styles)
class LoginPage extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  render() {
    const title = 'Log In';
    this.context.onSetTitle(title);
    return (
      <div className="LoginPage">
        <div className="LoginPage-container">
          <h1>{title}</h1>
          <div id='login'>
              <div className="col-md-6 col-xs-12"><GoogleButton destination="/user/auth/google" message="Google" /></div>
              <div className="col-md-6 col-xs-12"><FacebookButton destination="/user/auth/facebook" message="Facebook" /></div>
          </div>
        </div>
      </div>
    );
  }

}

export default LoginPage;
