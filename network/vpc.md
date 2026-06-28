# Amazon VPC

## Visão Geral

A Amazon Virtual Private Cloud (VPC) é o componente responsável por fornecer isolamento lógico para toda a infraestrutura da **EDN Cloud Platform**.

As duas propostas arquiteturais do projeto — **Low Cost** e **Maior Investimento** — utilizam a mesma estrutura básica de rede, diferenciando-se principalmente pela estratégia de conectividade com a Internet e pela quantidade de serviços gerenciados utilizados.

A arquitetura foi projetada seguindo boas práticas recomendadas pela AWS, utilizando segmentação de rede, isolamento entre camadas e distribuição dos recursos entre múltiplas Availability Zones.

---

# Objetivos

A VPC possui os seguintes objetivos:

* Isolar toda a infraestrutura da aplicação.
* Organizar os recursos em sub-redes públicas e privadas.
* Permitir alta disponibilidade entre múltiplas Availability Zones.
* Reduzir a superfície de ataque da aplicação.
* Facilitar o controle de acesso através de Security Groups e tabelas de roteamento.
* Servir como base para ambas as arquiteturas apresentadas no projeto.

---

# Estrutura da Rede

A VPC utiliza o bloco CIDR:

```text
10.0.0.0/16
```

Esse espaço de endereçamento foi subdividido para separar os diferentes componentes da infraestrutura.

| Camada          | CIDR         | Finalidade          |
| --------------- | ------------ | ------------------- |
| Public Subnet A | 10.0.1.0/24  | Recursos públicos   |
| Public Subnet B | 10.0.2.0/24  | Recursos públicos   |
| Private App A   | 10.0.10.0/24 | Camada de aplicação |
| Private App B   | 10.0.11.0/24 | Camada de aplicação |
| Private DB A    | 10.0.20.0/24 | Banco de dados      |
| Private DB B    | 10.0.21.0/24 | Banco de dados      |

A distribuição entre duas Availability Zones garante maior disponibilidade da infraestrutura.

---

# Sub-redes Públicas

As sub-redes públicas hospedam os componentes responsáveis pelo recebimento das conexões provenientes da Internet.

Entre os recursos implantados nessa camada estão:

* Application Load Balancer.
* NAT Gateway (Proposta de Maior Investimento).

Essas sub-redes possuem rotas direcionadas ao Internet Gateway.

---

# Sub-redes Privadas da Aplicação

As instâncias Amazon EC2 são executadas exclusivamente em sub-redes privadas.

Essa estratégia evita a exposição direta dos servidores à Internet.

Todo o tráfego destinado à aplicação passa obrigatoriamente pelo Application Load Balancer.

Entre os recursos dessa camada estão:

* Amazon EC2.
* Auto Scaling Group.
* Docker.
* AWS Systems Manager Agent.

---

# Sub-redes Privadas do Banco de Dados

O banco de dados Amazon RDS PostgreSQL permanece isolado em sub-redes privadas dedicadas.

Somente a camada de aplicação possui permissão para acessar o banco de dados através dos Security Groups.

Essa separação aumenta a segurança e reduz a possibilidade de acessos não autorizados.

---

# Internet Gateway

O Internet Gateway conecta a Amazon VPC à Internet.

Sua utilização permite:

* Comunicação do Application Load Balancer com os usuários.
* Comunicação do NAT Gateway com a Internet.
* Entrada de tráfego público somente para os recursos autorizados.

As instâncias EC2 e o banco de dados não possuem acesso direto à Internet.

---

# Roteamento

As tabelas de roteamento controlam o fluxo de comunicação dentro da VPC.

De forma simplificada:

* As sub-redes públicas encaminham o tráfego externo para o Internet Gateway.
* As sub-redes privadas comunicam-se internamente através da VPC.
* O acesso externo das instâncias privadas depende da estratégia adotada em cada proposta.

---

# Estratégias de Conectividade

Embora ambas as arquiteturas utilizem a mesma VPC, a comunicação das instâncias privadas com serviços externos ocorre de maneiras diferentes.

## Proposta Low Cost

Na arquitetura de baixo custo, as instâncias EC2 utilizam **VPC Endpoints** para acessar serviços AWS de forma privada.

Essa estratégia elimina a necessidade de um NAT Gateway, reduzindo significativamente o custo operacional e mantendo a comunicação dentro da rede da AWS.

Os principais benefícios são:

* Redução de custos.
* Comunicação privada.
* Menor superfície de ataque.
* Menor dependência de acesso à Internet.

---

## Proposta de Maior Investimento

Na arquitetura corporativa, as instâncias privadas utilizam um **NAT Gateway** para acessar a Internet quando necessário.

Essa abordagem oferece maior flexibilidade operacional, permitindo:

* Atualização do sistema operacional.
* Download de dependências.
* Acesso a repositórios externos.
* Comunicação com serviços que não possuem suporte a VPC Endpoints.

Embora represente um custo maior, essa estratégia simplifica a administração do ambiente e amplia a compatibilidade com aplicações corporativas.

---

# Segurança da Rede

A segurança da VPC é implementada em múltiplas camadas.

Entre os principais mecanismos utilizados estão:

* Security Groups.
* Sub-redes privadas.
* Isolamento do banco de dados.
* Controle de rotas.
* Application Load Balancer.
* AWS WAF (Proposta de Maior Investimento).
* CloudFront (Proposta de Maior Investimento).
* Cloudflare (Proposta Low Cost).

Essa abordagem reduz significativamente a exposição dos recursos internos.

---

# Alta Disponibilidade

Todos os componentes críticos da infraestrutura são distribuídos entre duas Availability Zones.

Essa estratégia permite:

* Continuidade da aplicação em caso de falha de uma zona.
* Balanceamento de carga entre instâncias.
* Recuperação automática através do Auto Scaling Group.
* Alta disponibilidade do banco de dados utilizando Amazon RDS Multi-AZ.

---

# Comparação entre as Propostas

| Característica            | Low Cost   | Maior Investimento |
| ------------------------- | ---------- | ------------------ |
| Amazon VPC                | ✔          | ✔                  |
| Public Subnets            | ✔          | ✔                  |
| Private Subnets           | ✔          | ✔                  |
| Banco em Sub-rede Privada | ✔          | ✔                  |
| Internet Gateway          | ✔          | ✔                  |
| NAT Gateway               | ✖          | ✔                  |
| VPC Endpoints             | ✔          | ✖                  |
| Cloudflare                | ✔          | ✖                  |
| Amazon CloudFront         | ✖          | ✔                  |
| AWS WAF                   | Cloudflare | AWS WAF            |
| Segurança em Camadas      | ✔          | ✔                  |

---

# Resumo

A Amazon VPC constitui a base de ambas as arquiteturas desenvolvidas para a EDN Cloud Platform, fornecendo isolamento, segmentação e controle sobre toda a infraestrutura.

A principal diferença entre as propostas está na estratégia de conectividade das instâncias privadas. Enquanto a arquitetura **Low Cost** prioriza a redução de custos utilizando VPC Endpoints, a arquitetura **Maior Investimento** adota um NAT Gateway para oferecer maior flexibilidade operacional e compatibilidade com ambientes corporativos.

Em ambos os cenários, a segmentação da rede, o uso de sub-redes privadas e a distribuição dos recursos entre múltiplas Availability Zones garantem uma infraestrutura segura, escalável e alinhada às boas práticas de arquitetura em nuvem.
