# Architecture

# Visão Geral

A arquitetura **Low Cost** foi projetada para fornecer um ambiente em nuvem seguro, altamente disponível e escalável, mantendo o menor custo operacional possível.

Toda a infraestrutura está implantada em uma **Amazon VPC** distribuída entre duas Availability Zones, utilizando sub-redes públicas e privadas para isolar cada camada da aplicação.

Como estratégia de otimização de custos, a solução adota duas importantes decisões arquiteturais:

* Utilização do **Cloudflare** como provedor de **DNS, CDN e WAF**, substituindo os serviços Amazon Route 53, Amazon CloudFront e AWS WAF.
* Utilização de **VPC Endpoints** para comunicação entre os recursos privados e os serviços gerenciados da AWS, eliminando a necessidade de utilização de um NAT Gateway.

Essas decisões reduzem significativamente o custo mensal da infraestrutura sem comprometer a segurança, disponibilidade e desempenho da solução.

---

# Diagrama da Arquitetura

```text
docs/diagrams/architecture-low-cost.png
```

---

# Camadas da Arquitetura

## Camada de Entrada (Edge Layer)

Todo o tráfego proveniente dos usuários passa inicialmente pela infraestrutura do **Cloudflare**, que atua como ponto de entrada da aplicação.

Fluxo da requisição:

```text
Usuário
    │
    ▼
Cloudflare
(DNS + CDN + WAF)
    │
    ▼
Application Load Balancer (HTTPS)
    │
    ▼
Amazon EC2
```

### Responsabilidades

### Cloudflare

* Resolução DNS.
* Distribuição de conteúdo através de CDN.
* Proteção da aplicação utilizando WAF.
* Mitigação de ataques DDoS.
* Gerenciamento de certificados SSL/TLS.
* Redução dos custos da infraestrutura AWS.

Ao utilizar o Cloudflare, a arquitetura elimina a necessidade de utilizar Amazon Route 53, Amazon CloudFront e AWS WAF, reduzindo significativamente o custo da solução.

### Application Load Balancer

* Recebe conexões HTTPS.
* Utiliza certificados gerenciados pelo AWS Certificate Manager.
* Distribui as requisições entre as instâncias EC2.
* Realiza verificações de integridade (Health Checks).

---

## Camada de Rede (Network Layer)

Toda a infraestrutura está hospedada em uma única **Amazon VPC**.

A rede está distribuída entre duas Availability Zones para aumentar a disponibilidade e a tolerância a falhas.

### Public Subnets

Responsáveis por hospedar:

* Application Load Balancer.

Características:

* Possuem acesso à Internet através do Internet Gateway.
* Recebem apenas o tráfego proveniente do Cloudflare.

---

### Private Application Subnets

Responsáveis por hospedar:

* Instâncias Amazon EC2.

Características:

* Não possuem acesso direto à Internet.
* Recebem tráfego apenas do Application Load Balancer.
* Acessam serviços AWS através de VPC Endpoints.

---

### Private Database Subnets

Responsáveis por hospedar:

* Amazon RDS PostgreSQL.

Características:

* Totalmente isoladas da Internet.
* Acessíveis apenas pelas instâncias da aplicação.

---

### Comunicação com Serviços AWS

Como estratégia de redução de custos, a arquitetura utiliza **VPC Endpoints** para comunicação privada entre as instâncias EC2 e os serviços gerenciados da AWS.

Entre os principais serviços acessados estão:

* Amazon ECR
* Amazon S3
* AWS Systems Manager
* AWS Secrets Manager
* Amazon CloudWatch

Essa abordagem elimina a necessidade de um **NAT Gateway**, reduzindo significativamente o custo mensal da infraestrutura.

Além da economia financeira, essa estratégia oferece:

* Comunicação privada pela rede da AWS.
* Redução da exposição à Internet.
* Maior segurança.
* Menor latência na comunicação.
* Simplificação das rotas da VPC.

---

# Camada de Computação

A aplicação é executada em instâncias Amazon EC2 distribuídas entre duas Availability Zones.

As instâncias são gerenciadas por um **Auto Scaling Group**, utilizando um **Launch Template** previamente configurado.

Essa configuração fornece:

* Recuperação automática de instâncias.
* Padronização da infraestrutura.
* Escalabilidade horizontal.
* Substituição automática de instâncias com falha.

---

# Camada de Banco de Dados

A persistência dos dados é realizada utilizando **Amazon RDS PostgreSQL** configurado em **Multi-AZ**.

Características:

* Banco de dados gerenciado.
* Alta disponibilidade.
* Failover automático.
* Comunicação permitida apenas pelas instâncias EC2.

---

# Camada de Armazenamento

## Amazon S3

Responsável pelo armazenamento de arquivos utilizados pela aplicação.

## Amazon Elastic Container Registry (ECR)

Responsável pelo armazenamento das imagens Docker utilizadas pelas instâncias EC2.

---

# Arquitetura de Deploy

O processo de entrega contínua da aplicação segue o fluxo abaixo:

```text
Desenvolvedor
      │
      ▼
GitHub (Push)
      │
      ▼
AWS CodeBuild
      │
      ├── docker build
      ├── docker tag
      └── docker push
              │
              ▼
         Amazon ECR
              │
              ▼
AWS Systems Manager
      (Run Command)
              │
              ├── docker compose pull
              └── docker compose up -d
              │
              ▼
Instâncias EC2 Atualizadas
              │
              ▼
Auto Scaling Group
(Instance Refresh quando necessário)
```

## Processo de Build

O **AWS CodeBuild** é responsável por construir e publicar a imagem Docker da aplicação.

Durante a execução do arquivo **buildspec.yml**, são realizadas as seguintes etapas:

1. Autenticação no Amazon ECR.
2. Build da imagem Docker.
3. Criação da tag da imagem.
4. Publicação da imagem no Amazon ECR.

Após a publicação da imagem, o **AWS Systems Manager (SSM Run Command)** executa remotamente os comandos:

```bash
docker compose pull
docker compose up -d
```

Esses comandos fazem o download da nova imagem armazenada no Amazon ECR e substituem o container atualmente em execução.

---

## Estratégias de Deploy

### Rolling Update

Atualiza as instâncias existentes.

Fluxo:

```text
GitHub
    │
    ▼
CodeBuild
    │
    ▼
Amazon ECR
    │
    ▼
SSM Run Command
    │
    ▼
docker compose pull
    │
    ▼
docker compose up -d
```

Vantagens:

* Deploy rápido.
* Baixa indisponibilidade.
* Menor custo operacional.

---

### Deploy Imutável (Immutable Deployment)

Quando alterações estruturais exigem a substituição das instâncias, o **Auto Scaling Group** pode executar um **Instance Refresh**.

Fluxo:

```text
GitHub
    │
    ▼
CodeBuild
    │
    ▼
Amazon ECR
    │
    ▼
Auto Scaling Group
    │
    ▼
Instance Refresh
    │
    ▼
Novas Instâncias EC2
    │
    ▼
User Data
    │
    ▼
docker compose pull
    │
    ▼
Aplicação Atualizada
```

Essa estratégia segue as boas práticas recomendadas pela AWS, garantindo maior consistência da infraestrutura.

---

# Monitoramento e Gerenciamento

A proposta **Low Cost** contempla apenas os serviços essenciais para gerenciamento da infraestrutura.

## AWS Systems Manager

Responsável por:

* Administração remota das instâncias EC2.
* Execução de comandos através do SSM Run Command.
* Eliminação da necessidade de acesso SSH.

## AWS Config

Responsável por:

* Inventário dos recursos.
* Auditoria das configurações.
* Registro de alterações na infraestrutura.

## Amazon SNS

Responsável pelo envio de notificações provenientes dos serviços integrados.

> **Observação:** Esta proposta não contempla recursos como CloudWatch Logs, CloudWatch Dashboards e CloudWatch Alarms. Esses serviços fazem parte da arquitetura avançada do projeto e foram removidos desta proposta para manter o foco na redução dos custos operacionais.

---

# Arquitetura de Segurança

A solução implementa múltiplas camadas de segurança.

## Segurança de Perímetro

Fornecida pelo Cloudflare:

* DNS.
* CDN.
* WAF.
* Proteção contra ataques DDoS.

## HTTPS

Os certificados TLS são gerenciados pelo **AWS Certificate Manager** e utilizados pelo Application Load Balancer.

## Gerenciamento de Identidade

* AWS IAM.
* Amazon Cognito.

## Gerenciamento de Credenciais

As credenciais sensíveis da aplicação são armazenadas no **AWS Secrets Manager**.

## Comunicação Interna

Os **Security Groups** controlam toda a comunicação entre os recursos.

### Application Load Balancer

Permite:

* HTTP (80).
* HTTPS (443).

### Amazon EC2

Permite:

* Tráfego proveniente do ALB.
* Comunicação com o banco de dados.

### Amazon RDS PostgreSQL

Permite conexões apenas na porta **5432** provenientes das instâncias EC2.

---

# Alta Disponibilidade

A arquitetura implementa mecanismos de alta disponibilidade utilizando:

* Duas Availability Zones.
* Application Load Balancer.
* Auto Scaling Group.
* Amazon RDS Multi-AZ.
* Recuperação automática de instâncias EC2.
* Health Checks realizados pelo Application Load Balancer.

---

# Decisões Arquiteturais

A proposta **Low Cost** foi desenvolvida buscando o equilíbrio entre custo, disponibilidade, segurança e simplicidade operacional.

As principais decisões arquiteturais são:

## Cloudflare como Plataforma de Entrada

O Cloudflare fornece DNS, CDN e WAF, substituindo Amazon Route 53, Amazon CloudFront e AWS WAF.

Essa decisão reduz significativamente o custo mensal da infraestrutura mantendo recursos essenciais de segurança e desempenho.

---

## VPC Endpoints em substituição ao NAT Gateway

As instâncias EC2 privadas acessam os serviços AWS utilizando **VPC Endpoints**, eliminando a necessidade de um NAT Gateway.

Benefícios:

* Redução significativa dos custos.
* Comunicação privada pela rede da AWS.
* Menor superfície de ataque.
* Maior segurança da infraestrutura.

---

## Aplicação Containerizada

A aplicação é executada em containers Docker hospedados em instâncias Amazon EC2.

Benefícios:

* Portabilidade.
* Padronização dos ambientes.
* Facilidade de implantação.
* Atualizações simplificadas.

---

## Pipeline de Entrega Contínua

O processo de deploy é automatizado utilizando:

* GitHub.
* AWS CodeBuild.
* Amazon ECR.
* AWS Systems Manager.

Essa abordagem reduz intervenções manuais e garante implantações consistentes.

---

## Estratégia Flexível de Deploy

A arquitetura suporta dois modelos de implantação:

* Rolling Update para atualizações rápidas.
* Deploy Imutável utilizando Instance Refresh do Auto Scaling Group quando necessário.

---

## Monitoramento Orientado a Baixo Custo

A proposta contempla apenas os serviços essenciais de gerenciamento.

Recursos avançados de observabilidade, como CloudWatch Logs, Dashboards e Alarms, foram reservados para a proposta de maior investimento.

---

# Resumo da Arquitetura

A arquitetura **Low Cost** foi desenvolvida para oferecer um ambiente seguro, disponível, escalável e economicamente viável.

Seus principais diferenciais são:

* Cloudflare como solução de DNS, CDN e WAF.
* HTTPS utilizando Application Load Balancer e AWS Certificate Manager.
* Amazon VPC segmentada entre sub-redes públicas e privadas.
* VPC Endpoints substituindo o NAT Gateway.
* Amazon EC2 gerenciado por Auto Scaling Group.
* Amazon RDS PostgreSQL Multi-AZ.
* Amazon ECR para armazenamento das imagens Docker.
* Pipeline de deploy automatizado com GitHub, AWS CodeBuild e AWS Systems Manager.
* Suporte às estratégias Rolling Update e Deploy Imutável.
* Foco na redução de custos sem comprometer disponibilidade e segurança.
