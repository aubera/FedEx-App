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
					sh 'aws s3 cp s3://fedexenv-4d60572/.env ./.env'
					sh 'scp ./.env ubuntu@54.80.125.138:~/app/appenv/.env'
					sh 'rm ./.env'
				}
			}
		}

		stage ('Pull Docker Image') {
			when {
				branch 'master'
			}
			steps {
				sshagent(credentials['jadevssh'] {
					sh 'ssh -o StrictHostKeyChecking=no ubuntu@54.80.125.138 uptime'	
					sh "ssh ubuntu@54.80.125.138 'cd /home/ubuntu/app/docker && sudo docker pull hmarks/fedexday:latest'"
				}
			}
		}

		stage ('Start Docker Container and Copy Environmentals') {
			when {
				branch 'master'
			}
			steps {
				sh 'ssh ubuntu@54.80.125.138 "docker run --name my_fedexday -p 3000:3000 4200:4200 -d fedexday"'
			}
		}
	
	}

}
