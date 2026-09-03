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
                script {
                    if (env.BRANCH_NAME == 'main') {
                        sh """
                            set -a
                            . ./.env
                            set +a
                            docker build \
                              --allow network.host \
                              --target prod \
                              --build-arg VITE_API_BASE_URL=\$VITE_API_BASE_URL \
                              -t ${IMAGE_NAME}:${IMAGE_TAG} \
                              -t ${IMAGE_NAME}:prod-latest \
                              .
                        """
                    } else {
                        sh """
                            docker build \
                              --allow network.host \
                              --target dev \
                              -t ${IMAGE_NAME}:${IMAGE_TAG} \
                              .
                        """
                    }
                }
            }
        }

        stage('Push Docker Image (opcional)') {
            when { branch 'main' }
            steps {
                script {
                    // Credenciales "Secret text" (docker-registry-url) y "Username
                    // with password" (docker-registry-credentials). Son opcionales:
                    // si no existen, se omite el push sin romper el pipeline.
                    try {
                        withCredentials([
                            string(credentialsId: 'docker-registry-url', variable: 'REGISTRY'),
                            usernamePassword(credentialsId: 'docker-registry-credentials', usernameVariable: 'DOCKER_USR', passwordVariable: 'DOCKER_PSW')
                        ]) {
                            sh '''
                                docker tag "$IMAGE_NAME:$IMAGE_TAG" "$REGISTRY/$IMAGE_NAME:$IMAGE_TAG"
                                docker tag "$IMAGE_NAME:prod-latest" "$REGISTRY/$IMAGE_NAME:prod-latest"
                                echo "$DOCKER_PSW" | docker login "$REGISTRY" -u "$DOCKER_USR" --password-stdin
                                docker push "$REGISTRY/$IMAGE_NAME:$IMAGE_TAG"
                                docker push "$REGISTRY/$IMAGE_NAME:prod-latest"
                            '''
                        }
                    } catch (err) {
                        echo "Push a registry omitido (no hay credenciales docker-registry-url / docker-registry-credentials configuradas): ${err}"
                    }
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
