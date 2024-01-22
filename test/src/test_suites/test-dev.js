/*
Workspace when developing tests cases. This is a bandaid fix for users having issues running tests from the commandline
*/
const createTestCafe = require('testcafe');
const log = require('npmlog');

let testcafe = null;

createTestCafe('localhost', 1337, 1338)
    .then(tc => {
        testcafe = tc;
        const runner = testcafe.createRunner();
        return runner
            // use 'chrome:headless' to run without visual window emulation
            .browsers(['chrome'])
            // specify how many browser instances to run; queued tests will start in the next available instance
            .concurrency(1)
            //Enter the name of the test case(s) in the following array that you want to run
            .src(["src/test_cases/studentSearch.js"])
            .run();
    })
    .then(failedCount => {
        log.info('Tests failed: ' + failedCount);
        if(failedCount !== 0)
        {
            throw new Error("Test failed");
        }
        testcafe.close();
    })
    .catch((e) => {
        console.error('TEST ERR', e);
    });
    