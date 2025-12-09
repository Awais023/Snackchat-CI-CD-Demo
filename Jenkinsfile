pipeline {
    agent any
    stages {
        stage('Run Tests') {
            steps {
                echo "Running Selenium JS tests"
                sh 'npm test'  // your Selenium test command
            }
        }
        stage('Slack Notification') {
            steps {
                withCredentials([string(credentialsId: 'SLACK_BOT_TOKEN2', variable: 'SLACK_TOKEN')]) {
                    slackSend(
                        token: "${SLACK_TOKEN}",
                        channel: "#all-test-automation",   // replace with your Slack channel
                        color: "good",
                        message: "✅ Jenkins build SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)"
                    )
                }
            }
        }
    }
    post {
        failure {
            withCredentials([string(credentialsId: 'SLACK_BOT_TOKEN2', variable: 'SLACK_TOKEN')]) {
                slackSend(
                    token: "${SLACK_TOKEN}",
                    channel: "#all-test-automation",   // replace with your Slack channel
                    color: "danger",
                    message: "❌ Jenkins build FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)"
                )
            }
        }
    }
}
