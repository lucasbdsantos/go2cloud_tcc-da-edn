# Serviços AWS

Este documento descreve os serviços AWS utilizados na arquitetura da **Proposta de Maior Investimento** do projeto **EDN Cloud Platform**, bem como sua função dentro da solução.

---

## 1. Networking

### 1.1 Amazon VPC

Rede privada que isola toda a infraestrutura da aplicação.

**Função**

* Isolamento da infraestrutura.
* Controle do endereçamento IP.
* Segmentação entre sub-redes públicas e privadas.

---

### 1.2 Public Subnets

Sub-redes responsáveis por hospedar recursos acessíveis pela Internet.

**Utilização**

* Application Load Balancer (ALB).
* NAT Gateway.

---

### 1.3 Private Subnets

Sub-redes utilizadas para recursos internos da aplicação.

**Utilização**

* Instâncias Amazon EC2.
* Banco de dados Amazon RDS.

---

### 1.4 Route Tables

Responsáveis pelo roteamento do tráfego dentro da VPC.

**Função**

* Comunicação entre as sub-redes.
* Encaminhamento do tráfego para Internet Gateway e NAT Gateway.

---

### 1.5 Internet Gateway (IGW)

Permite a comunicação entre a VPC e a Internet.

**Função**

* Disponibilizar acesso público ao Application Load Balancer.
* Permitir comunicação dos recursos públicos com a Internet.

---

### 1.6 NAT Gateway

Serviço responsável por fornecer acesso à Internet para recursos localizados em sub-redes privadas.

**Função**

* Atualização das instâncias EC2.
* Download de dependências.
* Comunicação com serviços externos sem expor as instâncias diretamente à Internet.

---
</br>

## 2. DNS, CDN e Segurança de Borda

### 2.1 Amazon Route 53

Serviço de DNS da aplicação.

**Função**

* Resolução do domínio.
* Direcionamento das requisições para a aplicação.

---

### 2.2 Amazon CloudFront

Rede de distribuição de conteúdo (CDN).

**Função**

* Redução da latência.
* Cache de conteúdo.
* Distribuição global da aplicação.
* Integração com AWS WAF.

---

### 2.3 AWS WAF

Firewall para aplicações web.

**Função**

* Proteção contra ataques HTTP.
* Filtragem de tráfego malicioso.
* Aplicação de regras de segurança.

---

### 2.4 AWS Shield Standard

Serviço de proteção contra ataques distribuídos de negação de serviço (DDoS).

**Função**

* Proteção automática contra ataques DDoS.
* Segurança adicional para recursos públicos.

---
</br>

## 3. Balanceamento de Carga

### 3.1 Application Load Balancer (ALB)

Distribui o tráfego entre as instâncias da aplicação.

**Função**

* Balanceamento de carga.
* Alta disponibilidade.
* Encaminhamento HTTPS.
* Health Checks das instâncias EC2.

---

### 3.2 AWS Certificate Manager (ACM)

Gerenciamento de certificados TLS/SSL.

**Função**

* Criptografia HTTPS.
* Certificados utilizados pelo Application Load Balancer.

---
</br>

## 4. Computação

### 4.1 Amazon EC2

Executa a aplicação.

**Função**

* Hospedagem dos containers Docker.
* Execução da aplicação web.

---

### 4.2 Auto Scaling Group (ASG)

Gerencia automaticamente as instâncias EC2.

**Função**

* Alta disponibilidade.
* Recuperação automática de falhas.
* Escalabilidade horizontal.
* Substituição automática de instâncias durante o Instance Refresh.

---

### 4.3 Launch Template

Modelo utilizado pelo Auto Scaling Group para criação das instâncias.

**Contém**

* AMI.
* Tipo da instância.
* Security Groups.
* IAM Role.
* User Data.

---
</br>

## 5. Banco de Dados

### 5.1 Amazon RDS for PostgreSQL

Banco de dados relacional gerenciado.

**Configuração**

* PostgreSQL.
* Multi-AZ.

**Função**

* Persistência dos dados da aplicação.
* Alta disponibilidade da camada de banco de dados.

---
</br>

## 6. Armazenamento

### 6.1 Amazon S3

Armazenamento de objetos.

**Função**

* Arquivos estáticos.
* Backups.
* Documentação.
* Objetos utilizados pela aplicação.

---

### 6.2 Amazon Elastic Container Registry (ECR)

Repositório de imagens Docker.

**Função**

* Armazenamento das imagens Docker.
* Distribuição das imagens para as instâncias EC2.

---
</br>

## 7. CI/CD e Automação

### 7.1 GitHub

Repositório do código-fonte.

**Função**

* Versionamento.
* Controle de alterações.
* Integração com o pipeline de implantação.

---

### 7.2 AWS CodeBuild

Serviço de build da aplicação.

**Função**

* Construção da aplicação.
* Geração da imagem Docker.
* Publicação da imagem no Amazon ECR.

---

### 7.3 AWS Systems Manager (SSM)

Gerenciamento centralizado das instâncias EC2.

**Função**

* Administração remota.
* Gerenciamento das instâncias.
* Inventário.
* Automação operacional.

---

### 7.4 SSM Run Command

Recurso do Systems Manager utilizado para executar comandos remotamente.

**Função**

* Atualização da aplicação.
* Execução de scripts.
* Implantação de novas versões.
* Automação de tarefas administrativas.

---
</br>

## 8. Monitoramento e Observabilidade

### 8.1 Amazon CloudWatch

Serviço de monitoramento da infraestrutura.

**Função**

* Coleta de métricas.
* Monitoramento dos recursos AWS.
* Base para alarmes e dashboards.

---

### 8.2 CloudWatch Logs

Centralização dos logs da infraestrutura e da aplicação.

**Função**

* Coleta de logs.
* Consulta de eventos.
* Auxílio na identificação de falhas.

---

### 8.3 CloudWatch Dashboards

Painéis para visualização das métricas da infraestrutura.

**Função**

* Monitoramento operacional.
* Consolidação de indicadores do ambiente.

---

### 8.4 Amazon SNS

Serviço de notificações.

**Função**

* Envio de alertas operacionais.
* Notificações de eventos da infraestrutura.

---

### 8.5 AWS CloudTrail

Serviço de auditoria das ações realizadas na conta AWS.

**Função**

* Registro das chamadas de API.
* Auditoria das alterações na infraestrutura.
* Rastreabilidade das operações.

---

### 8.6 AWS Config

Serviço de auditoria e conformidade.

**Função**

* Registro das configurações dos recursos AWS.
* Monitoramento de alterações da infraestrutura.
* Verificação de conformidade.

---
</br>

## 9. Segurança

### 9.1 AWS IAM

Serviço de gerenciamento de identidade e acesso.

**Função**

* Usuários.
* Grupos.
* Roles.
* Políticas de acesso.

---

### 9.2 AWS Secrets Manager

Armazena credenciais e informações sensíveis.

**Função**

* Proteção de senhas.
* Armazenamento de credenciais.
* Gerenciamento de secrets da aplicação.

---

### 9.3 Amazon Cognito

Serviço de autenticação de usuários.

**Função**

* Gerenciamento de identidade.
* Autenticação.
* Autorização da aplicação.

---

### 9.4 Amazon GuardDuty

Serviço de detecção inteligente de ameaças.

**Função**

* Monitoramento contínuo da conta AWS.
* Identificação de atividades suspeitas.
* Geração de alertas de segurança.

---
</br>

### Resumo

A arquitetura da **Proposta de Maior Investimento** utiliza um conjunto completo de serviços gerenciados da AWS para fornecer uma infraestrutura moderna, segura, resiliente e altamente disponível.

Além dos serviços essenciais presentes na proposta de baixo custo, esta arquitetura incorpora recursos avançados de segurança, monitoramento, auditoria e observabilidade, tornando-a adequada para aplicações corporativas executadas em ambientes de produção que exigem maior confiabilidade e facilidade de gerenciamento.