const createTestCafe = require('testcafe');
const log = require('npmlog');

let testcafe = null;

createTestCafe('localhost', 1337, 1338)
    .then(tc => {
        testcafe = tc;
        const runner = testcafe.createRunner();
        return runner
            // list multiple test files
            .src(["./src/test_cases"])
            .filter(async(testName, fixtureName, fixturePath, testMeta, fixtureMeta) =>  testMeta.testSuites?.regression)
            //.browsers(["chrome:headless", "firefox:headless"])
            .concurrency(5)
            .run();
    })
    .then(failedCount => {
        log.info('Tests failed: ' + failedCount);
        if(failedCount !== 0)
        {
            throw new Error("Test failed");
        }
        testcafe.close();
    });
