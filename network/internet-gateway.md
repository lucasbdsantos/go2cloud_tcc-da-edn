# Internet Gateway

## Visão Geral

O Internet Gateway (IGW) é o componente responsável por conectar a Amazon Virtual Private Cloud (VPC) à Internet, permitindo a comunicação entre recursos públicos da infraestrutura e usuários externos.

Neste projeto, ambas as propostas arquiteturais utilizam um único Internet Gateway denominado **igw_prod**, associado à VPC principal.

Embora o Internet Gateway esteja presente nas duas arquiteturas, seu papel difere conforme a estratégia adotada para conectividade das sub-redes privadas.

---

# Objetivos

O Internet Gateway possui os seguintes objetivos:

* Disponibilizar o Application Load Balancer para acesso público.
* Permitir comunicação entre a VPC e a Internet.
* Atuar como ponto de saída do NAT Gateway na proposta de Maior Investimento.
* Manter a separação entre recursos públicos e privados.

---

# Configuração

| Recurso                 | Valor                         |
| ----------------------- | ----------------------------- |
| Nome                    | **igw_prod**                  |
| Tipo                    | Internet Gateway              |
| Associação              | Amazon VPC                    |
| Utilizado nas propostas | Low Cost e Maior Investimento |

O Internet Gateway é associado à VPC e utilizado pelas Route Tables das sub-redes públicas.

---

# Recursos Associados

O **igw_prod** é utilizado pelos seguintes componentes da infraestrutura:

* Application Load Balancer (ALB)
* NAT Gateway *(apenas na proposta de Maior Investimento)*

As instâncias Amazon EC2 e o banco de dados Amazon RDS permanecem em sub-redes privadas e não possuem associação direta ao Internet Gateway.

---

# Fluxo de Entrada

Em ambas as arquiteturas, o tráfego de entrada ocorre da seguinte forma:

```text
Usuário
    │
    ▼
Internet
    │
    ▼
Internet Gateway (igw_prod)
    │
    ▼
Public Route Table
    │
    ▼
Application Load Balancer
    │
    ▼
Amazon EC2
```

O Internet Gateway atua exclusivamente como ponto de entrada para os recursos públicos da infraestrutura.

---

# Proposta Low Cost

Na arquitetura **Low Cost**, o Internet Gateway é utilizado exclusivamente para disponibilizar o Application Load Balancer.

As instâncias Amazon EC2 permanecem totalmente isoladas da Internet e não utilizam o Internet Gateway para tráfego de saída.

A comunicação com os serviços AWS ocorre através de **VPC Endpoints**, permitindo acesso privado aos seguintes serviços:

* AWS Systems Manager (SSM)
* Amazon Elastic Container Registry (ECR)
* Amazon S3

Essa estratégia elimina a necessidade de um NAT Gateway e reduz significativamente o custo operacional da infraestrutura.

Fluxo simplificado:

```text
Internet
    │
    ▼
Internet Gateway (igw_prod)
    │
    ▼
Application Load Balancer
    │
    ▼
Amazon EC2

Amazon EC2
    │
    ▼
VPC Endpoints
    │
    ▼
Serviços AWS
```

---

# Proposta de Maior Investimento

Na arquitetura **Maior Investimento**, o Internet Gateway possui duas funções principais:

* Disponibilizar o Application Load Balancer para acesso público.
* Permitir que o NAT Gateway forneça acesso controlado à Internet para as instâncias privadas.

Fluxo simplificado:

```text
Internet
    │
    ▼
Internet Gateway (igw_prod)
    │
    ▼
Public Route Table
    │
    ├──► Application Load Balancer
    │
    └──► NAT Gateway
              │
              ▼
         Amazon EC2
```

Essa abordagem oferece maior flexibilidade operacional, permitindo que as instâncias privadas realizem atualizações do sistema operacional, instalem dependências, realizem downloads de pacotes e acessem serviços externos quando necessário.

---

# Segurança

Embora seja o componente responsável pela conectividade com a Internet, o Internet Gateway não implementa regras de filtragem de tráfego.

A proteção da infraestrutura é realizada em conjunto com outros serviços da arquitetura.

## Proposta Low Cost

* Cloudflare (DNS, CDN e WAF)
* Application Load Balancer
* Security Groups
* VPC Endpoints

## Proposta de Maior Investimento

* Amazon Route 53
* Amazon CloudFront
* AWS WAF
* Application Load Balancer
* Security Groups
* NAT Gateway

Essa abordagem garante que apenas os recursos públicos fiquem expostos à Internet, enquanto a camada de aplicação e o banco de dados permanecem protegidos em sub-redes privadas.

---

# Comparação entre as Propostas

| Característica                   | Low Cost |  Maior Investimento |
| -------------------------------- | :------: | :-----------------: |
| Internet Gateway (igw_prod)      |     ✔    |          ✔          |
| Associação à VPC                 |     ✔    |          ✔          |
| Application Load Balancer        |     ✔    |          ✔          |
| NAT Gateway                      |     ✖    |          ✔          |
| Acesso direto das EC2 à Internet |     ✖    | ✔ (via NAT Gateway) |
| Uso de VPC Endpoints             |     ✔    |          ✖          |

---

# Decisões Arquiteturais

As principais decisões relacionadas ao Internet Gateway foram:

### Utilização de um único Internet Gateway

A VPC utiliza apenas um Internet Gateway (**igw_prod**), simplificando a conectividade pública e seguindo as boas práticas recomendadas pela AWS.

---

### Isolamento das Instâncias

Em ambas as propostas, as instâncias Amazon EC2 permanecem em sub-redes privadas, sem endereços IP públicos.

Todo o tráfego de entrada passa obrigatoriamente pelo Application Load Balancer.

---

### Estratégias de Conectividade

Na proposta **Low Cost**, o Internet Gateway é utilizado apenas para o tráfego destinado ao Application Load Balancer, enquanto o acesso aos serviços AWS ocorre por meio de VPC Endpoints.

Na proposta **Maior Investimento**, o Internet Gateway também atende ao NAT Gateway, permitindo acesso controlado à Internet para as instâncias privadas.

---

# Resumo

O **Internet Gateway (igw_prod)** é o componente responsável por conectar a VPC à Internet, permitindo que os recursos públicos da infraestrutura sejam acessados pelos usuários.

Embora esteja presente nas duas arquiteturas, sua utilização varia conforme a estratégia adotada. Na proposta **Low Cost**, ele é utilizado exclusivamente para o acesso ao Application Load Balancer, enquanto a comunicação das instâncias privadas com os serviços AWS ocorre por meio de VPC Endpoints. Já na proposta **Maior Investimento**, o Internet Gateway também atua em conjunto com o NAT Gateway, fornecendo acesso controlado à Internet para as instâncias privadas.

Essa diferença evidencia duas abordagens arquiteturais distintas: uma orientada à otimização de custos por meio de comunicação privada com serviços AWS e outra voltada para maior flexibilidade operacional utilizando acesso controlado à Internet.
