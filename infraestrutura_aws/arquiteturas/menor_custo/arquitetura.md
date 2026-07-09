# Arquitetura de menor custo 

Este documento apresenta a arquitetura **Low-Cost** do projeto **EDN Go2Cloud**, descrevendo sua estrutura, os componentes utilizados e as principais decisões arquiteturais adotadas.

A proposta foi projetada para atender aplicações que exigem alta disponibilidade, segurança, observabilidade e escalabilidade, mantendo o menor custo operacional possível.

---

### Visão Geral

A arquitetura **Low Cost** foi projetada para fornecer um ambiente em nuvem seguro, altamente disponível e escalável, mantendo o menor custo operacional possível.

Toda a infraestrutura está implantada em uma **Amazon VPC** distribuída entre duas Availability Zones, utilizando sub-redes públicas e privadas para isolar cada camada da aplicação.

Como estratégia de otimização de custos, a solução adota duas importantes decisões arquiteturais:

* Utilização do **Cloudflare** como provedor de **DNS, CDN e WAF**, substituindo os serviços Amazon Route 53, Amazon CloudFront e AWS WAF.
* Utilização de **VPC Endpoints** para comunicação entre os recursos privados e os serviços gerenciados da AWS, eliminando a necessidade de utilização de um NAT Gateway.

Essas decisões reduzem o custo mensal da infraestrutura sem comprometer a segurança, disponibilidade e desempenho da solução.

---
</br>

## Camadas da Arquitetura

### 1. Camada de Entrada (Edge Layer)

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

#### Cloudflare

* Resolução DNS.
* Distribuição de conteúdo através de CDN.
* Proteção da aplicação utilizando WAF.
* Mitigação de ataques DDoS.
* Gerenciamento de certificados SSL/TLS.
* Redução dos custos da infraestrutura AWS.

Ao utilizar o Cloudflare, a arquitetura elimina a necessidade de utilizar Amazon Route 53, Amazon CloudFront e AWS WAF, reduzindo o custo da solução.

#### Application Load Balancer

* Recebe conexões HTTPS.
* Utiliza certificados gerenciados pelo AWS Certificate Manager.
* Distribui as requisições entre as instâncias EC2.
* Realiza verificações de integridade (Health Checks).

---

### 2. Camada de Rede (Network Layer)

Toda a infraestrutura está hospedada em uma única **Amazon VPC**.

A rede está distribuída entre duas Availability Zones para aumentar a disponibilidade e a tolerância a falhas.

#### 2.1 Public Subnets

Responsáveis por hospedar:

* Application Load Balancer.

Características:

* Possuem acesso à Internet através do Internet Gateway.
* Recebem apenas o tráfego proveniente do Cloudflare.

#### 2.2 Private Application Subnets

Responsáveis por hospedar:

* Instâncias Amazon EC2.

Características:

* Não possuem acesso direto à Internet.
* Recebem tráfego apenas do Application Load Balancer.
* Acessam serviços AWS através de VPC Endpoints.

#### 2.3 Private Database Subnets

Responsáveis por hospedar:

* Amazon RDS PostgreSQL.

Características:

* Totalmente isoladas da Internet.
* Acessíveis apenas pelas instâncias da aplicação.

#### 2.4 Comunicação com Serviços AWS

Como estratégia de redução de custos, a arquitetura utiliza **VPC Endpoints** para comunicação privada entre as instâncias EC2 e os serviços gerenciados da AWS.

Entre os principais serviços acessados estão:

* Amazon ECR
* Amazon S3
* Amazon CloudWatch

Essa abordagem elimina a necessidade de um **NAT Gateway**, reduzindo o custo mensal da infraestrutura.

Além da economia financeira, essa estratégia oferece:

* Comunicação privada pela rede da AWS.
* Redução da exposição à Internet.
* Maior segurança.
* Arquitetura simplificada 

---
</br>

### 3. Camada de Computação

A aplicação é executada em instâncias Amazon EC2 distribuídas entre duas Availability Zones.

As instâncias são gerenciadas por um **Auto Scaling Group**, utilizando um **Launch Template** previamente configurado.

Essa configuração fornece:

* Recuperação automática de instâncias.
* Padronização da infraestrutura.
* Escalabilidade horizontal.
* Substituição automática de instâncias com falha.

---
</br>

### 4. Camada de Banco de Dados

A persistência dos dados é realizada utilizando **Amazon RDS PostgreSQL** configurado em **Multi-AZ**.

Características:

* Banco de dados gerenciado.
* Alta disponibilidade.
* Failover automático.
* Comunicação permitida apenas pelas instâncias EC2.

---
</br>

### 5. Camada de Armazenamento

#### 5.1 Amazon S3

Responsável pelo armazenamento de arquivos utilizados pela aplicação.

#### 5.2 Amazon Elastic Container Registry (ECR)

Responsável pelo armazenamento das imagens Docker utilizadas pelas instâncias EC2.

---
</br>

### Arquitetura de Deploy

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
                                                    Auto Scaling Group
                                                        (Instance Refresh)


```

### Processo de Build

O **AWS CodeBuild** é responsável por construir e publicar a imagem Docker da aplicação.

Durante a execução do arquivo **buildspec.yml**, são realizadas as seguintes etapas:

1. Autenticação no Amazon ECR.
2. Build da imagem Docker.
3. Criação da tag da imagem.
4. Publicação da imagem no Amazon ECR.


---

### Deploy Imutável (Immutable Deployment)

Nessa arquitetura, alterações estruturais exigem a substituição das instâncias, o **Auto Scaling Group** pode executar um **Instance Refresh**.

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
</br>

## Monitoramento e Gerenciamento

A proposta **Low Cost** contempla apenas os serviços essenciais para gerenciamento da infraestrutura.


### 1.  AWS Config

Responsável por:

* Inventário dos recursos.
* Auditoria das configurações.
* Registro de alterações na infraestrutura.

### 2. Amazon SNS

Responsável pelo envio de notificações provenientes do AutoScaling Groups

> **Observação:** Esta proposta não contempla recursos como CloudWatch Logs, CloudWatch Dashboards e CloudWatch Alarms. Esses serviços fazem parte da arquitetura avançada do projeto e foram removidos desta proposta para manter o foco na redução dos custos operacionais.

---
</br>

## Arquitetura de Segurança

A solução implementa múltiplas camadas de segurança.

### 1. Segurança de Perímetro

Fornecida pelo Cloudflare:

* DNS.
* CDN.
* WAF.
* Proteção contra ataques DDoS.

### 2. HTTPS

Os certificados TLS são gerenciados pelo **AWS Certificate Manager** e utilizados pelo Application Load Balancer.

### 3. Gerenciamento de Identidade

* AWS IAM.
* Método de Autênticação interno da Aplicação

### 4. Gerenciamento de Credenciais

As credenciais sensíveis da aplicação são armazenadas no **AWS Secrets Manager**.

### 5. Comunicação Interna

Os **Security Groups** controlam toda a comunicação entre os recursos.

### 6. Application Load Balancer

Permite:

* HTTP (80).
* HTTPS (443).

### 7. Amazon EC2

Permite:

* Tráfego proveniente do ALB.
* Comunicação com o banco de dados.

### 8. Amazon RDS PostgreSQL

Permite conexões apenas na porta **5432** provenientes das instâncias EC2.

---
</br>

### Alta Disponibilidade

A arquitetura implementa mecanismos de alta disponibilidade utilizando:

* Duas Availability Zones.
* Application Load Balancer.
* Auto Scaling Group.
* Amazon RDS Multi-AZ.
* Recuperação automática de instâncias EC2.
* Health Checks realizados pelo Application Load Balancer.

---
</br>

## Decisões Arquiteturais

A proposta **Low Cost** foi desenvolvida buscando o equilíbrio entre custo, disponibilidade, segurança e simplicidade operacional.

As principais decisões arquiteturais são:

### 1. Cloudflare como Plataforma de Entrada

O Cloudflare fornece DNS, CDN e WAF, substituindo Amazon Route 53, Amazon CloudFront e AWS WAF.

Essa decisão reduz significativamente o custo mensal da infraestrutura mantendo recursos essenciais de segurança e desempenho.


### 2. VPC Endpoints em substituição ao NAT Gateway

As instâncias EC2 privadas acessam os serviços AWS utilizando **VPC Endpoints**, eliminando a necessidade de um NAT Gateway.

Benefícios:

* Redução significativa dos custos.
* Comunicação privada pela rede da AWS.
* Menor superfície de ataque.
* Maior segurança da infraestrutura.

### 3. Aplicação Containerizada

A aplicação é executada em containers Docker hospedados em instâncias Amazon EC2.

Benefícios:

* Portabilidade.
* Padronização dos ambientes.
* Facilidade de implantação.
* Atualizações simplificadas.

### 4. Pipeline de Entrega Contínua

O processo de deploy é automatizado utilizando:

* GitHub.
* AWS CodeBuild.
* Amazon ECR.
* Auto Scaling Group (Instance Refresh)

Essa abordagem reduz intervenções manuais e garante implantações consistentes.

---
</br>

### Estratégia Flexível de Deploy

A arquitetura suporta o modelo de implantação:

* Deploy Imutável utilizando Instance Refresh do Auto Scaling Group quando necessário.

---

### Monitoramento Orientado a Baixo Custo

A proposta contempla apenas os serviços essenciais de gerenciamento.

Recursos avançados de observabilidade, como CloudWatch Logs, Dashboards e Alarms, foram reservados para a proposta de maior investimento.

---

### Resumo da Arquitetura

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