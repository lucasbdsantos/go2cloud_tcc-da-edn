# NAT Gateway

### Visão Geral

O NAT Gateway é um serviço gerenciado da AWS que permite que recursos localizados em sub-redes privadas iniciem conexões de saída para a Internet sem que fiquem diretamente expostos ao acesso externo.

Neste projeto, o NAT Gateway é utilizado **exclusivamente na proposta de Maior Investimento**, permitindo que as instâncias Amazon EC2 acessem serviços externos de forma segura, mantendo a camada de aplicação isolada em sub-redes privadas.

Na proposta **Low Cost**, esse componente é substituído por VPC Endpoints, reduzindo significativamente o custo operacional da infraestrutura.

---

### Objetivos

O NAT Gateway possui os seguintes objetivos:

* Permitir acesso controlado à Internet para as instâncias privadas.
* Manter as instâncias Amazon EC2 sem endereços IP públicos.
* Possibilitar instalação de dependências e atualizações do sistema operacional.
* Permitir acesso a repositórios externos quando necessário.
* Preservar o isolamento da camada de aplicação.

---

### Configuração

| Recurso               | Valor                |
| --------------------- | -------------------- |
| Nome                  | **natgw_prod**       |
| Tipo                  | Public NAT Gateway   |
| Quantidade            | 1                    |
| Subnet                | Public Subnet (AZ-A) |
| Elastic IP            | 1                    |
| Utilizado na proposta | Maior Investimento   |

O NAT Gateway está implantado em uma das sub-redes públicas e associado ao Internet Gateway (**igw_prod**) através da Public Route Table.

---

### Funcionamento

As instâncias Amazon EC2 permanecem em sub-redes privadas e utilizam a Private Route Table para encaminhar todo o tráfego destinado à Internet para o NAT Gateway.

O NAT Gateway realiza a tradução de endereços (Network Address Translation), permitindo apenas conexões iniciadas pelas instâncias internas.

Nenhuma conexão proveniente da Internet pode acessar diretamente as instâncias privadas.

---

### Fluxo de Comunicação

O acesso à Internet ocorre conforme o fluxo abaixo:

```text
                                                Amazon EC2
                                                      │
                                                      ▼
                                            Private Route Table
                                                      │
                                                      ▼
                                          NAT Gateway (natgw_prod)
                                                      │
                                                      ▼
                                          Internet Gateway (igw_prod)
                                                      │
                                                      ▼
                                                   Internet
```

Todo o tráfego de saída das sub-redes privadas passa obrigatoriamente pelo NAT Gateway.

---

### Recursos que Utilizam o NAT Gateway

Na proposta de Maior Investimento, o NAT Gateway pode ser utilizado para:

* Atualizações do sistema operacional das instâncias.
* Download de dependências da aplicação.
* Instalação de pacotes.
* Comunicação com repositórios públicos.
* Acesso a serviços externos necessários ao ambiente.

Os serviços AWS utilizados internamente também podem ser acessados através da Internet utilizando o NAT Gateway, dispensando a criação de VPC Endpoints nessa proposta.

---

### Alta Disponibilidade

A infraestrutura utiliza um único NAT Gateway.

Essa decisão reduz os custos quando comparada à utilização de um NAT Gateway por Availability Zone.

Como consequência, caso ocorra indisponibilidade da Availability Zone onde o NAT Gateway está implantado, as instâncias continuarão atendendo requisições da aplicação através do Application Load Balancer, porém perderão temporariamente a capacidade de iniciar conexões de saída para a Internet.

Esse comportamento não afeta diretamente a disponibilidade da aplicação, mas pode impactar atividades administrativas, atualizações e integrações externas.

---

### Comparação entre as Propostas

| Característica                  | Low Cost | Maior Investimento |
| ------------------------------- | :------: | :----------------: |
| NAT Gateway                     |     ✖    |          ✔         |
| Quantidade                      |     0    |          1         |
| Elastic IP                      |     ✖    |          ✔         |
| Acesso à Internet pelas EC2     |     ✖    |          ✔         |
| VPC Endpoints                   |     ✔    |          ✖         |
| Menor custo operacional         |     ✔    |          ✖         |
| Maior flexibilidade operacional |     ✖    |          ✔         |

---
</br>

## Decisões Arquiteturais

As principais decisões relacionadas ao NAT Gateway foram:

### 1. Utilização de um único NAT Gateway

A arquitetura utiliza apenas um NAT Gateway (**natgw_prod**) para reduzir custos sem comprometer a funcionalidade do ambiente.

Embora a AWS recomende um NAT Gateway por Availability Zone para máxima disponibilidade, a utilização de uma única instância representa um equilíbrio entre investimento e simplicidade operacional.


### 2. Instâncias Permanecem Privadas

Mesmo com acesso à Internet, as instâncias Amazon EC2 permanecem em sub-redes privadas e não recebem endereços IP públicos.

Todo o tráfego externo é realizado exclusivamente através do NAT Gateway.

### 3. Separação entre as Propostas

A existência do NAT Gateway apenas na proposta de Maior Investimento evidencia a principal diferença entre as duas arquiteturas.

Enquanto a proposta Low Cost privilegia a redução de custos utilizando VPC Endpoints, a proposta de Maior Investimento prioriza maior flexibilidade operacional por meio do acesso controlado à Internet.

---
</br>

### Resumo

O **natgw_prod** é responsável por fornecer acesso controlado à Internet para as instâncias Amazon EC2 da proposta de Maior Investimento, mantendo a camada de aplicação protegida em sub-redes privadas.

A adoção de um único NAT Gateway representa uma decisão arquitetural consciente, equilibrando custo e funcionalidade para o ambiente proposto.

Em contraste, a proposta Low Cost substitui completamente esse componente por VPC Endpoints, demonstrando duas abordagens distintas para conectividade de recursos privados na AWS e permitindo comparar, no contexto deste TCC, os impactos de cada estratégia em termos de custo, segurança e operação.