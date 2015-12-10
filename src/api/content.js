/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import fs from 'fs';
import { join } from 'path';
import { Router } from 'express';
import Promise from 'bluebird';
import fm from 'front-matter';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Index from '../content/index.js';
import Content from '../content';


// A folder with Jade/Markdown/HTML content pages
const CONTENT_DIR = join(__dirname, './content');

const readFile = Promise.promisify(fs.readFile);
const fileExists = filename => new Promise(resolve => {
  fs.exists(filename, resolve);
});

const router = new Router();

// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication profile gets us their basic
// information including their name email gets their emails
router.get('/user/auth/google',
  passport.authenticate('google', {
    scope : ['profile', 'email']
  }));

// the callback after google has authenticated the user
router.get('/user/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/user/#',
    failureRedirect : '/user/login'
  }));

// Server side rendering
router.get('/', async (req, res, next) => {
  try {
    const path = req.query.path;

    if (!path || path === 'undefined') {
      res.status(400).send({error: `The 'path' query parameter cannot be empty.`});
      return;
    }

    let fileName = join(CONTENT_DIR, (path === '/' ? '/index' : path) + '.js');
    if (!(await fileExists(fileName))) {
      fileName = join(CONTENT_DIR, path + '/index.js');
    }

    if (!(await fileExists(fileName))) {
      res.status(404).send({error: `The page '${path}' is not found.`});
    } else {
      const route = path === '/' ? 'index' : path.substring(1);
      const htmlContent = ReactDOM.renderToString(React.createElement(Content[route]));
      const content = Object.assign({path, content: htmlContent}, {
        title: 'React.js Starter Kit',
        component: 'ContentPage'
      });

      res.status(200).send(content);
    }
  } catch (err) {
    next(err);
  }
});

export default router;
