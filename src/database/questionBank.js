const questions = {
    cloud: [
      {
        question: "What is AWS Lambda's maximum execution time?",
        correct_answer: "15 minutes",
        incorrect_answers: ["5 minutes", "10 minutes", "30 minutes"],
        difficulty: "medium"
      },
      {
        question: "Which AWS service is used for container orchestration?",
        correct_answer: "ECS",
        incorrect_answers: ["EC2", "S3", "RDS"],
        difficulty: "easy"
      },
      {
        question: "What is the AWS service for managed Kubernetes?",
        correct_answer: "EKS",
        incorrect_answers: ["ECS", "ECR", "Fargate"],
        difficulty: "medium"
      }
    ],
    devops: [
      {
        question: "What is the purpose of a Dockerfile?",
        correct_answer: "To define container build instructions",
        incorrect_answers: [
          "To configure networks",
          "To manage databases",
          "To deploy applications"
        ],
        difficulty: "easy"
      },
      {
        question: "Which command is used to apply Kubernetes manifests?",
        correct_answer: "kubectl apply",
        incorrect_answers: ["kubectl create", "kubectl run", "kubectl start"],
        difficulty: "medium"
      },
      {
        question: "What tool is commonly used for Infrastructure as Code?",
        correct_answer: "Terraform",
        incorrect_answers: ["Docker", "Kubernetes", "Jenkins"],
        difficulty: "medium"
      }
    ],
    kubernetes: [
      {
        question: "What is a Pod in Kubernetes?",
        correct_answer: "Smallest deployable unit",
        incorrect_answers: [
          "Network plugin",
          "Storage volume",
          "Load balancer"
        ],
        difficulty: "easy"
      },
      {
        question: "Which component manages the worker nodes?",
        correct_answer: "kubelet",
        incorrect_answers: ["etcd", "kube-proxy", "scheduler"],
        difficulty: "medium"
      },
      {
        question: "What is the purpose of a Service in Kubernetes?",
        correct_answer: "Network abstraction for pods",
        incorrect_answers: [
          "Container runtime",
          "Storage management",
          "Pod scheduling"
        ],
        difficulty: "medium"
      }
    ],
    docker: [
      {
        question: "What command shows running containers?",
        correct_answer: "docker ps",
        incorrect_answers: ["docker list", "docker show", "docker running"],
        difficulty: "easy"
      },
      {
        question: "Which file is used to define multi-container applications?",
        correct_answer: "docker-compose.yml",
        incorrect_answers: ["Dockerfile", "container.yml", "docker.json"],
        difficulty: "medium"
      },
      {
        question: "What is Docker Hub?",
        correct_answer: "Container image registry",
        incorrect_answers: [
          "Container runtime",
          "Orchestration tool",
          "Monitoring system"
        ],
        difficulty: "easy"
      }
    ]
  };
  
  module.exports = { questions };