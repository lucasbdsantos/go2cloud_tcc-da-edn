# Subnets

### Visão Geral

As Subnets representam a segmentação da VPC em camadas públicas e privadas, garantindo isolamento, alta disponibilidade e separação de responsabilidades.

A arquitetura é distribuída em duas Availability Zones e segue um modelo padrão de produção AWS.

---

### VPC

A infraestrutura utiliza a seguinte faixa de endereçamento:

| Recurso | CIDR        |
| ------- | ----------- |
| VPC     | 10.0.0.0/16 |

---

### Internet Gateway

A VPC utiliza o Internet Gateway:

**igw_prod**

O Internet Gateway é associado às subnets públicas e permite a comunicação com a Internet para recursos de entrada controlada.

---

### Estrutura das Subnets

A infraestrutura é composta por seis subnets distribuídas em duas Availability Zones.

| AZ | Tipo                | CIDR         | Nome da Subnet          | Função                 |
| -- | ------------------- | ------------ | ----------------------- | ---------------------- |
| A  | Public              | 10.0.1.0/24  | snet_prod_public_a      | ALB / Internet Gateway |
| B  | Public              | 10.0.2.0/24  | snet_prod_public_b      | ALB / Internet Gateway |
| A  | Private Application | 10.0.10.0/24 | snet_prod_app_private_a | EC2 / Auto Scaling     |
| B  | Private Application | 10.0.11.0/24 | snet_prod_app_private_b | EC2 / Auto Scaling     |
| A  | Private Database    | 10.0.20.0/24 | snet_prod_bd_private_a  | RDS PostgreSQL         |
| B  | Private Database    | 10.0.21.0/24 | snet_prod_bd_private_b  | RDS PostgreSQL         |

---
</br>

## Camadas da Arquitetura

A arquitetura é organizada em três camadas, cada uma com responsabilidades específicas.


### 1. Public Subnets

As Public Subnets são responsáveis pela entrada da aplicação.

#### Recursos associados

* Application Load Balancer (ALB)
* Acesso à Internet via **igw_prod**

Apenas recursos de entrada controlada são expostos.


### 2. Private Application Subnets

As Private Application Subnets hospedam a camada de aplicação.

#### Recursos associados

* Amazon EC2 (Auto Scaling Group)
* Docker Runtime
* AWS Systems Manager Agent

As instâncias não possuem IP público e não possuem acesso direto à Internet, dependendo da estratégia arquitetural adotada.


### 3. Private Database Subnets

As Private Database Subnets são responsáveis pela camada de dados.

#### Recursos associados

* Amazon RDS PostgreSQL (Multi-AZ)

Essa camada permanece totalmente isolada, sendo acessível apenas pela camada de aplicação.

---
</br>


## 1. Estratégia Low Cost

Na arquitetura **Low Cost**, as subnets privadas não utilizam NAT Gateway.

O acesso aos serviços AWS ocorre através de **VPC Endpoints**, mantendo todo o tráfego dentro da rede privada da AWS.

### Interface Endpoints

* SSM
* SSMMessages
* EC2Messages
* ECR API
* ECR DKR

### Gateway Endpoint

* Amazon S3

---
</br>

## 2. Estratégia Maior Investimento

Na arquitetura de **Maior Investimento**:

* As subnets privadas utilizam NAT Gateway.
* As instâncias EC2 possuem acesso à Internet.
* Não são utilizados VPC Endpoints.
* Há maior flexibilidade operacional.
* O custo operacional é mais elevado.

---
</br>

### Comparação entre as Propostas

| Característica                       | Low Cost | Maior Investimento |
| ------------------------------------ | :------: | :----------------: |
| NAT Gateway                          |     ✖    |          ✔         |
| VPC Endpoints                        |     ✔    |          ✖         |
| Acesso direto à Internet             |     ✖    |          ✔         |
| Comunicação privada com serviços AWS |     ✔    |       Parcial      |
| Maior flexibilidade operacional      |     ✖    |          ✔         |
| Menor custo operacional              |     ✔    |          ✖         |

---

### Resumo Arquitetural

A arquitetura de subnets da **EDN Cloud Platform** é baseada em três camadas:

* **Public Subnets:** entrada da aplicação através do Application Load Balancer e Internet Gateway (**igw_prod**).
* **Private Application Subnets:** execução da aplicação utilizando Amazon EC2 e Auto Scaling Group.
* **Private Database Subnets:** persistência dos dados utilizando Amazon RDS PostgreSQL.

A principal diferença entre as propostas arquiteturais está na conectividade das subnets privadas.

Na proposta **Low Cost**, o acesso aos serviços AWS ocorre por meio de **VPC Endpoints**, eliminando a necessidade de um NAT Gateway e reduzindo custos.

Na proposta de **Maior Investimento**, as instâncias privadas utilizam um **NAT Gateway** para acesso controlado à Internet, oferecendo maior flexibilidade operacional para aplicações corporativas.