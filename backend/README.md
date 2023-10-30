## GRAD Admin Backend
The Node.js backend for GRAD Administration application.

### Local Setup
 **`Step 1`**. make sure you have Node.js 14.19.0 installed in your local machine. if not download from here https://nodejs.org/en/ 
 
 **`Step 2`**. make sure either you have redis installed locally(https://redis.io/download) or through docker. Run commanddocker run --name redis -d -p 6379:6379 redis redis-server --appendonly yes


 **`Step 3`**. Add NODE_ENV=local as environment variable.
 
 **`Step 4`**. Ask for local.json file which contains all the configs from teammate (Copy local.json into /backend/src/config folder), or create it by following config maps from oc console. 
 
 **`Step 5`**. run `npm install` in command line from backend folder, to install required dependencies.
 
 **`Step 6`**. run `npm run serve` in command line from backend folder, to run the app.

`Unit Tests`
    run `npm run test` in command line from backend folder, to execute unit tests.
