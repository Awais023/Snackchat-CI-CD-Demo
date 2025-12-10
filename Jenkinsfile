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
                script {
                    def results = readJSON file: 'test-results.json'
                    env.PASSED = results.stats.passes.toString()
                    env.FAILED = results.stats.failures.toString()
                    env.EXECUTED = results.stats.tests.toString()
                }
                withCredentials([string(credentialsId: 'SLACK_BOT_TOKEN', variable: 'SLACK_TOKEN')]) {
                    bat """
                    curl -X POST https://slack.com/api/chat.postMessage ^
                    -H "Authorization: Bearer %SLACK_TOKEN%" ^
                    -H "Content-type: application/json" ^
                    --data "{ \\"channel\\": \\"#all-test-automation\\", \\"text\\": \\" Jenkins Build SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER} | Executed: ${env.EXECUTED}, Passed: ${env.PASSED}, Failed: ${env.FAILED}\\" }"
                    """
                }
            }
        }
    }
}
