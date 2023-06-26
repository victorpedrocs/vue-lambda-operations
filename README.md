# Loanpro assignment

This monoreopo contains the implementation of server and ui for the loanpro code challenge

## Live version

The frontend is deployed to AWS using Amplify, and the backend is deployed on Lambda using serverless.

Here is the link to the app: https://d3rao4du2a4sse.cloudfront.net

Use the `test/test` credentials for a user with a large list of records, or create a new user user going to the sign up page.

## Local development

This repo uses turborepo to manage the subpackages `web` for the UI, and `api` for the backend. Here as the instructions to run them locally:

1. Make a copy of the `.env.sample` file to `.env`, and populate the missing values with your own keys
1. Run `yarn migrate` to perform the database migration.
1. Run `yarn dev` in the root folder
   1. It will spin up the docker container for the database
   1. And it will run both `web` and `api` servers.

These are the environment variables:

## var | description | default value

| Variable              | Description                                  | Default Value                                        |
| --------------------- | -------------------------------------------- | ---------------------------------------------------- |
| AWS_ACCESS_KEY_ID     | AWS access key id                            | -                                                    |
| AWS_SECRET_ACCESS_KEY | AWS secret access key                        | -                                                    |
| PG_CONN_URL           | The connection string to the postgres server | postgres://postgres:postgres@localhost:5432/postgres |
| RANDOM_KEY            | The api key for the Random.org api           | -                                                    |
| RANDOM_ADDRESS        | The url address for the Random.org api       | https://api.random.org/json-rpc/4/invoke             |
| VITE_API_URL=         | The url address to the backend api           | http://localhost:3000                                |

## Testing

I have written integration tests for all api endpoints using vitest.

I have also written some unit tests in the `api` package to showcase testing with unit tests in the backend.

## Deployment

The deployment was done manually in two steps:

1. In the `api` package
   1. make sure the environment variables are setup correctly, pointing to the live environments, follow the `.env.sample` file, the same way it was done in the root package.
   1. run `yarn sls:deploy` to deploy the serverless api.
1. In the `web` package
   1. make sure the environment variables are correctly set up, pointing to the live api.
   1. run `yarn deploy` to deploy the front end app using amplify.

### Infrastructure

This is the stack used for the API:

- Serverless framework to implement the lambda infrastructure
  - It uses the `esbuild` and `offline` plugins to build the typescript code and run the lambda locally, respectively.
  - Express as the rest server library
  - Drizzle as ORM, for it's simplicity and ease to work with
  - Render.com as postgres host, because of it's simplicity to spin up, opposed to RDS, where it's needed to setup networking and a VPC for the lambda to able to communicate with it.
- The UI is implemented in Vue.js
  - Vite for the application scaffolding and build.
  - Element plus as the UI components library
  - Pinia as store for vue
  - AWS Amplify for hosting

Given it was my first experience with Vue.js, it's probable that I'm missing some good practices involving the vue ecosystem. In any case, I really enjoyed learning vue.

## Development

### Database

The database schema is defined in `api/src/repository/schema.ts`. The drizzle schema is used for generating the migrations and build queries.

The migrations are automatically generated based on the changes in the schema, and it can be done by running `yarn db:gen` in the `api/` folder.
