Subnets
Visão Geral

As Subnets da EDN Cloud Platform representam a segmentação da VPC em camadas públicas e privadas, garantindo isolamento, alta disponibilidade e separação de responsabilidades.

A arquitetura é distribuída em duas Availability Zones e segue um modelo padrão de produção AWS.

VPC
10.0.0.0/16
Internet Gateway

A VPC utiliza o Internet Gateway:

igw_prod

O IGW é associado às subnets públicas e permite comunicação com a Internet para recursos de entrada controlada.

Subnets
AZ	Tipo	CIDR	Nome da Subnet	Função
A	Public	10.0.1.0/24	snet_prod_public_a	ALB / Internet Gateway
B	Public	10.0.2.0/24	snet_prod_public_b	ALB / Internet Gateway
A	Private Application	10.0.10.0/24	snet_prod_app_private_a	EC2 / Auto Scaling
B	Private Application	10.0.11.0/24	snet_prod_app_private_b	EC2 / Auto Scaling
A	Private Database	10.0.20.0/24	snet_prod_bd_private_a	RDS PostgreSQL
B	Private Database	10.0.21.0/24	snet_prod_bd_private_b	RDS PostgreSQL
Camadas da Arquitetura
Public Subnets

Responsáveis pela entrada da aplicação:

Application Load Balancer (ALB)
Acesso à Internet via igw_prod

Apenas recursos de entrada controlada são expostos.

Private Application Subnets

Camada de aplicação:

Amazon EC2 (Auto Scaling Group)
Docker Runtime
AWS Systems Manager Agent

Sem IP público e sem acesso direto à Internet (varia por estratégia).

Private Database Subnets

Camada de dados:

Amazon RDS PostgreSQL (Multi-AZ)

Totalmente isolado, acessível apenas pela camada de aplicação.

Estratégia Low Cost

Na arquitetura Low Cost, as subnets privadas não utilizam NAT Gateway.

O acesso a serviços AWS ocorre via VPC Endpoints, mantendo o tráfego dentro da rede da AWS.

Interface Endpoints
SSM
SSMMessages
EC2Messages
ECR API
ECR DKR
Gateway Endpoint
Amazon S3
Estratégia Maior Investimento

Na arquitetura de maior investimento:

Subnets privadas utilizam NAT Gateway
Acesso direto à Internet para instâncias EC2
Não utiliza VPC Endpoints
Maior flexibilidade operacional
Maior custo
Resumo Arquitetural

A arquitetura de subnets da EDN Cloud Platform é baseada em três camadas:

Public Subnets: entrada via ALB e Internet Gateway (igw_prod)
Private Application Subnets: execução da aplicação (EC2 + ASG)
Private Database Subnets: persistência (RDS PostgreSQL)

A diferença entre as estratégias está no modelo de conectividade:

Low Cost: VPC Endpoints (sem NAT Gateway)
Maior Investimento: NAT Gateway (com acesso à Internet)