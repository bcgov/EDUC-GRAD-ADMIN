const fs = require("fs")

// Load specs with estimation time
const specsFilename = "specs.json"
const specs = JSON.parse(fs.readFileSync(__dirname + "/" + specsFilename, "utf8"))
// Get env variables from GitHub Action
const totalContainers = parseInt(process.argv[2] || "1", 10)
const containerIndex = parseInt(process.argv[3] || "0", 10)

// Sort tests by execution time (largest first)
const sortedTests = Object.entries(specs).sort((a, b) => b[1] - a[1])
// Empty containers 
const containers = Array.from({ length: totalContainers }, () => ({ tests: [], totalTime: 0 }))

for (const [test, time] of sortedTests) {
  // Find the container with the lowest total execution time and push the test
  const leastLoadedContainer = containers.reduce((minIndex, container, index) =>
    container.totalTime < containers[minIndex].totalTime ? index : minIndex, 0)
  
  containers[leastLoadedContainer].tests.push(test)
  containers[leastLoadedContainer].totalTime += time
}

// Get the tests assigned to the current container
const selectedTests = containers[containerIndex]?.tests || []
selectedTests.join("\n")
