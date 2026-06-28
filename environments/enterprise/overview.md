# Overview

## Sobre o Projeto

A proposta **Maior Investimento** apresenta uma arquitetura em nuvem desenvolvida na Amazon Web Services (AWS) com foco em oferecer um ambiente altamente disponível, resiliente, seguro e preparado para cargas de trabalho corporativas.

A solução foi desenvolvida como parte do Trabalho de Conclusão de Curso (TCC), demonstrando a aplicação de boas práticas de Arquitetura Cloud, DevOps, Infraestrutura como Serviço (IaaS) e automação de infraestrutura, priorizando disponibilidade, escalabilidade, observabilidade e segurança em detrimento da redução de custos.

---

# Objetivos

Os principais objetivos desta arquitetura são:

* Disponibilizar uma aplicação web com alta disponibilidade entre múltiplas Availability Zones.
* Implementar uma arquitetura resiliente preparada para ambientes de produção.
* Automatizar o processo de deploy utilizando práticas modernas de CI/CD.
* Garantir escalabilidade horizontal através de Auto Scaling Group.
* Implementar múltiplas camadas de segurança utilizando serviços nativos da AWS.
* Centralizar monitoramento, auditoria e gerenciamento operacional.
* Demonstrar uma arquitetura corporativa baseada nas boas práticas da AWS Well-Architected Framework.

---

# Visão Geral da Solução

A aplicação é executada em instâncias Amazon EC2 distribuídas entre duas Availability Zones e protegidas por um Application Load Balancer.

O acesso público ocorre através do Amazon Route 53, Amazon CloudFront e AWS WAF, fornecendo gerenciamento de DNS, distribuição global de conteúdo, proteção contra ataques e redução da latência para os usuários.

A persistência dos dados é realizada utilizando Amazon RDS PostgreSQL configurado em Multi-AZ, garantindo alta disponibilidade para a camada de banco de dados.

A entrega contínua da aplicação é automatizada através do GitHub, AWS CodeBuild, Amazon ECR e AWS Systems Manager, utilizando estratégias de implantação que minimizam indisponibilidades durante as atualizações.

As instâncias privadas acessam a internet por meio de um NAT Gateway, permitindo atualizações do sistema operacional, instalação de dependências e comunicação segura com serviços externos quando necessário.

---

# Principais Características

## Disponibilidade

* Infraestrutura distribuída entre duas Availability Zones.
* Application Load Balancer.
* Auto Scaling Group.
* Amazon RDS PostgreSQL Multi-AZ.
* Alta disponibilidade na camada de aplicação e banco de dados.

---

## Escalabilidade

A camada de aplicação utiliza Auto Scaling Group baseado em Launch Templates, permitindo a substituição automática de instâncias e suportando estratégias futuras de escalabilidade horizontal conforme o aumento da demanda.

---

## Segurança

A arquitetura implementa múltiplas camadas de segurança utilizando:

* Amazon Route 53.
* Amazon CloudFront.
* AWS WAF.
* AWS Shield Standard.
* Amazon GuardDuty.
* AWS Certificate Manager.
* AWS IAM.
* Amazon Cognito.
* AWS Secrets Manager.
* AWS Systems Manager.
* Security Groups.

---

## Observabilidade

A arquitetura incorpora serviços de monitoramento e auditoria que permitem acompanhar o comportamento da infraestrutura e da aplicação em tempo real.

Os principais serviços utilizados são:

* Amazon CloudWatch.
* CloudWatch Logs.
* CloudWatch Dashboards.
* Amazon SNS.
* AWS CloudTrail.
* AWS Config.

---

## Automação

O processo de entrega da aplicação é automatizado através de uma pipeline composta por:

* GitHub.
* AWS CodeBuild.
* Amazon Elastic Container Registry (ECR).
* AWS Systems Manager (SSM Run Command).

A arquitetura suporta duas estratégias de implantação:

* Rolling Update.
* Deploy Imutável utilizando Instance Refresh do Auto Scaling Group.

---

# Estratégias Arquiteturais

Diferentemente da proposta Low Cost, esta arquitetura prioriza disponibilidade, segurança operacional e recursos gerenciados da AWS.

As principais decisões arquiteturais foram:

### Serviços de Borda Nativos da AWS

A camada de entrada da aplicação utiliza serviços totalmente gerenciados pela AWS:

* Amazon Route 53.
* Amazon CloudFront.
* AWS WAF.
* AWS Shield Standard.

Essa abordagem fornece gerenciamento centralizado do tráfego, proteção contra ataques, distribuição global de conteúdo e integração completa com os demais serviços da plataforma AWS.

---

### NAT Gateway para Conectividade das Instâncias Privadas

As instâncias EC2 permanecem isoladas em sub-redes privadas.

O acesso externo ocorre através de um NAT Gateway, permitindo:

* Atualizações do sistema operacional.
* Download de dependências.
* Comunicação com repositórios externos.
* Acesso seguro à internet sem exposição direta das instâncias.

Essa estratégia privilegia flexibilidade operacional e compatibilidade com aplicações corporativas.

---

### Observabilidade Completa

A arquitetura incorpora uma camada dedicada de monitoramento composta por CloudWatch, CloudTrail, AWS Config, SNS e Dashboards.

Esses serviços permitem monitorar métricas, registrar eventos, auditar alterações na infraestrutura e gerar alertas operacionais, aumentando a confiabilidade e facilitando a administração do ambiente.

---

# Fluxo Geral da Aplicação

```text
Usuário
    │
    ▼
Amazon Route 53
    │
    ▼
Amazon CloudFront
    │
    ▼
AWS WAF
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
Instance Refresh
(Auto Scaling Group)
      │
      ▼
Instâncias Amazon EC2
```

---

# Casos de Uso

Esta arquitetura é indicada para:

* Empresas de médio e grande porte.
* Aplicações críticas de negócio.
* Sistemas corporativos em produção.
* Ambientes com alta demanda de disponibilidade.
* Plataformas SaaS.
* Aplicações web de missão crítica.
* Organizações que necessitam de monitoramento, auditoria e segurança avançada.

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

A proposta **Maior Investimento** representa uma arquitetura corporativa desenvolvida na AWS utilizando serviços gerenciados para atender requisitos elevados de disponibilidade, escalabilidade, segurança, observabilidade e automação.

A utilização de serviços como Amazon CloudFront, AWS WAF, Amazon GuardDuty, CloudWatch, CloudTrail, AWS Config, Auto Scaling Group e Amazon RDS Multi-AZ proporciona uma infraestrutura resiliente, preparada para ambientes de produção e alinhada às boas práticas recomendadas pela AWS.

Em conjunto com a proposta **Low Cost**, esta arquitetura permite comparar diferentes estratégias de implementação, demonstrando como requisitos de negócio, orçamento e criticidade da aplicação influenciam diretamente nas decisões arquiteturais e na composição da infraestrutura em nuvem.
