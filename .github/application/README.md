# Application Folder

## Purpose
The purpose of this folder is to store all the source code and related files for your team's application. Source code MUST NOT be in any of folder. <strong>YOU HAVE BEEN WARNED</strong>

You are free to organize the contents of the folder as you see fit. But remember your team is graded on how you use Git. This does include the structure of your application. Points will be deducted from poorly structured application folders.

## Please use the rest of the README.md to store important information for your team's application.

### Folder & File Structure
* bin - holds the Node web server entry point
* node_modules - holds packages installed with npm
* routes - routers used by ExpressJS for handling URL's
* views - contains Express-Handlebars layouts and partials
* app.js - main application entry point

### Node Modules
| Module Name		| Purpose																	|
|    :---:    		|     :---:																	|
| express		| This is the main module for the web server. Most importantly it handles the routes and load other modules.					|
| express-handlebars	| This allows us to templatize our HTML. More explanation can be found in 'Views/README.md'.							|
| path			| Used for manipulating filepath strings. Not used very often.											|
| cookie-parser		| *Not 100% sure*																|
| express-session	| This one allows us to add extra info to the client requests so that the backend can check who the user is when they are making a request.	|