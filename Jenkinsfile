pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                script {
                    // Thay thế 'your-credentials-id' bằng ID của credentials đã tạo
                    withCredentials([usernamePassword(credentialsId: 'github-credentials', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                        // Clone code từ GitHub
                        checkout([$class: 'GitSCM',
                            branches: [[name: 'main']],
                            userRemoteConfigs: [[
                                url: 'https://github.com/fpt-fall-2023/FUBlogHub.git',
                                credentialsId: 'github-credentials'
                            ]]
                        ])
                    }
                }
            }
        }
        // Thêm các bước khác theo nhu cầu của bạn
    }
}
