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
                        \\"text\\": \\"Jenkins Build Notification\\",
                        \\"blocks\\": [
                            {
                                \\"type\\": \\"section\\",
                                \\"text\\": {
                                    \\"type\\": \\"mrkdwn\\",
                                    \\"text\\": \\"*✅ Jenkins Build Completed!*\\nJob: ${env.JOB_NAME} #${env.BUILD_NUMBER}\\"
                                }
                            },
                            {
                                \\"type\\": \\"actions\\",
                                \\"elements\\": [
                                    {
                                        \\"type\\": \\"button\\",
                                        \\"text\\": {
                                            \\"type\\": \\"plain_text\\",
                                            \\"text\\": \\"View Build\\"
                                        },
                                        \\"url\\": \\"${env.BUILD_URL}\\"
                                    },
                                    {
                                        \\"type\\": \\"button\\",
                                        \\"text\\": {
                                            \\"type\\": \\"plain_text\\",
                                            \\"text\\": \\"Open Job\\"
                                        },
                                        \\"url\\": \\"${env.JOB_URL}\\"
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
                    \\"text\\": \\"❌ Jenkins Build Failed\\",
                    \\"blocks\\": [
                        {
                            \\"type\\": \\"section\\",
                            \\"text\\": {
                                \\"type\\": \\"mrkdwn\\",
                                \\"text\\": \\"*❌ Build Failed!*\\nJob: ${env.JOB_NAME} #${env.BUILD_NUMBER}\\"
                            }
                        },
                        {
                            \\"type\\": \\"actions\\",
                            \\"elements\\": [
                                {
                                    \\"type\\": \\"button\\",
                                    \\"text\\": {
                                        \\"type\\": \\"plain_text\\",
                                        \\"text\\": \\"View Build\\"
                                    },
                                    \\"url\\": \\"${env.BUILD_URL}\\"
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
