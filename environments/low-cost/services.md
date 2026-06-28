# AWS Services

Este documento descreve os serviços AWS utilizados na arquitetura da **Proposta de Baixo Custo** do projeto **EDN Cloud Platform**, bem como sua função dentro da solução.

---

# Networking

## Amazon VPC

Rede privada que isola toda a infraestrutura da aplicação.

**Função**

* Isolamento da infraestrutura.
* Controle de endereçamento IP.
* Segmentação entre ambientes públicos e privados.

---

## Public Subnets

Sub-redes responsáveis por hospedar recursos acessíveis pela Internet.

**Utilização**

* Application Load Balancer (ALB).

---

## Private Subnets

Sub-redes utilizadas para recursos internos da aplicação.

**Utilização**

* Instâncias EC2.
* Banco de dados RDS.

---

## Route Tables

Responsáveis pelo roteamento do tráfego da VPC.

**Função**

* Comunicação interna da VPC.
* Encaminhamento para Internet Gateway quando necessário.

---

## Internet Gateway (IGW)

Permite comunicação entre a VPC e a Internet.

**Função**

* Disponibilizar acesso externo ao Application Load Balancer.

---

## VPC Endpoints

Permitem acesso privado aos serviços AWS sem utilização da Internet pública.

**Objetivo**

* Comunicação segura entre instâncias privadas e serviços AWS.

---

# DNS, CDN e Segurança

## Amazon Route 53

Serviço de DNS da aplicação.

**Função**

* Resolução do domínio.
* Direcionamento das requisições.

---

## Amazon CloudFront

Rede de distribuição de conteúdo (CDN).

**Função**

* Redução da latência.
* Cache de conteúdo.
* Integração com AWS WAF.

---

## AWS WAF

Firewall para aplicações web.

**Função**

* Proteção contra ataques HTTP.
* Filtragem de tráfego.

---

# Balanceamento de Carga

## Application Load Balancer (ALB)

Distribui o tráfego entre as instâncias da aplicação.

**Função**

* Balanceamento de carga.
* Alta disponibilidade.
* Encaminhamento HTTPS.

---

## AWS Certificate Manager (ACM)

Gerenciamento de certificados TLS/SSL.

**Função**

* Criptografia HTTPS.
* Certificados utilizados pelo ALB.

---

# Computação

## Amazon EC2

Executa a aplicação.

**Função**

* Hospedagem dos containers Docker.
* Execução da aplicação web.

---

## Auto Scaling Group (ASG)

Gerencia automaticamente as instâncias EC2.

**Função**

* Alta disponibilidade.
* Recuperação automática de falhas.
* Escalabilidade.

---

## Launch Template

Modelo utilizado pelo Auto Scaling Group para criação das instâncias.

**Contém**

* AMI
* Tipo da instância
* Security Groups
* IAM Role
* User Data

---

# Banco de Dados

## Amazon RDS for PostgreSQL

Banco de dados relacional gerenciado.

**Configuração**

* PostgreSQL
* Multi-AZ

**Função**

* Persistência dos dados da aplicação.

---

# Armazenamento

## Amazon S3

Armazenamento de objetos.

**Função**

* Arquivos estáticos.
* Artefatos da aplicação.
* Documentação e backups quando necessário.

---

## Amazon Elastic Container Registry (ECR)

Repositório de imagens Docker.

**Função**

* Armazenamento das imagens utilizadas pelas instâncias EC2.

---

# CI/CD e Automação

## GitHub

Repositório do código-fonte.

**Função**

* Versionamento.
* Controle de alterações.

---

## AWS CodeBuild

Serviço de build da aplicação.

**Função**

* Construção da aplicação.
* Geração da imagem Docker.
* Publicação da imagem no Amazon ECR.

---

## AWS Systems Manager (SSM)

Gerenciamento centralizado das instâncias EC2.

**Função**

* Administração remota.
* Execução de comandos.
* Inventário.

---

## SSM Run Command

Recurso do Systems Manager utilizado para executar comandos remotamente.

**Função**

* Atualização da aplicação.
* Execução de scripts.
* Automação operacional.

---

# Monitoramento

## Amazon CloudWatch

Monitoramento da infraestrutura.

**Função**

* Métricas.
* Logs.
* Alarmes.

---

## Amazon SNS

Serviço de notificações.

**Função**

* Envio de alertas do ambiente.

---

# Segurança

## AWS Secrets Manager

Armazena credenciais e informações sensíveis.

**Função**

* Proteção de senhas.
* Gerenciamento de secrets da aplicação.

---

## AWS IAM

Controle de identidade e acesso.

**Função**

* Usuários.
* Roles.
* Políticas de acesso.

---

## Amazon Cognito

Serviço de autenticação de usuários.

**Função**

* Gerenciamento de identidade.
* Autenticação e autorização da aplicação.

---

## AWS Config

Serviço de auditoria e conformidade.

**Função**

* Registro das configurações dos recursos AWS.
* Monitoramento de alterações de infraestrutura.
