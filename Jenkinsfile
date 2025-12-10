pipeline {
    agent any

    environment {
        NODEJS_HOME = "C:\\Program Files\\nodejs" // Adjust if needed
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
                echo 'Running Selenium JS tests...'
                bat 'npm install'
                bat 'npx mocha tests/sample.test.js'
            }
        }

        stage('Slack Notification') {
            steps {
                withCredentials([string(credentialsId: 'SLACK_BOT_TOKEN', variable: 'SLACK_TOKEN')]) {
                    script {
                        // Read JSON file as text
                        def jsonText = readFile('test-results.json')

                        // Parse JSON
                        def json = new groovy.json.JsonSlurper().parseText(jsonText)

                        // Extract only primitive values
                        def executed = json.executed ?: 0
                        def passed = json.passed ?: 0
                        def failed = json.failed ?: 0

                        // Build a plain string message
                        def message = "Build #${env.BUILD_NUMBER} - Tests: Executed=${executed}, Passed=${passed}, Failed=${failed}"

                        // Send Slack notification via PowerShell
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
