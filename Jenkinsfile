pipeline {
    agent any
    stages {

        stage('Using Docker Credentials') {
            steps {
                echo 'LOGGING INTO DOCKER................'
                sh'cat ~/my_creds.txt | docker login --username 4990814 --password-stdin'
            }
        }

        // stage('Build Dev Image For Testing') {
        //     steps {
        //         sh 'docker build -t 4990814/dock-hand-dev -f Dockerfile.dev .'
        //     }
        // }

        // stage('Run Web Tests') {
        //     steps {
        //         sh 'docker run 4990814/dock-hand-dev npm run test-docker'
        //     }
        // }

        stage('Build Prod Image') {
            steps {
                echo 'Building Prod Web Image....'
                sh 'docker build -t 4990814/dock-hand .'
            }
        }

        stage('Send Prod Image to Docker Hub') {
            steps {
                sh '''
                echo 'Pushing Image to Docker Hub'
                docker push 4990814/dock-hand
                '''
            }
        }
    }
}

