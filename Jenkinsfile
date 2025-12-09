pipeline {
    agent any
    stages {
        stage('Run Tests') {
            steps {
                echo "Running Selenium JS tests"
                bat 'npm install'
                bat 'npm test'
            }
        }
        stage('Slack Notification') {
            steps {
                slackSend(
                    tokenCredentialId: 'SLACK_BOT_TOKEN2',   // use credential ID directly
                    channel: '#all-test-automation',
                    color: 'good',
                    message: "✅ Jenkins build SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)"
                )
            }
        }
    }
    post {
        failure {
            slackSend(
                tokenCredentialId: 'SLACK_BOT_TOKEN2',  // use credential ID directly
                channel: '#all-test-automation',
                color: 'danger',
                message: "❌ Jenkins build FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)"
            )
        }
    }
}
