## Routes
This folder is for the Express routers which tell the backend how to handle requests, based on their URL. They are enabled within 'app.js'.

### Current Routers
| Router Name	| Purpose	|
|    :---:    	|     :---:	|
| api.js	| This router is responsible for URL's beginning with '/api/'. It provides a way to search from and insert into the database. Responses should be done using res.send(data). |
| index.js	| This router is responsible for URL's beginning with '/'. It is responsible for rendering the Handlebars views on the client. |

**Note: The other routers with '-example.js' in the name are just for reference.**