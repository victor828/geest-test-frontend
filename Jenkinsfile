pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '15'))
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        IMAGE_NAME = 'geest-test-frontend'
        IMAGE_TAG  = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Load prod env file') {
            when { branch 'main' }
            steps {
                // Credencial "Secret file" en Jenkins con id: geest-frontend-env-file
                // Solo se necesita para construir/desplegar producción (main).
                withCredentials([file(credentialsId: 'geest-frontend-env-file', variable: 'ENV_FILE')]) {
                    sh 'cp "$ENV_FILE" .env'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                // Credencial "Secret text" en Jenkins con id: docker-registry-url
                withCredentials([string(credentialsId: 'docker-registry-url', variable: 'REGISTRY')]) {
                    script {
                        if (env.BRANCH_NAME == 'main') {
                            sh """
                                set -a
                                . ./.env
                                set +a
                                docker build \
                                  --target prod \
                                  --build-arg VITE_API_BASE_URL=\$VITE_API_BASE_URL \
                                  -t \$REGISTRY/${IMAGE_NAME}:${IMAGE_TAG} \
                                  -t \$REGISTRY/${IMAGE_NAME}:prod-latest \
                                  .
                            """
                        } else {
                            sh """
                                docker build \
                                  --target dev \
                                  -t \$REGISTRY/${IMAGE_NAME}:${IMAGE_TAG} \
                                  .
                            """
                        }
                    }
                }
            }
        }

        stage('Push Docker Image') {
            when { branch 'main' }
            steps {
                // Credencial "Secret text" con id: docker-registry-url
                // Credencial "Username with password" con id: docker-registry-credentials
                withCredentials([
                    string(credentialsId: 'docker-registry-url', variable: 'REGISTRY'),
                    usernamePassword(credentialsId: 'docker-registry-credentials', usernameVariable: 'DOCKER_USR', passwordVariable: 'DOCKER_PSW')
                ]) {
                    sh 'echo "$DOCKER_PSW" | docker login "$REGISTRY" -u "$DOCKER_USR" --password-stdin'
                    sh 'docker push "$REGISTRY/${IMAGE_NAME}:${IMAGE_TAG}"'
                    sh 'docker push "$REGISTRY/${IMAGE_NAME}:prod-latest"'
                }
            }
        }

        stage('Deploy Prod') {
            when { branch 'main' }
            steps {
                sh '''
                    docker compose -f docker-compose.prod.yml --env-file .env up -d --build
                '''
            }
        }
    }

    post {
        always {
            sh 'rm -f .env || true'
            sh 'docker image prune -f || true'
        }
        success {
            echo "Build ${env.IMAGE_TAG} completado correctamente."
        }
        failure {
            echo "Build ${env.IMAGE_TAG} fallo."
        }
    }
}
