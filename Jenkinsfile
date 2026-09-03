pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '15'))
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        IMAGE_NAME   = 'geest-test-frontend'
        REGISTRY     = credentials('docker-registry-url')
        DOCKER_CREDS = credentials('docker-registry-credentials')
        ENV_FILE     = credentials('geest-frontend-env-file')
        IMAGE_TAG    = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Load env file') {
            steps {
                // ENV_FILE apunta al archivo temporal de la credencial "Secret file".
                // Se copia al workspace como .env para que Docker Compose y los
                // siguientes stages lo usen (page/registry/backend, puertos, etc).
                sh 'cp "$ENV_FILE" .env'
            }
        }

        stage('Install & Lint') {
            steps {
                sh 'corepack enable'
                sh 'pnpm install --frozen-lockfile'
                sh 'pnpm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def target = (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master') ? 'prod' : 'dev'
                    sh """
                        set -a
                        . ./.env
                        set +a
                        docker build \
                          --target ${target} \
                          --build-arg VITE_API_BASE_URL=\$VITE_API_BASE_URL \
                          -t ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} \
                          -t ${REGISTRY}/${IMAGE_NAME}:${env.BRANCH_NAME}-latest \
                          .
                    """
                }
            }
        }

        stage('Push Docker Image') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                    branch 'develop'
                }
            }
            steps {
                sh 'echo $DOCKER_CREDS_PSW | docker login $REGISTRY -u $DOCKER_CREDS_USR --password-stdin'
                sh "docker push ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
                sh "docker push ${REGISTRY}/${IMAGE_NAME}:${env.BRANCH_NAME}-latest"
            }
        }

        stage('Deploy') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                    branch 'develop'
                }
            }
            steps {
                sh '''
                    docker compose --env-file .env -f docker-compose.yml --profile prod up -d --build frontend-prod
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
            echo "Build ${IMAGE_TAG} completado correctamente."
        }
        failure {
            echo "Build ${IMAGE_TAG} fallo."
        }
    }
}
