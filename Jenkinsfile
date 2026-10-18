pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                sh 'git pull origin main'
            }
        }
        stage('Unit Tests') {
            steps {
                sh 'npm test'
            }
        } 
        stage('Trivy Scan') {
            steps {
                sh 'docker run --rm -v "$WORKSPACE:/project" aquasec/trivy fs --scanners vuln,secret,misconfig /project'
            }
        }
        stage('Build') {
            steps {
                sh 'docker build --pull --rm -f "Dockerfile" -t blog:latest "."'
            }
        }
        stage('Run') {
            steps {
                sh 'docker stop blog || true'
                sh 'docker rm blog || true'
                sh 'docker run -d -p 3000:3000 --name blog blog'
            }
        }
        stage('Nikto Scan') {
            steps {
                sh 'docker run --rm --network host ghcr.io/sullo/nikto:latest -h http://127.0.0.1:3000'
            }
}
    }
}