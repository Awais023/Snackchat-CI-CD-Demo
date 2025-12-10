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
                        def jsonText = readFile('test-results.json')
                        def results = new groovy.json.JsonSlurper().parseText(jsonText)
                        def executed = results.executed ?: 0
                        def passed = results.passed ?: 0
                        def failed = results.failed ?: 0

                        // Send Slack message using PowerShell (Windows safe)
                        powershell """
                        \$payload = @{
                            channel = '#all-test-automation'
                            text = 'Jenkins Build SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}\n*Test Results*: Executed: ${executed}, Passed: ${passed}, Failed: ${failed}'
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
