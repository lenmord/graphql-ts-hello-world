#!/usr/bin/env groovy

@Library('jenkins-shared-library') _

pipeline {
  agent { label 'build' }
  options {
    disableConcurrentBuilds()
  }
  environment {
    VERSION = getSemver()
  }
  stages {

    stage('Checkout') {
      steps {
        checkoutWithEnv()
      }
    }

    stage('Skip?') {
      steps {
        abortIfGitTagExists env.VERSION
        abortIfNPMTagExists env.VERSION
      }
    }

    stage('Setup') {
      steps {
        dockerCompose 'build --pull'
      }
    }

    stage('Unit') {
      steps {
        sh "mkdir -p ${env.WORKSPACE}/coverage"
        dockerCompose "run --rm -v '${env.WORKSPACE}/coverage:/app/coverage:rw,z' graphql-ts-hello-world-test test"
        sh "sed -i -e 's/\\/app/${env.WORKSPACE.replace('/', '\\/')}/g' coverage/lcov.info"
      }
    }

    stage('SonarQube') {
      steps {
        sonarScanner env.VERSION
      }
    }

    stage('Publish Docker') {
      steps {
        dockerPublish "docker.appdirect.tools/graphql-ts-hello-world/graphql-ts-hello-world:${env.VERSION}"
        dockerPublish "docker.appdirect.tools/graphql-ts-hello-world/graphql-ts-hello-world-smoke:${env.VERSION}"
      }
    }

    stage('Publish NPM') {
      steps {
        withArtifactoryNPMCredentials {
          dockerCompose "run --rm -v '${env.WORKSPACE}/.npmrc:/app/.npmrc:ro' graphql-ts-hello-world publish --scope @appdirect --tag ${npmTag()}"
        }
      }
    }

    stage('Tag') {
      when { branch 'master' }
      steps {
        pushGitTag env.VERSION
      }
    }
  }
  post {
    always {
      dockerCompose 'down --volumes --remove-orphans'
      dockerCompose 'rm --force'
      slackBuildStatus '#uip-conductorbot', env.SLACK_USER
    }
  }
}
