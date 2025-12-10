pipeline {
    agent any

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

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
                        // Read file as plain text
                        def jsonText = readFile('test-results.json')

                        // Parse JSON and immediately extract only primitive values
                        def executed = new groovy.json.JsonSlurper().parseText(jsonText).executed ?: 0
                        def passed   = new groovy.json.JsonSlurper().parseText(jsonText).passed ?: 0
                        def failed   = new groovy.json.JsonSlurper().parseText(jsonText).failed ?: 0

                        // Build message string
                        def message = "Build #${env.BUILD_NUMBER} - Tests: Executed=${executed}, Passed=${passed}, Failed=${failed}"

                        // Send Slack notification using PowerShell and primitive string only
                        powershell """
                            \$payload = @{
                                channel = '#all-test-automation'
                                text = '${message}'
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

    post {
        always {
            echo "Pipeline finished."
        }
    }
}