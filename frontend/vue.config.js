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
      '/auth': {
        target: process.env.VUE_APP_KEYCLOAK_AUTH_HOST,
        changeOrigin: true,
      },
      '/api/v1/course': {
        target: process.env.VUE_APP_COURSE_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/studentgraduation/undocompletion/': {
        target: process.env.VUE_APP_STUDENT_GRADUATION_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/studentgraduation/transcript/gradmessages' : {
        target: process.env.VUE_APP_STUDENT_GRADUATION_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/studentgraduation/algo/algorithm-rules': {
        target: process.env.VUE_APP_STUDENT_GRADUATION_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/studentgraduation/lgSc/lettergrade': {
        target: process.env.VUE_APP_STUDENT_GRADUATION_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/studentgraduation/lgSc/specialcase': {
        target: process.env.VUE_APP_STUDENT_GRADUATION_API_HOST,
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
      '/api/v1/student/studentHistory/': {
        target: process.env.VUE_APP_STUDENTS_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/student/studentHistory/batchid/': {
        target: process.env.VUE_APP_STUDENTS_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/student/studentOptionalProgramHistory/': {
        target: process.env.VUE_APP_STUDENTS_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/student/historyactivity': {
        target: process.env.VUE_APP_STUDENTS_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/studentgraduation/': {
        target: process.env.VUE_APP_STUDENT_GRADUATION_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/graduationreports': {
        target: process.env.VUE_APP_GRADUATION_REPORT_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/graduationreports/documentstatus': {
        target: process.env.VUE_APP_GRADUATION_REPORT_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/reports/signatures': {
        target: process.env.VUE_APP_GRAD_REPORT_API_HOST,
        changeOrigin: true,
      },      
      '/api/v1/program': {
        target: process.env.VUE_APP_PROGRAM_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/trax/school': {
        target: process.env.VUE_APP_TRAX_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/trax/psi': {
        target: process.env.VUE_APP_TRAX_API_HOST,
        changeOrigin: true,
      },    
      '/api/v1/trax/district': {
        target: process.env.VUE_APP_TRAX_API_HOST,
        changeOrigin: true,
      },          
      '/api/v1/batch/dashboard': {
        target: process.env.VUE_APP_BATCH_GRADUATION_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/batch/dashboard/errors/': {
        target: process.env.VUE_APP_BATCH_GRADUATION_API_HOST,
        changeOrigin: true,
      },
      '/api/v1/batch': {
        target: process.env.VUE_APP_BATCH_GRADUATION_API_HOST,
        changeOrigin: true,
      },
    }
  },
  transpileDependencies: ['vuetify'],
  publicPath: '/'
};