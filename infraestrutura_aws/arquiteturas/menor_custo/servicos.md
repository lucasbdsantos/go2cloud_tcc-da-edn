# Serviços AWS

Este documento descreve os serviços AWS utilizados na arquitetura da proposta **Low-Cost** do projeto **EDN Go2Cloud**, bem como sua função dentro da solução.

---

## 1. Networking

### 1.1 Amazon VPC

Rede privada que isola toda a infraestrutura da aplicação.

**Função**

* Isolamento da infraestrutura.
* Controle de endereçamento IP.
* Segmentação entre ambientes públicos e privados.

### 1.2 Public Subnets

Sub-redes responsáveis por hospedar recursos acessíveis pela Internet.

**Utilização**

* Application Load Balancer (ALB).

### 1.3 Private Subnets

Sub-redes utilizadas para recursos internos da aplicação.

**Utilização**

* Instâncias EC2.
* Banco de dados RDS.

### 1.4 Route Tables

Responsáveis pelo roteamento do tráfego da VPC.

**Função**

* Comunicação interna da VPC.
* Encaminhamento para Internet Gateway quando necessário.

### 1.5 Internet Gateway (IGW)

Permite comunicação entre a VPC e a Internet.

**Função**

* Disponibilizar acesso externo ao Application Load Balancer.

### 1.6 VPC Endpoints

Permitem acesso privado aos serviços AWS sem utilização da Internet pública.

**Objetivo**

* Comunicação segura entre instâncias privadas e serviços AWS.

---
</br>

## 2. DNS, CDN e Segurança

### 2.1 Amazon Route 53

Serviço de DNS da aplicação.

**Função**

* Resolução do domínio.
* Direcionamento das requisições.

---
</br>

## 3. Balanceamento de Carga

### 3.1 Application Load Balancer (ALB)

Distribui o tráfego entre as instâncias da aplicação.

**Função**

* Balanceamento de carga.
* Alta disponibilidade.
* Encaminhamento HTTPS.

### 3.2 AWS Certificate Manager (ACM)

Gerenciamento de certificados TLS/SSL.

**Função**

* Criptografia HTTPS.
* Certificados utilizados pelo ALB.

---
</br>

## 4. Computação

### 4.1 Amazon EC2

Executa a aplicação.

**Função**

* Hospedagem dos containers Docker.
* Execução da aplicação web.

### 4.2 Auto Scaling Group (ASG)

Gerencia automaticamente as instâncias EC2.

**Função**

* Alta disponibilidade.
* Recuperação automática de falhas.
* Escalabilidade.

### 4.3 Launch Template

Modelo utilizado pelo Auto Scaling Group para criação das instâncias.

**Contém**

* AMI personalizada
* Tipo da instância
* Security Groups
* IAM Role
* User Data

---
</br>

## 5. Banco de Dados

### 5.1 Amazon RDS for PostgreSQL

Banco de dados relacional gerenciado.

**Configuração**

* PostgreSQL
* Multi-AZ

**Função**

* Persistência dos dados da aplicação.

---
</br>

## 6. Armazenamento

### 6.1 Amazon S3

Armazenamento de objetos.

**Função**

* Arquivos estáticos.
* Artefatos da aplicação.
* Documentação e backups quando necessário.

### 6.2 Amazon Elastic Container Registry (ECR)

Repositório de imagens Docker.

**Função**

* Armazenamento das imagens utilizadas pelas instâncias EC2.

---
</br>

## 7. CI/CD e Automação

### 7.1 GitHub

Repositório do código-fonte.

**Função**

* Versionamento.
* Controle de alterações.

### 7.2 AWS CodeBuild

Serviço de build da aplicação.

**Função**

* Construção da aplicação.
* Geração da imagem Docker.
* Publicação da imagem no Amazon ECR.

---
</br>

## 8. Monitoramento

### 8.1 Amazon CloudWatch

Monitoramento da infraestrutura.

**Função**

* Métricas.
* Logs.
* Alarmes.

### 8.2 Amazon SNS

Serviço de notificações.

**Função**

* Envio de alertas do ambiente.

---
</br>

## 9. Segurança

### 9.1 AWS Secrets Manager

Armazena credenciais e informações sensíveis.

**Função**

* Proteção de senhas.
* Gerenciamento de secrets da aplicação.

### 9.2 AWS IAM

Controle de identidade e acesso.

**Função**

* Usuários.
* Roles.
* Políticas de acesso.

### 9.3 AWS Config

Serviço de auditoria e conformidade.

**Função**

* Registro das configurações dos recursos AWS.
* Monitoramento de alterações de infraestrutura.