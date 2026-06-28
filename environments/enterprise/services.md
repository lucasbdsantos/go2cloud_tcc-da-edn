# AWS Services

Este documento descreve os serviços AWS utilizados na arquitetura da **Proposta de Maior Investimento** do projeto **EDN Cloud Platform**, bem como sua função dentro da solução.

---

# Networking

## Amazon VPC

Rede privada que isola toda a infraestrutura da aplicação.

**Função**

* Isolamento da infraestrutura.
* Controle do endereçamento IP.
* Segmentação entre sub-redes públicas e privadas.

---

## Public Subnets

Sub-redes responsáveis por hospedar recursos acessíveis pela Internet.

**Utilização**

* Application Load Balancer (ALB).
* NAT Gateway.

---

## Private Subnets

Sub-redes utilizadas para recursos internos da aplicação.

**Utilização**

* Instâncias Amazon EC2.
* Banco de dados Amazon RDS.

---

## Route Tables

Responsáveis pelo roteamento do tráfego dentro da VPC.

**Função**

* Comunicação entre as sub-redes.
* Encaminhamento do tráfego para Internet Gateway e NAT Gateway.

---

## Internet Gateway (IGW)

Permite a comunicação entre a VPC e a Internet.

**Função**

* Disponibilizar acesso público ao Application Load Balancer.
* Permitir comunicação dos recursos públicos com a Internet.

---

## NAT Gateway

Serviço responsável por fornecer acesso à Internet para recursos localizados em sub-redes privadas.

**Função**

* Atualização das instâncias EC2.
* Download de dependências.
* Comunicação com serviços externos sem expor as instâncias diretamente à Internet.

---

# DNS, CDN e Segurança de Borda

## Amazon Route 53

Serviço de DNS da aplicação.

**Função**

* Resolução do domínio.
* Direcionamento das requisições para a aplicação.

---

## Amazon CloudFront

Rede de distribuição de conteúdo (CDN).

**Função**

* Redução da latência.
* Cache de conteúdo.
* Distribuição global da aplicação.
* Integração com AWS WAF.

---

## AWS WAF

Firewall para aplicações web.

**Função**

* Proteção contra ataques HTTP.
* Filtragem de tráfego malicioso.
* Aplicação de regras de segurança.

---

## AWS Shield Standard

Serviço de proteção contra ataques distribuídos de negação de serviço (DDoS).

**Função**

* Proteção automática contra ataques DDoS.
* Segurança adicional para recursos públicos.

---

# Balanceamento de Carga

## Application Load Balancer (ALB)

Distribui o tráfego entre as instâncias da aplicação.

**Função**

* Balanceamento de carga.
* Alta disponibilidade.
* Encaminhamento HTTPS.
* Health Checks das instâncias EC2.

---

## AWS Certificate Manager (ACM)

Gerenciamento de certificados TLS/SSL.

**Função**

* Criptografia HTTPS.
* Certificados utilizados pelo Application Load Balancer.

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
* Escalabilidade horizontal.
* Substituição automática de instâncias durante o Instance Refresh.

---

## Launch Template

Modelo utilizado pelo Auto Scaling Group para criação das instâncias.

**Contém**

* AMI.
* Tipo da instância.
* Security Groups.
* IAM Role.
* User Data.

---

# Banco de Dados

## Amazon RDS for PostgreSQL

Banco de dados relacional gerenciado.

**Configuração**

* PostgreSQL.
* Multi-AZ.

**Função**

* Persistência dos dados da aplicação.
* Alta disponibilidade da camada de banco de dados.

---

# Armazenamento

## Amazon S3

Armazenamento de objetos.

**Função**

* Arquivos estáticos.
* Backups.
* Documentação.
* Objetos utilizados pela aplicação.

---

## Amazon Elastic Container Registry (ECR)

Repositório de imagens Docker.

**Função**

* Armazenamento das imagens Docker.
* Distribuição das imagens para as instâncias EC2.

---

# CI/CD e Automação

## GitHub

Repositório do código-fonte.

**Função**

* Versionamento.
* Controle de alterações.
* Integração com o pipeline de implantação.

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
* Gerenciamento das instâncias.
* Inventário.
* Automação operacional.

---

## SSM Run Command

Recurso do Systems Manager utilizado para executar comandos remotamente.

**Função**

* Atualização da aplicação.
* Execução de scripts.
* Implantação de novas versões.
* Automação de tarefas administrativas.

---

# Monitoramento e Observabilidade

## Amazon CloudWatch

Serviço de monitoramento da infraestrutura.

**Função**

* Coleta de métricas.
* Monitoramento dos recursos AWS.
* Base para alarmes e dashboards.

---

## CloudWatch Logs

Centralização dos logs da infraestrutura e da aplicação.

**Função**

* Coleta de logs.
* Consulta de eventos.
* Auxílio na identificação de falhas.

---

## CloudWatch Dashboards

Painéis para visualização das métricas da infraestrutura.

**Função**

* Monitoramento operacional.
* Consolidação de indicadores do ambiente.

---

## Amazon SNS

Serviço de notificações.

**Função**

* Envio de alertas operacionais.
* Notificações de eventos da infraestrutura.

---

## AWS CloudTrail

Serviço de auditoria das ações realizadas na conta AWS.

**Função**

* Registro das chamadas de API.
* Auditoria das alterações na infraestrutura.
* Rastreabilidade das operações.

---

## AWS Config

Serviço de auditoria e conformidade.

**Função**

* Registro das configurações dos recursos AWS.
* Monitoramento de alterações da infraestrutura.
* Verificação de conformidade.

---

# Segurança

## AWS IAM

Serviço de gerenciamento de identidade e acesso.

**Função**

* Usuários.
* Grupos.
* Roles.
* Políticas de acesso.

---

## AWS Secrets Manager

Armazena credenciais e informações sensíveis.

**Função**

* Proteção de senhas.
* Armazenamento de credenciais.
* Gerenciamento de secrets da aplicação.

---

## Amazon Cognito

Serviço de autenticação de usuários.

**Função**

* Gerenciamento de identidade.
* Autenticação.
* Autorização da aplicação.

---

## Amazon GuardDuty

Serviço de detecção inteligente de ameaças.

**Função**

* Monitoramento contínuo da conta AWS.
* Identificação de atividades suspeitas.
* Geração de alertas de segurança.

---

# Resumo

A arquitetura da **Proposta de Maior Investimento** utiliza um conjunto completo de serviços gerenciados da AWS para fornecer uma infraestrutura moderna, segura, resiliente e altamente disponível.

Além dos serviços essenciais presentes na proposta de baixo custo, esta arquitetura incorpora recursos avançados de segurança, monitoramento, auditoria e observabilidade, tornando-a adequada para aplicações corporativas executadas em ambientes de produção que exigem maior confiabilidade e facilidade de gerenciamento.
