# Architecture

Este documento apresenta a arquitetura da **Proposta de Maior Investimento** do projeto **EDN Cloud Platform**, descrevendo sua estrutura, os componentes utilizados e as principais decisões arquiteturais adotadas.

A proposta foi projetada para atender aplicações que exigem alta disponibilidade, segurança, observabilidade e escalabilidade, utilizando serviços gerenciados da Amazon Web Services (AWS) e seguindo boas práticas recomendadas pelo AWS Well-Architected Framework.

---

# Visão Geral da Arquitetura

A arquitetura é composta por múltiplas camadas responsáveis por fornecer segurança, balanceamento de carga, processamento da aplicação, persistência dos dados, automação de deploy e monitoramento da infraestrutura.

Todos os recursos da aplicação são executados dentro de uma Amazon VPC, distribuídos entre duas Availability Zones para garantir alta disponibilidade e tolerância a falhas.

A camada de entrada utiliza serviços nativos da AWS, como Amazon Route 53, Amazon CloudFront, AWS WAF e AWS Shield Standard, oferecendo proteção contra ataques, distribuição global de conteúdo e gerenciamento do DNS.

A camada de aplicação é composta por instâncias Amazon EC2 gerenciadas por um Auto Scaling Group e distribuídas entre duas zonas de disponibilidade, recebendo o tráfego através de um Application Load Balancer.

Os dados são armazenados em um banco Amazon RDS PostgreSQL configurado em Multi-AZ, proporcionando redundância automática e maior disponibilidade.

---

# Arquitetura de Rede

Toda a infraestrutura está isolada em uma Amazon VPC utilizando o bloco CIDR **10.0.0.0/16**.

A rede foi segmentada em:

* Sub-redes públicas para os componentes expostos à Internet.
* Sub-redes privadas para a camada de aplicação.
* Sub-redes privadas dedicadas ao banco de dados.

Essa segmentação reduz a superfície de ataque e segue o princípio de isolamento entre camadas.

As instâncias EC2 permanecem totalmente privadas, sem endereço IP público, acessando a Internet apenas através do NAT Gateway quando necessário.

---

# Camada de Entrada

O acesso dos usuários ocorre através da seguinte sequência:

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
```

Cada serviço possui uma responsabilidade específica:

* **Amazon Route 53** realiza a resolução do domínio da aplicação.
* **Amazon CloudFront** distribui o conteúdo através da rede global da AWS, reduzindo latência.
* **AWS WAF** protege a aplicação contra ataques direcionados à camada HTTP.
* **AWS Shield Standard** fornece proteção automática contra ataques DDoS.
* **AWS Certificate Manager** disponibiliza certificados TLS utilizados pelo Application Load Balancer.

Essa abordagem concentra toda a entrada da aplicação em uma camada segura e altamente disponível.

---

# Camada de Aplicação

A aplicação é executada em instâncias Amazon EC2 distribuídas entre duas Availability Zones.

O tráfego é distribuído pelo Application Load Balancer, enquanto o Auto Scaling Group gerencia automaticamente a criação, substituição e recuperação das instâncias.

Cada instância é criada utilizando um Launch Template, contendo:

* AMI padronizada.
* Tipo da instância.
* Security Groups.
* IAM Role.
* User Data para configuração inicial.

Essa arquitetura permite aumentar a disponibilidade e simplificar futuras estratégias de escalabilidade horizontal.

---

# Banco de Dados

A persistência dos dados é realizada utilizando Amazon RDS for PostgreSQL.

O banco está configurado em **Multi-AZ**, permitindo replicação síncrona entre duas zonas de disponibilidade.

Essa configuração proporciona:

* Alta disponibilidade.
* Recuperação automática em caso de falha.
* Redução do tempo de indisponibilidade.

A comunicação entre a aplicação e o banco ocorre exclusivamente através de Security Groups, mantendo o banco inacessível pela Internet.

---

# Armazenamento

A arquitetura utiliza Amazon S3 como serviço de armazenamento de objetos.

O bucket pode ser utilizado para:

* Arquivos estáticos.
* Documentação da aplicação.
* Backups.
* Objetos enviados pelos usuários.

O armazenamento é totalmente desacoplado da camada de aplicação.

---

# Deploy e Automação

O processo de implantação segue uma estratégia baseada em containers Docker.

O fluxo ocorre conforme abaixo:

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
Auto Scaling Group
      │
      ▼
Amazon EC2
```

O AWS CodeBuild realiza o build da aplicação e gera uma imagem Docker publicada no Amazon Elastic Container Registry (ECR).

Após a publicação, o AWS Systems Manager executa comandos remotos nas instâncias EC2 para atualização da aplicação.

A arquitetura suporta estratégias de implantação como:

* Rolling Update.
* Deploy Imutável utilizando Instance Refresh do Auto Scaling Group.

Essas estratégias reduzem o tempo de indisponibilidade durante novas versões da aplicação.

---

# Monitoramento e Observabilidade

A arquitetura incorpora uma camada dedicada de monitoramento utilizando serviços nativos da AWS.

Os principais componentes são:

* Amazon CloudWatch.
* CloudWatch Logs.
* CloudWatch Dashboards.
* Amazon SNS.
* AWS CloudTrail.
* AWS Config.

Esses serviços permitem acompanhar métricas da infraestrutura, centralizar logs, gerar alertas operacionais e manter registros das alterações realizadas no ambiente.

---

# Segurança

A segurança da solução é implementada em múltiplas camadas.

Os principais mecanismos utilizados são:

* AWS WAF para proteção da aplicação.
* AWS Shield Standard para mitigação de ataques DDoS.
* Amazon GuardDuty para detecção inteligente de ameaças.
* AWS IAM para gerenciamento de identidades e permissões.
* AWS Secrets Manager para armazenamento seguro de credenciais.
* Amazon Cognito para autenticação dos usuários.
* Security Groups restringindo a comunicação entre os recursos.
* AWS Certificate Manager para criptografia das conexões HTTPS.

Essa abordagem segue o princípio de **Defesa em Profundidade (Defense in Depth)**, aplicando controles de segurança em diferentes níveis da arquitetura.

---

# Decisões Arquiteturais

As principais decisões adotadas nesta proposta foram:

### Utilização dos serviços de borda da AWS

A arquitetura utiliza Amazon Route 53, Amazon CloudFront e AWS WAF para fornecer gerenciamento centralizado do tráfego, distribuição global de conteúdo e proteção da aplicação.

---

### Alta Disponibilidade

Todos os componentes críticos foram distribuídos entre duas Availability Zones.

Essa estratégia reduz pontos únicos de falha e aumenta a resiliência da infraestrutura.

---

### Banco Multi-AZ

O Amazon RDS PostgreSQL foi configurado em Multi-AZ para garantir continuidade da operação em caso de indisponibilidade de uma zona.

---

### Automação de Deploy

O processo de atualização da aplicação foi automatizado utilizando GitHub, AWS CodeBuild, Amazon ECR e AWS Systems Manager, reduzindo atividades manuais e aumentando a confiabilidade das implantações.

---

### Observabilidade

A arquitetura incorpora serviços dedicados para monitoramento, auditoria e geração de alertas, permitindo maior controle operacional e facilitando a identificação de problemas.

---

# Resumo

A **Proposta de Maior Investimento** representa uma arquitetura corporativa desenvolvida para aplicações que exigem elevados níveis de disponibilidade, segurança e escalabilidade.

A utilização de serviços gerenciados da AWS, aliada à distribuição dos recursos entre múltiplas Availability Zones, permite construir uma infraestrutura resiliente, automatizada e preparada para ambientes de produção.

Em conjunto com a proposta **Low Cost**, esta arquitetura evidencia como diferentes requisitos de negócio e disponibilidade influenciam diretamente nas decisões arquiteturais e na composição da infraestrutura em nuvem, oferecendo uma visão comparativa entre uma solução otimizada para custos e outra voltada para ambientes corporativos de maior criticidade.
