pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'npm test'
      }
      post {
        always {
          junit 'test-results/*.xml' // will be added after Module 4
          archiveArtifacts artifacts: 'test-results/*.xml', allowEmptyArchive: true
        }
      }
    }
  }

  post {
    always {
      echo "Build finished: ${currentBuild.currentResult}"
    }
  }
}
