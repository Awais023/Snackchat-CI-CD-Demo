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
                
                // Install dependencies
                bat "npm install"

                // Run Mocha tests and output JSON results safely
                bat "npx mocha tests/sample.test.js --reporter json --reporter-options output=test-results.json || exit 0"
            }
        }

        stage('Slack Notification') {
            steps {
                script {
                    // Read the test-results.json safely
                    def results = readJSON file: 'test-results.json'

                    // Set environment variables for Slack message
                    env.EXECUTED = results.stats.tests.toString()
                    env.PASSED = results.stats.passes.toString()
                    env.FAILED = results.stats.failures.toString()
                }

                // Send Slack notification
                withCredentials([string(credentialsId: 'SLACK_BOT_TOKEN', variable: 'SLACK_TOKEN')]) {
                    bat """
                    echo { \\"channel\\": \\"#all-test-automation\\", \\"text\\": \\"Jenkins Build: ${env.JOB_NAME} #${env.BUILD_NUMBER} | Executed: ${env.EXECUTED}, Passed: ${env.PASSED}, Failed: ${env.FAILED}\\" } > slack-message.json
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
        success {
            echo "Build succeeded!"
        }
        failure {
            echo "Build failed!"
        }
    }
}
