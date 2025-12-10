pipeline {
    agent any

    environment {
        // Make sure you have added SLACK_TOKEN in Jenkins credentials (Secret Text)
        SLACK_TOKEN = credentials('SLACK_TOKEN')
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                bat 'npm install'
            }
        }

        stage('Run Selenium JS Tests') {
            steps {
                echo 'Running Selenium JS tests...'
                bat 'npx mocha tests/sample.test.js --reporter json > test-results.json'
            }
        }

        stage('Parse Test Results') {
            steps {
                script {
                    def results = readJSON file: 'test-results.json'
                    env.PASSED = results.stats.passes.toString()
                    env.FAILED = results.stats.failures.toString()
                    env.EXECUTED = results.stats.tests.toString()
                }
            }
        }

        stage('Slack Notification') {
            steps {
                powershell """
                    \$headers = @{
                        'Authorization' = 'Bearer \$env:SLACK_TOKEN'
                        'Content-Type' = 'application/json'
                    }

                    \$payload = @{
                        text = 'Selenium JS Tests Completed. Executed: \$env:EXECUTED, Passed: \$env:PASSED, Failed: \$env:FAILED'
                    } | ConvertTo-Json

                    Invoke-WebRequest -Uri 'https://slack.com/api/chat.postMessage?channel=#your-channel' -Method POST -Headers \$headers -Body \$payload
                """
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
    }
}
