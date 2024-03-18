#!/bin/sh
npm install
grunt
cp index.html public/index.html
cp style.css public/style.css
