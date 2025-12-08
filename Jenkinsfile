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
            echo 'Tests passed Yahoooo'
        }
        failure {
            echo 'Tests failed ❌'
        }
    }
}
