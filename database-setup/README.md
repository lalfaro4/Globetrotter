# Database Setup
This folder contains files used in setting up and configuring the Globetrotter database.
| File Name							| Purpose		|
|    :---:    							|     :---:		|
| csc648-globetrotter-mysqldb-advanced-feature-model.mwb	| Luis' database model.	|
| airport_and_airline_db_info.xlsx				| These are the airlines and airports datasets. There is a second table for each which generated SQL statements with are manually copied into the globetrotter-import-*.sql scripts. |
| globetrotter-create-database.sql				| Creates the database with our latest schema. This creates a default user which is documented in [the Credentials folder](/credentials).	|
| globetrotter-import-airlines.sql				| Imports the airlines dataset. This calls the stored procedure CreateAirline so that both an Airline and ServiceProvider are created.		|
| globetrotter-import-airports.sql				| Imports the airports dataset. This calls the stored procedure CreateAirport so that both an Airport and Location are created.			|
| globetrotter-destroy-database.sql				| Deletes the database and database users. |
| create-database.sh						| Ubuntu script for running the database creation SQL script.	|
| destroy-database.sh						| Ubuntu script for running the database destruction SQL script.	|

You can install MySQL on your local computer and run the scripts using MySQL workbench.