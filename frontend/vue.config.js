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
        '/api': {
          target: process.env.VUE_APP_STUDENTS_API_HOST,
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        },
        '/api/student-assessments': {
          target: process.env.VUE_APP_STUDENT_ASSESSMENTS_API_HOST,
          changeOrigin: true,
          pathRewrite: {
            '^/api/student-assessments': ''
          }
        },
        '/api/studentexam': {
            target: process.env.VUE_APP_STUDENT_EXAMS_API_HOST,
            changeOrigin: true,
            pathRewrite: {
                '^/api/studentexam': ''
              }
          },
  
      }
    },
    publicPath: '/'
  };
  