module.exports = {
    configureWebpack: {
      performance: {
        hints: false
      },
      optimization: {
        splitChunks: {
          minSize: 10000,
          maxSize: 250000
        }
      }
    },
    devServer: {
      proxy: {
        '/grad': {
          target: "https://gradstudent-api-77c02f-dev.apps.silver.devops.gov.bc.ca",
          changeOrigin: true,
          pathRewrite: {
            '^/grad': ''
          }
        },
        '/api/student-assessments': {
          target: "https://student-assessment-api-77c02f-dev.apps.silver.devops.gov.bc.ca",
          changeOrigin: true,
          pathRewrite: {
            '^/api/student-assessments': ''
          }
        },
        '/api/studentexam': {
            target: "https://student-exam-api-77c02f-dev.apps.silver.devops.gov.bc.ca",
            changeOrigin: true,
            pathRewrite: {
                '^/api/studentexam': ''
              }
          },
  
      }
    },
    publicPath: '/'
  };
  