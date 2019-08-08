

## Setup

Pre-requisites:

- Docker
- Yarn

Run `yarn docker:buildDev` in the root of the project.
it will build containers and run backend app in dev mode using nodemon on port 3000.







## Database setup + management
inside app container run these commands.

`yarn migrate up` will run the migrations.

`yarn migrate down` will roll back the migrations.

`yarn migrate:create <migration-name>`  will create a new migration file in [./src/migrations](./src/migrations).

To run the migrations inside of docker-compose. Which will run a bash instance inside the `app` container.






