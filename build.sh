#!/bin/sh
npm install grunt-cli
npm install
grunt
mkdir public
cp index.html public/index.html
cp style.css public/style.css
