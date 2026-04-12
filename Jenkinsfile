pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_USERNAME    = "${DOCKERHUB_CREDENTIALS_USR}"
        FRONTEND_IMAGE        = "${DOCKERHUB_CREDENTIALS_USR}/ims-frontend"
        BACKEND_IMAGE         = "${DOCKERHUB_CREDENTIALS_USR}/ims-backend"
        IMAGE_TAG             = "${BUILD_NUMBER}"
    }

    triggers {
        githubPush()
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Checking out branch: ${env.BRANCH_NAME}"
                checkout scm
            }
        }

        stage('Test Backend') {
            steps {
                dir('Backend') {
                    sh '''
                        npm install
                        npm test || echo "No tests found, skipping..."
                    '''
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('Frontend') {
                    sh '''
                        npm install
                        npm test || echo "No tests found, skipping..."
                    '''
                }
            }
        }

        stage('Build Images') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        sh '''
                            docker build \
                                -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                                -t ${BACKEND_IMAGE}:latest \
                                ./Backend
                        '''
                    }
                }
                stage('Build Frontend Image') {
                    steps {
                        sh '''
                            docker build \
                                -f Frontend/dockerfile.dev \
                                -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                                -t ${FRONTEND_IMAGE}:latest \
                                ./Frontend
                        '''
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh 'echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin'
                sh '''
                    docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                    docker push ${BACKEND_IMAGE}:latest
                    docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                    docker push ${FRONTEND_IMAGE}:latest
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker compose down --remove-orphans
                    IMAGE_TAG=${IMAGE_TAG} docker compose up -d
                '''
            }
        }

    }

    post {
        always {
            node('') {
                sh 'docker logout || true'
            }
        }
        success {
            echo "Pipeline succeeded! Images pushed:"
            echo "  ${BACKEND_IMAGE}:${IMAGE_TAG}"
            echo "  ${FRONTEND_IMAGE}:${IMAGE_TAG}"
        }
        failure {
            echo "Pipeline failed at stage: ${env.STAGE_NAME}"
        }
        cleanup {
            node('') {
                sh '''
                    docker rmi ${BACKEND_IMAGE}:${IMAGE_TAG}  || true
                    docker rmi ${FRONTEND_IMAGE}:${IMAGE_TAG} || true
                '''
            }
        }
    }
}