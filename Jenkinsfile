pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Running tests...'
            }
        }
        stage('Slack Notification') {
            steps {
                slackSend(
                    channel: '#all-test-automation',
                    color: 'good',
                    message: "✅ Jenkins build SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    tokenCredentialId: 'SLACK_BOT_TOKEN2'
                )
            }
        }
    }
}
