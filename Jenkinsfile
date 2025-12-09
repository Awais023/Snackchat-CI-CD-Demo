pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Starting Jenkins Build...'
            }
        }

        stage('Test') {
            steps {
                echo 'Running automated tests...'
            }
        }

        stage('Slack Notification') {
            steps {
                withCredentials([string(credentialsId: 'SLACK_BOT_TOKEN', variable: 'SLACK_TOKEN')]) {
                    bat """
                    curl -X POST https://slack.com/api/chat.postMessage ^
                    -H "Authorization: Bearer %SLACK_TOKEN%" ^
                    -H "Content-type: application/json" ^
                    --data "{
                        \\"channel\\": \\"#all-test-automation\\",
                        \\"text\\": \\"✅ Jenkins Build Completed: ${env.JOB_NAME} #${env.BUILD_NUMBER}\\"
                    }"
                    """
                }
            }
        }
    }

    post {
        failure {
            withCredentials([string(credentialsId: 'SLACK_BOT_TOKEN', variable: 'SLACK_TOKEN')]) {
                bat """
                curl -X POST https://slack.com/api/chat.postMessage ^
                -H "Authorization: Bearer %SLACK_TOKEN%" ^
                -H "Content-type: application/json" ^
                --data "{
                    \\"channel\\": \\"#all-test-automation\\",
                    \\"text\\": \\"❌ Jenkins Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}\\"
                }"
                """
            }
        }
    }
}
