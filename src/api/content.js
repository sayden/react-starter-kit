/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import fs from 'fs';
import { join } from 'path';
import { Router } from 'express';
import Promise from 'bluebird';
import jade from 'jade';
import fm from 'front-matter';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Index from '../content/index.js';
import Content from '../content';


// A folder with Jade/Markdown/HTML content pages
const CONTENT_DIR = join(__dirname, './content');

// Extract 'front matter' metadata and generate HTML
const parseJade = (path, jadeContent) => {
  const fmContent = fm(jadeContent);
  const htmlContent = jade.render(fmContent.body);
  return Object.assign({ path, content: htmlContent }, fmContent.attributes);
};

const readFile = Promise.promisify(fs.readFile);
const fileExists = filename => new Promise(resolve => {
  fs.exists(filename, resolve);
});

const router = new Router();

//router.get('/', async (req, res, next) => {
//  renderWithJade(req, res, next);
//});

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
    } else {
      console.error('File %s does not exists. Result is %s', fileName, fileExists(fileName));
    }

    if (!(await fileExists(fileName))) {
      res.status(404).send({error: `The page '${path}' is not found.`});
    } else {
      const htmlContent = ReactDOM.renderToString(React.createElement(Content['index']));
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
/*
function renderWithJsx (req, res, next){
  try {
    const path = req.query.path;

    if (!path || path === 'undefined') {
      res.status(400).send({error: `The 'path' query parameter cannot be empty.`});
      return;
    }
    const content = parseJsx(path);
    res.status(200).send(content);
  } catch (err) {
    next(err);
  }
}

function renderWithJade(req, res, next){
  try {
    const path = req.query.path;

    if (!path || path === 'undefined') {
      res.status(400).send({error: `The 'path' query parameter cannot be empty.`});
      return;
    }
     let fileName = join(CONTENT_DIR, (path === '/' ? '/index' : path) + '.jade');
     if (!(await fileExists(fileName))) {
     fileName = join(CONTENT_DIR, path + '/index.jade');
     } else {
     console.error('File %s does not exists. Result is %s', fileName, fileExists(fileName));
     }

     if (!(await fileExists(fileName))) {
     res.status(404).send({error: `The page '${path}' is not found.`});
     } else {
     const source = await readFile(fileName, { encoding: 'utf8' });
     const content = parseJade(path, source);
     res.status(200).send(content);
     }
  } catch (err) {
    next(err);
  }
}
*/
export default router;
