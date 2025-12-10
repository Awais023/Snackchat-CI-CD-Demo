pipeline {
    agent any

    stages {
        stage('Build & Run Tests') {
            steps {
                echo 'Running Selenium JS tests...'
                bat 'npm install' // if you need dependencies
                bat 'npx mocha tests/sample.test.js' // run your tests
            }
        }

        stage('Slack Notification') {
            steps {
                script {
                    // Read test results from JSON
                    def results = readJSON file: 'test-results.json'
                    def executed = results.executed ?: 0
                    def passed = results.passed ?: 0
                    def failed = results.failed ?: 0

                    // Construct Slack message
                    def slackMessage = """
                    ✅ Jenkins Build SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}
                    *Test Results*:
                    Executed: ${executed}
                    Passed: ${passed}
                    Failed: ${failed}
                    """

                    // Send message to Slack
                    withCredentials([string(credentialsId: 'SLACK_BOT_TOKEN', variable: 'SLACK_TOKEN')]) {
                        bat """
                        curl -X POST https://slack.com/api/chat.postMessage ^
                        -H "Authorization: Bearer %SLACK_TOKEN%" ^
                        -H "Content-type: application/json" ^
                        --data "{ \\"channel\\": \\"#all-test-automation\\", \\"text\\": \\"${slackMessage}\\" }"
                        """
                    }
                }
            }
        }
    }
}
