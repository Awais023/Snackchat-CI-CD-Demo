pipeline {
    agent any

    environment {
        NODEJS_HOME = "C:\\Program Files\\nodejs"
        PATH = "${env.NODEJS_HOME};${env.PATH}"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build & Run Tests') {
            steps {
                echo "Running tests..."
                bat "npm install"
                bat "npx mocha tests/sample.test.js --reporter json > test-results.json"
            }
        }

        stage('Slack Notification') {
            steps {
                script {
                    // Read test results JSON
                    def results = readJSON file: 'test-results.json'
                    env.EXECUTED = results.stats.tests.toString()
                    env.PASSED = results.stats.passes.toString()
                    env.FAILED = results.stats.failures.toString()
                }

                withCredentials([string(credentialsId: 'SLACK_BOT_TOKEN', variable: 'SLACK_TOKEN')]) {
                    // Send Slack message safely on Windows
                    bat """
                    echo { \\"channel\\": \\"#all-test-automation\\", \\"text\\": \\"Jenkins Build SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER} | Executed: ${env.EXECUTED}, Passed: ${env.PASSED}, Failed: ${env.FAILED}\\" } > slack-message.json
                    curl -X POST https://slack.com/api/chat.postMessage ^
                    -H "Authorization: Bearer %SLACK_TOKEN%" ^
                    -H "Content-type: application/json" ^
                    --data @slack-message.json
                    """
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished."
        }
        failure {
            echo "Build failed!"
        }
        success {
            echo "Build succeeded!"
        }
    }
}
