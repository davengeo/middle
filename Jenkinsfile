try {
	node ('Slave-simone') {
        deleteDir()
        dir('project'){
            git credentialsId: '56e6dec6-558f-40a8-8d81-23bff8ebb509', url: 'git@el2604.bc:DOF-Labs/middle-js.git'
            withEnv(["PATH+NODE=/msservice/app/node/bin","HTTPS_PROXY=http://el2604:8088"]) {

            stage 'test'
                sh 'npm install'
				sh 'npm test'

            stage 'deploy'
                echo 'TBD with Mainak'

            currentBuild.result = "SUCCESS"
            mail body: "Build was a success! Check details at ${env.BUILD_URL}console.", from: "architecture.jenkins@belgacom.be", subject: "Build SUCCESS in Jenkins: ${env.JOB_NAME} # ${env.BUILD_NUMBER}", to: "david.navarro.ext@proximus.com"
        }
       }
    }
} catch (e){
	currentBuild.result = "FAILED"
    mail body: "Please go to ${env.BUILD_URL}console.", from: "architecture.jenkins@belgacom.be", subject: "Build failed in Jenkins: ${env.JOB_NAME} # ${env.BUILD_NUMBER}", to: "david.navarro.ext@proximus.com"
    throw e
}

