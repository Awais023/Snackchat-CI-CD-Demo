pipeline {
    agent any

    environment {
        NODE_ENV = 'test'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build & Run Tests') {
            steps {
                echo 'Running tests...'
                bat 'npm install'
                // Run tests and generate JSON report
                bat 'npx mocha tests/sample.test.js --reporter json --reporter-options output=test-results.json || exit 0'
            }
        }

        stage('Slack Notification') {
            steps {
                script {
                    // Read test results
                    def results = readJSON file: 'test-results.json'
                    env.EXECUTED = results.stats.tests.toString()
                    env.PASSED = results.stats.passes.toString()
                    env.FAILED = results.stats.failures.toString()

                    // Prepare Slack message JSON file
                    def slackMessage = """
                    {
                        "channel": "#all-test-automation",
                        "text": "Jenkins Build: ${env.JOB_NAME} #${env.BUILD_NUMBER} | Executed: ${env.EXECUTED}, Passed: ${env.PASSED}, Failed: ${env.FAILED}"
                    }
                    """
                    writeFile file: 'slack-message.json', text: slackMessage
                }

                withCredentials([string(credentialsId: 'SLACK_BOT_TOKEN', variable: 'SLACK_TOKEN')]) {
                    // Send Slack notification using the JSON file
                    bat 'curl -X POST https://slack.com/api/chat.postMessage -H "Authorization: Bearer %SLACK_TOKEN%" -H "Content-type: application/json; charset=utf-8" --data @slack-message.json'
                }
            }
        }
    }

    post {
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
