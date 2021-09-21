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
      '/api/v1/course': {
        target: process.env.VUE_APP_COURSE_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/studentcourse': {
        target: process.env.VUE_APP_COURSE_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/studentexam':{
        target: process.env.VUE_APP_COURSE_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/studentassessment': {
        target: process.env.VUE_APP_ASSESSMENT_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/assessment': {
        target: process.env.VUE_APP_ASSESSMENT_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/graduate': {
        target: process.env.VUE_APP_GRADUATION_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/student': {
        target: process.env.VUE_APP_STUDENTS_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/algo': {
        target: process.env.VUE_APP_STUDENT_GRADUATION_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/lgSc': {
        target: process.env.VUE_APP_STUDENT_GRADUATION_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/ungrad/': {
        target: process.env.VUE_APP_STUDENT_GRADUATION_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/graduationreports': {
        target: process.env.VUE_APP_GRADUATION_REPORT_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/signatures': {
        target: process.env.VUE_APP_GRAD_REPORT_API_HOST,
        changeOrigin: true,
      },      
      '/api/v1/program': {
        target: process.env.VUE_APP_PROGRAM_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/school': {
        target: process.env.VUE_APP_TRAX_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/psi': {
        target: process.env.VUE_APP_TRAX_API_HOST,
        changeOrigin: true,
      },    
    }
  },
  transpileDependencies: ['vuetify'],
  publicPath: '/'
};