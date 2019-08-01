pipeline {
	
	environment {
		registry = "hmarks/fedexday"
		registryCredential = 'hmarks_docker'
		dockerImage = ''
	}
	
	agent any

	stages {
	
		stage ('Checkout SCM') {
			when {
				branch 'master'
			}
			steps {
				checkout scm
			}
		}

		stage ('Build Docker Image') {
			when {
				branch 'master'
			}
			steps {
				script {
					dockerImage = docker.build registry + ":$BUILD_NUMBER"
				}
			}
		}

		stage ('Push to Dockerhub') {
			when {
				branch 'master'
			}
			steps {
				script {
					docker.withRegistry('', registryCredential) {
						dockerImage.push('latest')
					}
				}
			}
		}

		stage ('Getting the Environment Variables') {
			when {
				branch 'master'
			}
			steps {
				withAWS(credentials: 'awsebcred', region: 'us-east-1') {
					sh 'aws s3 cp s3://fedexenv-4d60572/.env $WORKSPACE/.env'
				}
			}
		}

		stage ('Copy Environmentals to EC2') {
			when {
				branch 'master'
			}
			steps {
				sshagent(credentials: ['fedexssh']) {
					sh 'ssh -o StrictHostKeyChecking=no ubuntu@54.80.125.138 uptime'
					sh 'scp $WORKSPACE/.env ubuntu@54.80.125.138:~/app/appenv'
					sh 'rm ./.env'
				}
			}
		}

		stage ('Dockerize Application') {
			when {
				branch 'master'
			}
			steps {
				sshagent(credentials: ['fedexssh']) {
					sh 'bash /home/ubuntu/app/docker/dockerize_fedex.sh'
				}
			}
		}

	}

}
