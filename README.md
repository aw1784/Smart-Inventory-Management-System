# Smart Inventory Management System

## DevOps Automation and Deployment Project 

---

## Lecturer & Supervisor

**Eng. Ahmed Gamil**  
*DevOps Track Instructor*

---

## Team Members

| Name | Role | Primary Responsibilities |
|------|------|-------------------------|
| **Ahmed Walid Hassan Abdelnaby** | DevOps Lead / Project Manager | Overall project coordination, architecture decisions, CI/CD strategy, team leadership |
| **Ahmed Yasser AbdEl-Hamid** | Containerization & Orchestration Lead | Docker containerization, Kubernetes deployment, pod management, service mesh, container registry |
| **Galal Elden Osama Sardina** | Infrastructure as Code (IaC) Engineer | Terraform scripts for AWS provisioning, infrastructure management, VPC configuration, resource optimization |
| **SaifEldin Salah Mohamed Othman** | Configuration Management & Automation | Ansible playbooks, server configuration, environment setup automation, package management |
| **Moataz Mohammed Khaled** | Monitoring & Observability Engineer | Prometheus metrics, Grafana dashboards, logging (ELK/EFK), alerting rules, system health tracking |
| **Mustafa Elsayed Atta** | Application Development & Integration | Microservices development, API creation, database setup, application deployment, service integration |

---

## Problem Addressed

Businesses often have inefficient inventory tracking, leading to:

* **Stock-outs**: Running out of critical items
* **Overstocking**: Excess inventory tying up capital
* **Manual tracking**: Time-consuming and error-prone processes
* **Lack of visibility**: Delayed detection of stock issues
* **System downtime**: Inability to scale during peak demand
* **Poor forecasting**: Difficulty predicting demand and managing supply

These challenges directly impact operational efficiency, customer satisfaction, and profitability.

---

## Description

This project builds a **smart inventory management system** using modern DevOps practices. The focus is on creating a **production-ready, scalable platform** that automatically tracks inventory, generates alerts for low stock, and provides real-time dashboards for managers.

The goal is not to build complex business logic, but to create a **production-ready DevOps environment** that runs the system reliably using modern tools such as Docker, Kubernetes, Jenkins, Prometheus, Terraform, and Ansible.

The application is built as a MERN web app with a Node.js/Express API backend, MongoDB persistence, and a React dashboard frontend. The system tracks inventory in real-time, provides alerts for low stock levels, and offers a web dashboard for monitoring. All services are containerized, deployed on Kubernetes, automatically updated through CI/CD pipelines, and monitored in real-time.

---

## Project Overview

This project demonstrates how DevOps practices can be applied to deploy, scale, automate, and monitor an inventory management system using modern DevOps tools.

The focus is on building a **scalable, automated, and monitored platform** using industry-standard DevOps tools and practices.

---

## System Components (Microservices)

1. **Inventory Tracking Service**

   * Manage product quantities in real-time
   * REST API for CRUD operations
   * Database integration for persistence
   * Track stock levels across warehouses

2. **Alert Service**

   * Monitor inventory levels continuously
   * Trigger alerts when stock falls below threshold
   * Send notifications (email, webhook, dashboard)
   * Maintain alert history for auditing

3. **Web Dashboard**

   * Display inventory status in real-time
   * Show alerts and notifications
   * Generate reports and analytics
   * Provide manager interface for decision-making

4. **Database Service**

   * Store inventory records in MongoDB
   * Maintain alert history
   * Support backup and recovery mechanisms

---

## DevOps Objectives

This project applies DevOps concepts through:

* **Docker** - Containerization of all microservices
* **Kubernetes** - Orchestration and scaling of containers
* **Jenkins** - CI/CD automation for build, test, and deploy
* **Prometheus & Grafana** - Real-time monitoring and visualization
* **Nginx** - Reverse proxy and load balancing
* **Terraform** - Infrastructure as Code for AWS resources
* **Ansible** - Automated server configuration and setup
* **Git** - Version control and collaboration

---

## Technology Stack

| Category | Tools |
|----------|-------|
| **Containerization** | Docker, Docker Compose |
| **Orchestration** | Kubernetes (Minikube for dev, EKS for prod) |
| **CI/CD** | Jenkins, GitHub Actions |
| **Monitoring** | Prometheus, Grafana, Loki |
| **Reverse Proxy** | Nginx |
| **Infrastructure as Code** | Terraform |
| **Configuration Management** | Ansible |
| **Cloud Platform** | AWS (EC2, S3, VPC) |
| **Version Control** | Git & GitHub |
| **Container Registry** | Docker Hub or AWS ECR |
| **Application Framework** | MERN stack: Node.js, Express, React, MongoDB |
| **Database** | MongoDB |
| **Frontend** | React |

---

## CI/CD Workflow

1. Developer pushes code to GitHub repository
2. GitHub webhook triggers Jenkins pipeline automatically
3. Jenkins checks out code and runs tests
4. Docker images are built from Dockerfiles
5. Images are tagged and pushed to Docker registry
6. Kubernetes pulls images and performs rolling updates
7. Monitoring tools track system health and performance
8. Alerts notify team of any issues

---

## Infrastructure Provisioning (Terraform)

Terraform is used to provision and manage:

* **VPC** - Virtual Private Cloud with public/private subnets
* **EC2 Instances** - Master and worker nodes for Kubernetes cluster
* **Security Groups** - Network access control lists
* **S3 Buckets** - Storage for backups, logs, and artifacts
* **RDS** (Optional) - Managed database service
* **IAM Roles** - Access control and permissions

---

## Server Configuration (Ansible)

Ansible automatically installs and configures:

* **Docker** - Container runtime environment
* **Kubernetes** - Container orchestration platform
* **Jenkins** - CI/CD automation server
* **Nginx** - Web server and reverse proxy
* **Monitoring Stack** - Prometheus, Grafana, and logging
* **Security Hardening** - Firewall rules and OS-level security

---

## Monitoring and Alerting

Prometheus and Grafana monitor:

* **Infrastructure Metrics** - CPU, memory, disk usage, network I/O
* **Container Health** - Container status, restarts, resource utilization
* **Service Uptime** - Availability and response times
* **Business Metrics** - Low stock alerts, inventory turnover rate
* **Application Performance** - Request latency, error rates, throughput

---

## Project Deliverables

### Phase 1: Application Development
- [ ] Inventory tracking microservice (REST API)
- [ ] Alert service for stock monitoring
- [ ] Web dashboard (frontend + backend)
- [ ] Database schema and migrations
- [ ] Unit and integration tests

### Phase 2: Containerization
- [ ] Dockerfile for inventory service
- [ ] Dockerfile for alert service
- [ ] Dockerfile for dashboard
- [ ] Docker Compose for local development
- [ ] Multi-stage builds for optimization

### Phase 3: Kubernetes Orchestration
- [ ] Kubernetes deployment manifests
- [ ] Services for service discovery
- [ ] ConfigMaps for configuration
- [ ] Secrets for sensitive data
- [ ] PersistentVolumes for database
- [ ] Resource limits and requests

### Phase 4: CI/CD Pipeline
- [ ] Jenkinsfile with multi-stage pipeline
- [ ] Automated testing in pipeline
- [ ] Docker image build and push
- [ ] Kubernetes deployment automation
- [ ] Health checks and verification

### Phase 5: Monitoring & Observability
- [ ] Prometheus scrape configuration
- [ ] Custom application metrics
- [ ] Grafana dashboards (infrastructure, container, application)
- [ ] Logging stack (ELK or EFK)
- [ ] Alerting rules for critical conditions

### Phase 6: Infrastructure as Code
- [ ] Terraform modules for AWS resources
- [ ] VPC and networking configuration
- [ ] EC2 instance provisioning
- [ ] Security groups and network ACLs
- [ ] S3 bucket configuration
- [ ] State management and outputs

### Phase 7: Configuration Management
- [ ] Ansible inventory file
- [ ] Playbooks for Docker installation
- [ ] Kubernetes cluster initialization
- [ ] Jenkins agent configuration
- [ ] Monitoring stack deployment
- [ ] Nginx reverse proxy setup

### Phase 8: Documentation & Deployment
- [ ] Project architecture diagram
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Deployment guide
- [ ] DevOps workflow documentation
- [ ] Troubleshooting guide
- [ ] Runbooks for operations

---

## Implementation Plan

### Phase 1 — Application Setup (Week 1-2)

* Define API specifications (Swagger)
* Build inventory tracking service and alert service using Node.js/Express
* Build a React-based web dashboard for managers
* Create and initialize MongoDB database and collections
* Build the MERN app end-to-end for inventory, alerts, and dashboard functions
* Write unit tests for all services

**Deliverable**: Working MERN application ready for containerization

### Phase 2 — Containerization (Week 2-3)

* Create Dockerfile for each microservice
* Optimize Docker images (multi-stage builds)
* Set up Docker Compose for local development
* Test container communication and networking
* Push images to Docker registry
* Document Docker setup and usage

**Deliverable**: All services containerized and tested locally

### Phase 3 — Kubernetes Orchestration (Week 3-4)

* Write Kubernetes deployment manifests (YAML)
* Configure services and service discovery
* Set up ConfigMaps and Secrets
* Configure PersistentVolumes for database
* Deploy on Minikube for local testing
* Implement rolling updates and rollback strategy
* Test pod scaling and auto-scaling

**Deliverable**: Services running on Kubernetes with proper orchestration

### Phase 4 — CI/CD Pipeline (Week 4-5)

* Set up Jenkins master and slave architecture
* Create comprehensive Jenkinsfile with stages
* Configure Docker registry integration
* Automate Docker image building and pushing
* Automate Kubernetes deployments
* Add automated testing to pipeline
* Set up notifications for pipeline events

**Deliverable**: Fully automated CI/CD pipeline from code to production

### Phase 5 — Monitoring & Observability (Week 5-6)

* Deploy Prometheus on Kubernetes
* Configure metric scraping for all services
* Create custom application metrics
* Deploy Grafana and design dashboards
* Set up alerting rules and thresholds
* Implement centralized logging (ELK/EFK)
* Test monitoring and alerting flow

**Deliverable**: Complete monitoring solution with dashboards and alerts

### Phase 6 — Infrastructure as Code (Week 6-7)

* Design AWS infrastructure architecture
* Write Terraform configurations for VPC
* Configure EC2 instances for Kubernetes
* Set up security groups and network rules
* Create S3 buckets for storage
* Implement state management
* Test infrastructure provisioning

**Deliverable**: Infrastructure fully defined as code, deployable with one command

### Phase 7 — Configuration Automation (Week 7-8)

* Create Ansible inventory and group variables
* Write playbooks for Docker installation
* Automate Kubernetes cluster initialization
* Configure monitoring stack deployment
* Set up Nginx reverse proxy
* Implement security hardening
* Test automation from scratch

**Deliverable**: Complete server setup automated with Ansible

### Phase 8 — Production Deployment (Week 8)

* Deploy to AWS using Terraform + Ansible
* Run end-to-end integration tests
* Perform load and stress testing
* Document deployment process
* Create operational runbooks
* Prepare team for production operations
* Final review and lessons learned

**Deliverable**: Production-ready system with complete documentation

---

## Expected Outcomes

* ✅ **Fully automated deployment pipeline** - Zero-touch deployments from code to production
* ✅ **Scalable microservices architecture** - Horizontal scaling based on demand
* ✅ **Real-time monitoring and alerting** - Immediate visibility into system health
* ✅ **Infrastructure managed as code** - Reproducible, version-controlled infrastructure
* ✅ **Professional DevOps workflow** - Industry-standard practices and tools
* ✅ **High availability** - Rolling updates with zero downtime
* ✅ **Security best practices** - RBAC, Secrets management, network policies
* ✅ **Complete documentation** - Easy to understand and maintain

---

## Conclusion

This project demonstrates how DevOps practices can transform an inventory management system into a scalable, reliable, and production-ready platform using automation, monitoring, and cloud infrastructure.

By completing this project, you will gain hands-on experience with industry-standard DevOps tools and practices used in modern software companies.

---

## Project Resources

### GitHub Repository
**Main Repository**: https://github.com/aw1784/Smart-Inventory-Management-System
### Google Drive
**Project Documentation & Resources**:https://drive.google.com/drive/folders/1PHFi5wbbck9Kyct4oKhaITF6vMPVfs0k?usp=sharing

---
