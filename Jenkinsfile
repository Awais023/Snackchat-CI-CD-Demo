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
                  if (results != null) {
                    env.PASSED = results.passed.toString()
                    env.FAILED = results.failed.toString()
                    env.EXECUTED = results.executed.toString()
                    } else {
                        env.PASSED = '0'
                        env.FAILED = '0'
                        env.EXECUTED = '0'
                        }
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
