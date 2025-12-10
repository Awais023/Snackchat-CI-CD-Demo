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

                // Run Mocha tests and ignore exit code so pipeline continues
                bat(script: "npx mocha tests/sample.test.js --reporter json > test-results.json", returnStatus: true)
            }
        }

        stage('Slack Notification') {
            steps {
                script {
                    // Read test results JSON safely
                    def results = readJSON file: 'test-results.json'
                    env.EXECUTED = results.stats.tests.toString()
                    env.PASSED = results.stats.passes.toString()
                    env.FAILED = results.stats.failures.toString()
                }

                withCredentials([string(credentialsId: 'SLACK_BOT_TOKEN', variable: 'SLACK_TOKEN')]) {
                    // Create Slack payload file to handle Windows escaping
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
        success {
            echo "Build succeeded!"
        }
        failure {
            echo "Build failed!"
        }
    }
}
