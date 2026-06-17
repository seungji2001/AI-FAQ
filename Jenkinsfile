pipeline {
    agent any

    parameters {
        booleanParam(name: 'PUSH_TO_GHCR', defaultValue: false, description: 'Push backend/frontend images to GHCR')
    }

    environment {
        // ─── 이미지 이름 ──────────────────────────────────────
        BACKEND_IMAGE  = "thingz-backend"
        FRONTEND_IMAGE = "thingz-frontend"
        BACKEND_REGISTRY_IMAGE = "ghcr.io/seungji2001/thingz-backend"
        FRONTEND_REGISTRY_IMAGE = "ghcr.io/seungji2001/thingz-frontend"

        // ─── 경로 ────────────────────────────────────────────
        FE_DIR = "fo/thingz-fo"
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    stages {
        // ── 1. 소스 체크아웃 ─────────────────────────────────
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.IMAGE_TAG = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                }
                echo "📥 브랜치: ${env.BRANCH_NAME ?: 'main'} | 태그: ${env.IMAGE_TAG}"
            }
        }

        // ── 2. 백엔드 빌드 (Docker 이미지) ───────────────────
        stage('Build Backend') {
            steps {
                echo "🔨 Spring Boot 이미지 빌드 중..."
                sh """
                    docker build \
                        -t \${BACKEND_IMAGE}:\${IMAGE_TAG} \
                        -t \${BACKEND_IMAGE}:latest \
                        -t \${BACKEND_REGISTRY_IMAGE}:\${IMAGE_TAG} \
                        -t \${BACKEND_REGISTRY_IMAGE}:latest \
                        .
                """
            }
        }

        // ── 3. 프론트엔드 빌드 (Docker 이미지) ───────────────
        stage('Build Frontend') {
            steps {
                echo "🔨 Next.js 이미지 빌드 중..."
                withCredentials([string(credentialsId: 'NEXT_PUBLIC_API_BASE', variable: 'API_BASE')]) {
                    sh """
                        docker build \
                            --build-arg NEXT_PUBLIC_API_BASE=\${API_BASE} \
                            -t \${FRONTEND_IMAGE}:\${IMAGE_TAG} \
                            -t \${FRONTEND_IMAGE}:latest \
                            -t \${FRONTEND_REGISTRY_IMAGE}:\${IMAGE_TAG} \
                            -t \${FRONTEND_REGISTRY_IMAGE}:latest \
                            \${FE_DIR}
                    """
                }
            }
        }

        // ── 4. 이미지 Registry Push ─────────────────────────
        stage('Push Images') {
            when {
                expression { return params.PUSH_TO_GHCR }
            }
            steps {
                echo "📦 GHCR 이미지 push 중... (태그: ${env.IMAGE_TAG})"
                withCredentials([usernamePassword(credentialsId: 'GHCR_CREDENTIALS', usernameVariable: 'GHCR_USER', passwordVariable: 'GHCR_TOKEN')]) {
                    sh """
                        echo "\${GHCR_TOKEN}" | docker login ghcr.io -u "\${GHCR_USER}" --password-stdin

                        docker push \${BACKEND_REGISTRY_IMAGE}:\${IMAGE_TAG}
                        docker push \${BACKEND_REGISTRY_IMAGE}:latest
                        docker push \${FRONTEND_REGISTRY_IMAGE}:\${IMAGE_TAG}
                        docker push \${FRONTEND_REGISTRY_IMAGE}:latest
                    """
                }
            }
        }

        // ── 5. 배포 ──────────────────────────────────────────
        stage('Deploy') {
            steps {
                echo "🚀 Docker Compose 배포 중... (태그: ${env.IMAGE_TAG})"
                withCredentials([file(credentialsId: 'THINGZ_ENV_FILE', variable: 'ENV_FILE')]) {
                    sh """
                        # 환경변수 파일 복사
                        cp \${ENV_FILE} .env

                        # 이미지 태그 주입 후 재시작
                        IMAGE_TAG=\${IMAGE_TAG} docker compose up -d --no-build

                        # 헬스 체크 대기 (최대 2분)
                        echo "⏳ 서비스 기동 대기..."
                        sleep 30

                        # 컨테이너 상태 확인
                        docker compose ps

                        # 오래된 이미지 정리
                        docker image prune -f
                    """
                }
            }
        }

        // ── 6. 검증 ──────────────────────────────────────────
        stage('Verify') {
            steps {
                echo "✅ 서비스 응답 확인 중..."
                sh """
                    # 백엔드 헬스 체크
                    timeout 60 sh -c 'until curl -sf http://localhost:8080/actuator/health; do sleep 3; done'
                    echo ""
                    echo "✅ 백엔드 정상"

                    # 프론트엔드 헬스 체크
                    timeout 60 sh -c 'until curl -sf http://localhost:\${FRONTEND_PORT:-3001}; do sleep 3; done'
                    echo "✅ 프론트엔드 정상"
                """
            }
        }
    }

    post {
        success {
            echo """
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ✅ 배포 완료
            브랜치 : ${env.BRANCH_NAME ?: 'main'}
            이미지  : ${env.IMAGE_TAG}
            GHCR    : ${env.BACKEND_REGISTRY_IMAGE}:${env.IMAGE_TAG}
                    ${env.FRONTEND_REGISTRY_IMAGE}:${env.IMAGE_TAG}
            백엔드  : http://localhost:8080
            프론트  : http://localhost:${env.FRONTEND_PORT ?: '3001'}
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            """
        }
        failure {
            echo "❌ 배포 실패 — 로그를 확인하세요"
            // 실패 시 이전 이미지로 롤백
            withCredentials([file(credentialsId: 'THINGZ_ENV_FILE', variable: 'ENV_FILE')]) {
                sh """
                    echo "⏪ latest 이미지로 롤백 시도..."
                    cp \${ENV_FILE} .env
                    IMAGE_TAG=latest docker compose up -d --no-build || true
                """
            }
        }
        cleanup {
            // 임시 .env 파일 삭제 (보안)
            sh 'rm -f .env'
            sh 'docker logout ghcr.io || true'
        }
    }
}
