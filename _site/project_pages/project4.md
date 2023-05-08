----
layout: project 
title: Project 4
----

# Implement CI/CD using GitHub Actions

## 5.1. Create a GitHub repository:

Create a GitHub repository and push your Flask application code (including the Dockerfile, requirements.txt, Kubernetes manifests, and any other necessary files) to the repository.

## 5.2 Clone the GitHub repository:

Navigate to the directory where you want to store the project and clone the GitHub repository:

```bash
cd /path/to/your/directory
git clone https://github.com/averagejoesec/news-aggregator-app.git
```

## 5.3 Add Flask application code:

Copy your Flask application code (including the Dockerfile, requirements.txt, Kubernetes manifests, and any other necessary files) into the `news-aggregator-app` directory.

## 5.4 Commit and push your changes:

Navigate to the `news-aggregator-app` directory, stage the changes, commit them, and push to the GitHub repository:

```bash
cd news-aggregator-app
git add .
git commit -m "Add Flask application code"
git push origin main
```



## 5.6 Create a GitHub Actions workflow file:

In the root directory of your repository, create a new directory `.github/workflows/` and a file named `ci-cd.yml` inside the workflows directory with the following content:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  build_and_push:
    runs-on: ubuntu-latest

    steps:
    - name: Check out repository
      uses: actions/checkout@v2

    - name: Log in to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1

    - name: Build and push Docker image
      uses: docker/build-push-action@v2
      with:
        context: .
        push: true
        tags: ${{ steps.login-ecr.outputs.registry }}/${{ secrets.ECR_REPOSITORY }}:${{ github.sha }}

  deploy:
    runs-on: ubuntu-latest
    needs: build_and_push

    steps:
    - name: Check out repository
      uses: actions/checkout@v2

    - name: Install and configure AWS CLI
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ secrets.AWS_REGION }}

    - name: Install and configure kubectl
      run: |
        VERSION=$(curl --silent https://storage.googleapis.com/kubernetes-release/release/stable.txt)
        curl https://storage.googleapis.com/kubernetes-release/release/$VERSION/bin/linux/amd64/kubectl \
          --progress-bar \
          --location \
          --remote-name
        chmod +x kubectl
        sudo mv kubectl /usr/local/bin/
        echo ${{ secrets.KUBECONFIG }} | base64 --decode > kubeconfig.yaml

    - name: Deploy to Amazon EKS
      run: |
        kubectl kustomize k8s/ | kubectl apply -f - --kubeconfig kubeconfig.yaml
```

This workflow file defines the steps for building and pushing the Docker image to Amazon ECR and deploying the application to your Amazon EKS cluster using kubectl.

## 5.7 Configure secrets:

In your GitHub repository, go to "Settings" > "Secrets" > "Actions" and add the following secrets:

- `AWS_ACCESS_KEY_ID`: Your AWS access key ID.
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key.
- `AWS_REGION`: Your AWS region (e.g., 'us-east-1').
- `ECR_REPOSITORY`: Your Amazon ECR repository name.
- `KUBECONFIG`: Your Kubernetes kubeconfig file content, base64-encoded.

![Secrets page](assets/images/secrets-page.png)

To encode your kubeconfig file, run the following command:

```bash
cat kubeconfig.yaml | base64
```

### Now you have a CI/CD pipeline set up using GitHub Actions. Whenever you push a new commit to your main branch, the pipeline will automatically build the Docker image, push it to ECR, and deploy the updated application to your Amazon EKS cluster.
