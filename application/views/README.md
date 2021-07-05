## Views
This folder is for the Handlebars views. 

### Folders
| Folder Name	| Purpose	|
|    :---:    	|     :---:	|
| *this folder*	| This folder contains views that can be thought of as "pages". A router can send one of these "pages" to the client by calling "res.render(*filenameOfTheView.hbs*)".	|
| layouts	| These are the top level templates. Currently the default layout is 'default.hbs' which is configured in 'app.js'. The HTML from a layout is added to every page. |
| partials	| Partials are like templates for components. If you wanted to combine a textbox and a button into one component that you could reuse in alot of places, you would need to create a partial.  |