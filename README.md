# Project Name & Description
 JourneryLife Admin <br>
JourneyLife Admin portal built with React and Firebase.

# Project Status

This project is currently in development mode.

# Installation and Setup Instructions

Below you will find some information on how to perform Installation and Setup tasks.

## Run App in Development mode
**Clone this repository**
```
git clone "http://git.iapplabz.co.in/devserver/journeylife-admin.git"
```

**Install Dependency**
```
npm install
```

**Start the application in development mode**
```
 npm start
```

Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

Static files are served from the `public` folder, project JavaScript files are bundled from the `app` folder.

## Run App in Production build

**Start the application in Production mode**

 To build the project for Production Env run the following command.

```
npm run build
```
And serve by

```
serve -s build
```
The app will run on 5000 port for the Production mode.<br>
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

## Folders and Files Structure

Your project directory should look something like this:

```
journeylife-admin
  .firebase/
  functions/
  node_modules/
  public/
    embed_preview.png
    favicon.ico
    index.html
    manifest.json
    readme.md
  scripts/
  src/
    actions/
    media/
    styles/
    views/
    index.js
    readme.md
  .gitignore
  firebase.json
  firestore.rules
  package.json
  package-lock.json
  README.md
  start.sh
```

For the project to build, **these files must exist with exact filenames**:

* `public/index.html` is the page template;
* `src/index.js` is the JavaScript entry point.

You can delete or rename the other files.

You may create subdirectories inside `src`. For faster rebuilds, only files inside `src` are processed by Webpack.
You need to **put any JS and CSS files inside `src`**, otherwise, Webpack won’t see them.

Only files inside `public` can be used from `public/index.html`.

## Environment Variable

Set environment variable for App Base API and Auth API as below:

**App Environment Variable**

```
    no env variables yet... 
```

## Dependencies
* React, React-DOM
 See `package.json` for more Dependencies and packages Required.
