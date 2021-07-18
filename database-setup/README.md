# Database Setup
This folder contains files used in setting up and configuring the Globetrotter database.
| File Name					| Purpose		|
|    :---:    					|     :---:		|
| csc648-globetrotter-mysql-model.mwb		| MySQL Workbench database model.	|
| airport_and_airline_db_info.xlsx		| These are the airlines and airports datasets. There is a second table for each which generated SQL statements with are manually copied into the globetrotter-import-*.sql scripts. |
| create-database.sql				| Creates the database with our latest schema. This creates a default user which is documented in [the Credentials folder](/credentials).	|
| import-airlines.sql				| Imports the airlines dataset. This calls the stored procedure CreateAirline so that both an Airline and ServiceProvider are created.		|
| import-airports.sql				| Imports the airports dataset. This calls the stored procedure CreateAirport so that both an Airport and Location are created.			|
| import-airports.sql				| Imports the airports dataset. This calls the stored procedure CreateAirport so that both an Airport and Location are created.			|
| example-full.sql				| Creates a user, registers the user, creates a trip and some activities. |
| destroy-database.sql				| Deletes the database and database users. |
| example-queries.sql & import-sample-data.sql	| Scripts that Luis and I worked on and are migrating to stored procedures. |
| create-database.sh				| Ubuntu script for running the database creation SQL script.	|
| destroy-database.sh				| Ubuntu script for running the database destruction SQL script.	|

You can install MySQL on your local computer and run the scripts using MySQL workbench.

07/18/21 - Taylor
I've added more stored procedures and an file showing how a user is created in the database, how a trip is created, and how activities are added to the trip. I have also added some views like airport_view and activity_view, etc.

To set up and test the database:
- Database->Forward Engineer (no need to run the create/destroy scripts for now)
- Run import-airports.sql and import-airlines.sql
- Then run example-full.sql

We should update example-full.sql as more stored procedures are completed.