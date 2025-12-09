pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                echo 'Installing dependencies...'
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running Selenium tests...'
                bat 'npm test'
            }
        }
    }

    post {
        success {
            echo 'Tests passed Yahoooo 12/10/2025'
        }
        failure {
            echo 'Tests failed ❌'
        }
    }
}
