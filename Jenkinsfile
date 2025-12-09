pipeline {
    agent any

    environment {
        // You can define any env variables here if needed
    }

    stages {
        stage('Build') {
            steps {
                echo 'Starting Jenkins Build...'
                // You can add actual build/test commands here
            }
        }

        stage('Test') {
            steps {
                echo 'Running automated tests...'
                // Placeholder for test commands
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
                        \\"text\\": \\"✅ Jenkins Build Completed: ${env.JOB_NAME} #${env.BUILD_NUMBER}\\",
                        \\"blocks\\": [
                            {
                                \\"type\\": \\"header\\",
                                \\"text\\": {
                                    \\"type\\": \\"plain_text\\",
                                    \\"text\\": \\"Jenkins Build Notification\\"
                                }
                            },
                            {
                                \\"type\\": \\"section\\",
                                \\"fields\\": [
                                    { \\"type\\": \\"mrkdwn\\", \\"text\\": \\"*Job:* ${env.JOB_NAME}\\" },
                                    { \\"type\\": \\"mrkdwn\\", \\"text\\": \\"*Build Number:* #${env.BUILD_NUMBER}\\" },
                                    { \\"type\\": \\"mrkdwn\\", \\"text\\": \\"*Status:* ✅ Success\\" },
                                    { \\"type\\": \\"mrkdwn\\", \\"text\\": \\"*Triggered by:* ${env.BUILD_USER}\\" }
                                ]
                            },
                            {
                                \\"type\\": \\"actions\\",
                                \\"elements\\": [
                                    {
                                        \\"type\\": \\"button\\",
                                        \\"text\\": { \\"type\\": \\"plain_text\\", \\"text\\": \\"View Build\\" },
                                        \\"url\\": \\"${env.BUILD_URL}\\",
                                        \\"style\\": \\"primary\\"
                                    },
                                    {
                                        \\"type\\": \\"button\\",
                                        \\"text\\": { \\"type\\": \\"plain_text\\", \\"text\\": \\"Re-run Job\\" },
                                        \\"url\\": \\"${env.BUILD_URL}rebuild\\",
                                        \\"style\\": \\"danger\\"
                                    }
                                ]
                            }
                        ]
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
                    \\"text\\": \\"❌ Jenkins Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}\\",
                    \\"blocks\\": [
                        {
                            \\"type\\": \\"section\\",
                            \\"text\\": { \\"type\\": \\"mrkdwn\\", \\"text\\": \\"*Jenkins Build Failed!*\\nJob: ${env.JOB_NAME} #${env.BUILD_NUMBER} failed. Please check immediately.\\" }
                        },
                        {
                            \\"type\\": \\"actions\\",
                            \\"elements\\": [
                                {
                                    \\"type\\": \\"button\\",
                                    \\"text\\": { \\"type\\": \\"plain_text\\", \\"text\\": \\"View Build\\" },
                                    \\"url\\": \\"${env.BUILD_URL}\\",
                                    \\"style\\": \\"danger\\"
                                }
                            ]
                        }
                    ]
                }"
                """
            }
        }
    }
}
