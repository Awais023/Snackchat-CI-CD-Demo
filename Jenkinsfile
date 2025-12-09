pipeline {
    agent any
    stages {
        stage('Slack Test') {
            steps {
                slackSend(
                    channel: '#all-test-automation',
                    color: 'good',
                    message: "✅ Test message from Jenkins Pipeline",
                    tokenCredentialId: 'SLACK_BOT_TOKEN2'
                )
            }
        }
    }
}
