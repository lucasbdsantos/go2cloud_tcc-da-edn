# Overview

## Sobre o Projeto

A proposta **Low Cost** apresenta uma arquitetura em nuvem desenvolvida na Amazon Web Services (AWS) com foco em oferecer um ambiente seguro, escalável e altamente disponível, utilizando apenas os serviços essenciais para reduzir o custo operacional.

A solução foi desenvolvida como parte do Trabalho de Conclusão de Curso (TCC), demonstrando a aplicação de boas práticas de Arquitetura Cloud, DevOps e Infraestrutura como Serviço (IaaS), mantendo o equilíbrio entre desempenho, disponibilidade e otimização de custos.

---

# Objetivos

Os principais objetivos desta arquitetura são:

* Disponibilizar uma aplicação web em ambiente altamente disponível.
* Reduzir custos utilizando serviços essenciais da AWS.
* Implementar uma arquitetura escalável baseada em Auto Scaling.
* Automatizar o processo de deploy utilizando CI/CD.
* Isolar os recursos internos através de uma Amazon VPC.
* Aplicar boas práticas de segurança em múltiplas camadas.
* Demonstrar uma arquitetura viável para pequenas empresas e projetos de baixo orçamento.

---

# Visão Geral da Solução

A aplicação é executada em instâncias Amazon EC2 distribuídas entre duas Availability Zones e protegidas por um Application Load Balancer.

O acesso público ocorre através do **Cloudflare**, responsável pelos serviços de DNS, CDN e WAF, reduzindo custos ao substituir serviços equivalentes da AWS.

A persistência dos dados é realizada utilizando Amazon RDS PostgreSQL configurado em Multi-AZ.

A entrega contínua da aplicação é automatizada através do GitHub, AWS CodeBuild, Amazon ECR e AWS Systems Manager.

A comunicação entre as instâncias privadas e os serviços AWS ocorre através de **VPC Endpoints**, eliminando a necessidade de utilização de um NAT Gateway.

---

# Principais Características

## Disponibilidade

* Infraestrutura distribuída entre duas Availability Zones.
* Application Load Balancer.
* Auto Scaling Group.
* Amazon RDS PostgreSQL Multi-AZ.

---

## Escalabilidade

A camada de aplicação utiliza Auto Scaling Group para permitir a substituição automática de instâncias e facilitar futuras estratégias de escalabilidade horizontal.

---

## Segurança

A arquitetura implementa múltiplas camadas de segurança utilizando:

* Cloudflare (DNS, CDN e WAF).
* AWS Certificate Manager.
* AWS IAM.
* Amazon Cognito.
* AWS Secrets Manager.
* Security Groups.
* VPC Endpoints.

---

## Automação

O processo de entrega da aplicação é automatizado através de uma pipeline composta por:

* GitHub.
* AWS CodeBuild.
* Amazon Elastic Container Registry (ECR).
* AWS Systems Manager (SSM Run Command).

A arquitetura suporta duas estratégias de implantação:

* Rolling Update.
* Deploy Imutável utilizando Instance Refresh.

---

# Estratégias de Otimização de Custos

Um dos principais objetivos desta proposta é reduzir o custo mensal da infraestrutura sem comprometer a segurança e a disponibilidade.

As principais decisões adotadas foram:

### Cloudflare como Plataforma de Entrada

O Cloudflare substitui:

* Amazon Route 53.
* Amazon CloudFront.
* AWS WAF.

Além da redução de custos, essa abordagem fornece proteção da aplicação, distribuição de conteúdo e gerenciamento do DNS.

---

### VPC Endpoints em substituição ao NAT Gateway

As instâncias EC2 acessam os serviços AWS utilizando VPC Endpoints.

Essa estratégia elimina a necessidade de um NAT Gateway, reduzindo significativamente o custo operacional e mantendo toda a comunicação pela rede privada da AWS.

---

### Serviços Essenciais

A arquitetura contempla apenas os serviços necessários para operação da solução.

Recursos avançados de observabilidade, como CloudWatch Logs, CloudWatch Dashboards e CloudWatch Alarms, não fazem parte desta proposta, sendo reservados para a arquitetura de maior investimento.

---

# Fluxo Geral da Aplicação

```text
Usuário
    │
    ▼
Cloudflare
(DNS + CDN + WAF)
    │
    ▼
Application Load Balancer
    │
    ▼
Amazon EC2
(Auto Scaling Group)
    │
    ▼
Amazon RDS PostgreSQL
```

---

# Fluxo de Deploy

```text
Desenvolvedor
      │
      ▼
GitHub
      │
      ▼
AWS CodeBuild
      │
      ▼
Amazon ECR
      │
      ▼
AWS Systems Manager
      │
      ▼
Instâncias Amazon EC2
```

---

# Casos de Uso

Esta arquitetura é indicada para:

* Pequenas empresas.
* Startups.
* Aplicações institucionais.
* Sistemas corporativos de pequeno e médio porte.
* Ambientes de desenvolvimento e homologação.
* Projetos acadêmicos.
* Soluções que necessitam de alta disponibilidade com orçamento reduzido.

---

# Estrutura da Documentação

A documentação desta proposta está organizada da seguinte forma:

| Documento           | Descrição                                                 |
| ------------------- | --------------------------------------------------------- |
| **overview.md**     | Visão geral da arquitetura.                               |
| **architecture.md** | Arquitetura completa da solução e decisões arquiteturais. |
| **services.md**     | Descrição dos serviços AWS utilizados.                    |

---

# Resumo

A proposta **Low Cost** demonstra como é possível construir uma arquitetura moderna na AWS utilizando boas práticas de segurança, disponibilidade, automação e escalabilidade, mantendo o foco na redução dos custos operacionais.

As principais decisões arquiteturais — como a utilização do Cloudflare em substituição aos serviços de borda da AWS e o uso de VPC Endpoints no lugar do NAT Gateway — permitem reduzir significativamente o investimento mensal sem comprometer a qualidade da solução.

Essa arquitetura serve como base para pequenas empresas, startups e projetos acadêmicos que buscam uma infraestrutura profissional, segura e financeiramente viável.
