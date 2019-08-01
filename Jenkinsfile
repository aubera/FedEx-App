pipeline {
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
	
	}

}
