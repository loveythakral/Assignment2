node {
    
    env.AWS_ECR_LOGIN=true
    def newApp
    def registry = 'sandy1480/docker-test'
    def registryCredential = 'dockerhub'
	
	stage('Git Cloning') {
		git 'https://github.com/loveythakral/Assignment2.git'
	}
	stage('Build Image') {
	    def nodeHome = tool name: 'node', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
	    env.PATH = "${nodeHome}/bin:${env.PATH}"
		sh 'npm install'
		sh 'npm run bowerInstall'
	}
	stage('Test Image') {
		sh 'npm test'
	}
	stage('Building Image') {
        docker.withRegistry( 'https://' + registry, registryCredential ) {
		    def buildName = registry + ":$BUILD_NUMBER"
			newApp = docker.build buildName
			newApp.push()
        }
	}
	stage('Registring Image') {
        docker.withRegistry( 'https://' + registry, registryCredential ) {
    		newApp.push 'latest2'
        }
	}
    stage('Removing image') {
        sh "docker rmi $registry:$BUILD_NUMBER"
        sh "docker rmi $registry:latest"
    }
    
}
