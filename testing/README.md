# Cypress Testing
### Setup
1. From within the `testing` dir, run `npm install` to make sure Cypress is installed
2. Obtain a copy of the cypress.env.json file from a teammate and save within the `testing` dir

### Running Cypress
In the `testing` dir, you can run Cypress testing in multiple ways, either in the IDE or terminal
- `npm run cy:open` - This will open the Cypress UI where you can select your browser, and visually observe the testing running.
-  `npm run cy:run` - This will run Cypress testing in the terminal (run all tests in default), and outputs result.  
-  To run a specic spec, use Cypress UI to select a spec (`npm run cy:open`), or use `npx cypress run --spec cypress/e2e/example.cy.js`.

#### Running Cypress Locally
When running Cypress in local environment, run GRAD locally and change the `baseUrl` in `cypress.config.json` to `"http:/localhost:8081"`.

### When Adding, Modifying, and Deleting spec files
Make sure to:
- Put them under `testing/cypress/e2e` so that Cypress can recognize them as specs
- Update `testing/parallel/specs.json` if you need to run **Cypress Testing on GitHub Action**

##### Cypress Testing on GitHub Action
When you run Cypress workflow on GitHub Action, all specs run in parallel by being distributed into multiple containers that run simultaneously. `testing/parallel/split-tests.js` takes the index and number of containers from GitHub Action, then tries to distribute tests equally based on the "estimate time" that developers have to define as they develop or create specs in `testing/parallel/specs.json`.

Estimate time is a simply arbitrary value that represents the time it takes to run the test in seconds. It can be the actual time it took to run in a previous test or a complete estimate.

### Additional Note
##### Login issue
If your test fails due to login when you are running Cypress on UI, it is most likely that the refresh token in the current session has been expired. In that case, click **"Clear All Sessions"** at the top of testing log next to "SESSIONS" tab to re-login and obtain a new token. 

##### JSDoc documentation
For generating documentation using JSDoc, run `npm run doc` under `testing` folder and it will create `doc` folder. To see generated HTML files, open generated `index.html` under `doc` folder in any browser.