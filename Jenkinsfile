pipeline {
    agent any

    environment {
        JOB_STATUS = 'SUCCESS'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Starting Jenkins Build...'
                // Add actual build commands here
            }
        }

        stage('Test') {
            steps {
                echo 'Running automated tests...'
                // Add your Selenium/automation test commands here
            }
        }
    }

    post {
        success {
            script {
                JOB_STATUS = 'SUCCESS'
            }
        }
        failure {
            script {
                JOB_STATUS = 'FAILED'
            }
        }
        always {
            stage('Slack Notification') {
                steps {
                    withCredentials([string(credentialsId: 'SLACK_BOT_TOKEN', variable: 'SLACK_TOKEN')]) {
                        powershell """
                        \$payload = @{
                            channel = '#all-test-automation'
                            text = 'Jenkins Build Notification'
                            blocks = @(
                                @{
                                    type = 'section'
                                    text = @{
                                        type = 'mrkdwn'
                                        text = '*Build ${JOB_STATUS}*\nJob: ${env.JOB_NAME} #${env.BUILD_NUMBER}\nBranch: ${env.GIT_BRANCH}\nTriggered by: ${env.BUILD_USER}'
                                    }
                                },
                                @{
                                    type = 'context'
                                    elements = @(
                                        @{
                                            type = 'mrkdwn'
                                            text = 'Jenkins CI/CD Notification'
                                        }
                                    )
                                }
                            )
                        } | ConvertTo-Json -Compress

                        Invoke-RestMethod -Uri 'https://slack.com/api/chat.postMessage' `
                            -Method Post `
                            -Headers @{Authorization = "Bearer $env:SLACK_TOKEN"; 'Content-Type'='application/json'} `
                            -Body \$payload
                        """
                    }
                }
            }
        }
    }
}
