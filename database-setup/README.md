# Database Setup
This folder contains files used in setting up and configuring the Globetrotter database.
| File Name							| Purpose		|
|    :---:    							|     :---:		|
| csc648-globetrotter-mysqldb-advanced-feature-model.mwb	| Luis' database model.	|
| globetrotter-create-database.sql				| Creates the database with our latest schema. This creates a default user which is documented in [the Credentials folder](/credentials).	|
| globetrotter-destroy-database.sql				| Use this before running the database creation script to completely reset the database. |
| create-database.sh						| Ubuntu script for running the database creation SQL script.	|
| destroy-database.sh						| Ubuntu script for running the database destruction SQL script.	|

You can install MySQL on your local computer and run the scripts using MySQL workbench.