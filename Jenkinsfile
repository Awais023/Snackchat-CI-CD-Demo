pipeline {
    agent any

    stages {
        stage('Build & Run Tests') {
            steps {
                echo 'Running Selenium JS tests...'
                bat 'npm install'
                bat 'npx mocha tests/sample.test.js'
            }
        }

        stage('Slack Notification') {
            steps {
                withCredentials([string(credentialsId: 'SLACK_BOT_TOKEN', variable: 'SLACK_TOKEN')]) {
                    script {
                        // Read JSON file
                        def jsonText = readFile('test-results.json')
                        def json = new groovy.json.JsonSlurper().parseText(jsonText)

                        // Extract only primitives
                        def executed = json.executed ?: 0
                        def passed = json.passed ?: 0
                        def failed = json.failed ?: 0

                        // Construct message
                        def slackMessage = "Jenkins Build SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}\n*Test Results*: Executed: ${executed}, Passed: ${passed}, Failed: ${failed}"

                        // Send via PowerShell
                        powershell """
                        \$payload = @{
                            channel = '#all-test-automation'
                            text = '${slackMessage}'
                        } | ConvertTo-Json
                        curl -X POST https://slack.com/api/chat.postMessage `
                            -H "Authorization: Bearer ${SLACK_TOKEN}" `
                            -H "Content-Type: application/json" `
                            --data \$payload
                        """
                    }
                }
            }
        }
    }
}
