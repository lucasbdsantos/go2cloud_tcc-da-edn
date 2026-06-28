# Route Tables

## Visão Geral

As Route Tables são responsáveis por controlar o roteamento do tráfego dentro da Amazon Virtual Private Cloud (VPC), determinando para onde cada pacote de dados deve ser encaminhado.

Nas arquiteturas **Low Cost** e **Maior Investimento** da **EDN Cloud Platform**, as tabelas de rotas foram configuradas para garantir o isolamento entre as camadas da infraestrutura, permitindo apenas os fluxos de comunicação necessários para o funcionamento da aplicação.

Embora ambas utilizem a mesma estrutura básica de rede, as estratégias de conectividade das sub-redes privadas diferem significativamente.

---

# Objetivos

As Route Tables possuem os seguintes objetivos:

* Controlar o fluxo de tráfego dentro da VPC.
* Definir quais recursos possuem acesso à Internet.
* Isolar os recursos públicos dos privados.
* Permitir a comunicação entre os componentes internos.
* Implementar diferentes estratégias de conectividade conforme cada proposta arquitetural.

---

# Estrutura das Route Tables

A infraestrutura utiliza duas categorias principais de tabelas de rotas.

| Route Table         | Associada a                                    | Objetivo                                                           |
| ------------------- | ---------------------------------------------- | ------------------------------------------------------------------ |
| Public Route Table  | Public Subnets                                 | Comunicação com a Internet                                         |
| Private Route Table | Private Application e Private Database Subnets | Comunicação interna da VPC e acesso controlado a serviços externos |

---

# Public Route Table

A Public Route Table é associada às sub-redes públicas.

Ela é responsável por permitir que os recursos públicos da arquitetura recebam conexões provenientes da Internet.

## Recursos associados

* Application Load Balancer
* NAT Gateway *(apenas na proposta de Maior Investimento)*

### Rotas

| Destino     | Target           |
| ----------- | ---------------- |
| 10.0.0.0/16 | Local            |
| 0.0.0.0/0   | Internet Gateway |

Fluxo simplificado:

```text
Internet
     │
     ▼
Internet Gateway
     │
     ▼
Public Route Table
     │
     ▼
Public Subnets
```

---

# Private Route Tables

As sub-redes privadas utilizam tabelas de rotas específicas para manter os recursos internos inacessíveis diretamente pela Internet.

Essas tabelas permitem:

* Comunicação entre instâncias EC2.
* Comunicação com o Amazon RDS.
* Acesso aos serviços AWS.
* Comunicação externa quando necessário (Proposta de Maior Investimento).

Todas possuem a rota local:

| Destino     | Target |
| ----------- | ------ |
| 10.0.0.0/16 | Local  |

A principal diferença entre as arquiteturas está no destino utilizado para acessar recursos externos.

---

# Estratégia de Roteamento — Proposta Low Cost

A proposta **Low Cost** elimina completamente o NAT Gateway.

As instâncias Amazon EC2 permanecem totalmente isoladas da Internet e acessam os serviços AWS através de **VPC Endpoints**, reduzindo custos operacionais e mantendo toda a comunicação na rede privada da AWS.

## Gateway Endpoint

O Amazon S3 utiliza um **Gateway Endpoint**, sendo o único serviço da arquitetura que exige alteração na Route Table.

### Rotas

| Destino                  | Target           |
| ------------------------ | ---------------- |
| 10.0.0.0/16              | Local            |
| Prefix List do Amazon S3 | Gateway Endpoint |

Fluxo:

```text
Amazon EC2
      │
      ▼
Private Route Table
      │
      ▼
Gateway Endpoint
      │
      ▼
Amazon S3
```

---

## Interface Endpoints

Os demais serviços utilizam **Interface Endpoints**, que criam interfaces de rede (ENIs) dentro das sub-redes privadas.

Esses endpoints utilizam **Private DNS**, dispensando alterações nas Route Tables.

### Serviços utilizados

| Serviço                         | Tipo               |
| ------------------------------- | ------------------ |
| AWS Systems Manager             | Interface Endpoint |
| EC2 Messages                    | Interface Endpoint |
| SSM Messages                    | Interface Endpoint |
| Amazon ECR API                  | Interface Endpoint |
| Amazon ECR DKR                  | Interface Endpoint |
| AWS Secrets Manager             | Interface Endpoint |
| Amazon SNS *(quando utilizado)* | Interface Endpoint |

Fluxo:

```text
Amazon EC2
      │
      ▼
Private DNS
      │
      ▼
Interface Endpoint
      │
      ▼
Serviço AWS
```

### Benefícios

* Elimina o NAT Gateway.
* Reduz o custo mensal da infraestrutura.
* Comunicação privada com serviços AWS.
* Menor superfície de ataque.
* Maior segurança operacional.

---

# Estratégia de Roteamento — Proposta de Maior Investimento

Na proposta de **Maior Investimento**, as instâncias privadas possuem acesso controlado à Internet através de um NAT Gateway.

Essa abordagem oferece maior flexibilidade operacional para aplicações corporativas.

### Rotas

| Destino     | Target      |
| ----------- | ----------- |
| 10.0.0.0/16 | Local       |
| 0.0.0.0/0   | NAT Gateway |

Fluxo:

```text
Amazon EC2
      │
      ▼
Private Route Table
      │
      ▼
NAT Gateway
      │
      ▼
Internet Gateway
      │
      ▼
Internet
```

Essa estratégia permite:

* Atualização do sistema operacional.
* Download de dependências.
* Comunicação com repositórios externos.
* Acesso a serviços que não oferecem suporte a VPC Endpoints.

---

# Fluxo de Comunicação

Independentemente da proposta adotada, o fluxo principal da aplicação permanece o mesmo.

```text
Usuário
      │
      ▼
Application Load Balancer
      │
      ▼
Amazon EC2
      │
      ▼
Amazon RDS PostgreSQL
```

Todo esse tráfego ocorre através da rede privada da Amazon VPC.

---

# Segurança

As Route Tables trabalham em conjunto com outros mecanismos de segurança da arquitetura.

Entre eles:

* Sub-redes públicas e privadas.
* Security Groups.
* Internet Gateway.
* NAT Gateway *(Proposta de Maior Investimento)*.
* VPC Endpoints *(Proposta Low Cost)*.
* AWS WAF.
* CloudFront ou Cloudflare, conforme a proposta adotada.

Essa combinação garante que apenas os fluxos previstos sejam permitidos.

---

# Comparação entre as Propostas

| Característica                       | Low Cost | Maior Investimento |
| ------------------------------------ | :------: | :----------------: |
| Public Route Table                   |     ✔    |          ✔         |
| Private Route Table                  |     ✔    |          ✔         |
| Internet Gateway                     |     ✔    |          ✔         |
| NAT Gateway                          |     ✖    |          ✔         |
| Gateway Endpoint (Amazon S3)         |     ✔    |          ✖         |
| Interface Endpoints                  |     ✔    |          ✖         |
| Rota para Amazon S3                  |     ✔    |          ✖         |
| Comunicação privada com serviços AWS |     ✔    |       Parcial      |
| Acesso controlado à Internet         |     ✖    |          ✔         |
| Menor custo operacional              |     ✔    |          ✖         |

---

# Decisões Arquiteturais

As principais decisões relacionadas ao roteamento foram:

### Proposta Low Cost

* Eliminação do NAT Gateway.
* Utilização de VPC Endpoints para acesso privado aos serviços AWS.
* Gateway Endpoint para o Amazon S3.
* Interface Endpoints para Systems Manager, Amazon ECR, Secrets Manager e Amazon SNS.

Essa estratégia reduz significativamente os custos sem comprometer a segurança da infraestrutura.

---

### Proposta de Maior Investimento

* Utilização de NAT Gateway para acesso controlado à Internet.
* Maior flexibilidade para instalação de dependências e integração com serviços externos.
* Arquitetura voltada para ambientes corporativos e cargas de trabalho mais complexas.

---

# Resumo

As Route Tables desempenham um papel fundamental na organização da conectividade da infraestrutura da **EDN Cloud Platform**, definindo como o tráfego é encaminhado entre os diferentes componentes da arquitetura.

Na proposta **Low Cost**, o roteamento foi otimizado para reduzir custos por meio da utilização de VPC Endpoints, sendo necessária uma rota específica apenas para o **Amazon S3**, que utiliza um Gateway Endpoint. Os demais serviços AWS são acessados através de Interface Endpoints, dispensando alterações nas tabelas de rotas.

Na proposta **Maior Investimento**, as sub-redes privadas utilizam um NAT Gateway para acesso controlado à Internet, oferecendo maior flexibilidade operacional para ambientes corporativos.

Essa comparação evidencia como diferentes requisitos de negócio influenciam diretamente as decisões de roteamento e conectividade em arquiteturas AWS.
