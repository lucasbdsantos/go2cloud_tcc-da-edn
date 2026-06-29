# Security Groups

## Visão Geral

Os **Security Groups** constituem a primeira camada de controle de acesso da infraestrutura da aplicação, funcionando como firewalls virtuais em nível de instância. Sua função é controlar quais conexões são permitidas entre os componentes da arquitetura, restringindo o tráfego apenas às comunicações estritamente necessárias.

A estratégia adotada neste projeto segue o princípio de **Least Privilege (Privilégio Mínimo)**, permitindo apenas os fluxos indispensáveis ao funcionamento da aplicação e reduzindo a superfície de ataque da infraestrutura.

As duas arquiteturas propostas (Low-Cost e Maior Investimento) utilizam a mesma segmentação lógica de Security Groups, diferenciando-se apenas pelos serviços auxiliares utilizados em cada cenário.

---

# Objetivos

A estratégia de Security Groups possui os seguintes objetivos:

* Isolar cada camada da aplicação;
* Impedir acesso direto às instâncias EC2;
* Restringir o acesso ao banco de dados exclusivamente pela aplicação;
* Permitir apenas as portas necessárias para cada serviço;
* Facilitar o gerenciamento das regras de segurança;
* Atender às boas práticas recomendadas pela AWS.

---

# Arquitetura dos Security Groups

A comunicação entre os componentes ocorre conforme o fluxo abaixo:

```text
Internet

        │

        ▼

Cloudflare / CloudFront

        │

        ▼

Application Load Balancer

        │

   sg_prod_alb

        │

        ▼

Auto Scaling Group (EC2)

        │

   sg_prod_app

        │

        ▼

Amazon RDS PostgreSQL

        │

   sg_prod_bd
```

Essa separação garante que cada camada possa comunicar-se apenas com a camada imediatamente necessária.

---

# Security Group do Application Load Balancer

## Identificação

```text
sg_prod_alb
```

Responsável por controlar o acesso ao Application Load Balancer.

---

## Regras de Entrada (Inbound)

| Porta | Protocolo | Origem   | Finalidade                    |
| ----- | --------- | -------- | ----------------------------- |
| 80    | TCP       | Internet | Redirecionamento HTTP → HTTPS |
| 443   | TCP       | Internet | Tráfego HTTPS da aplicação    |

> Em ambientes corporativos, recomenda-se restringir a origem da porta 443 aos intervalos de IP oficiais do Cloudflare quando este for utilizado como camada de proteção, reduzindo ainda mais a exposição do Load Balancer.

---

## Regras de Saída (Outbound)

| Porta | Destino     | Finalidade                                      |
| ----- | ----------- | ----------------------------------------------- |
| 3001  | sg_prod_app | Encaminhamento das requisições para a aplicação |

O Security Group permite apenas o encaminhamento das requisições para as instâncias EC2 pertencentes ao Auto Scaling Group.

---

# Security Group da Aplicação

## Identificação

```text
sg_prod_app
```

Associado às instâncias EC2 responsáveis pela execução da aplicação.

As instâncias permanecem em sub-redes privadas, não possuindo acesso direto proveniente da Internet.

---

## Regras de Entrada (Inbound)

| Porta | Protocolo | Origem      | Finalidade                                            |
| ----- | --------- | ----------- | ----------------------------------------------------- |
| 3001  | TCP       | sg_prod_alb | Comunicação da aplicação proveniente do Load Balancer |

Nenhuma outra origem possui permissão para acessar diretamente as instâncias.

> **Importante:** O banco de dados **não inicia conexões** com a aplicação. Portanto, não existe necessidade de liberar a porta 5432 no Security Group das instâncias EC2.

---

## Regras de Saída (Outbound)

### Comunicação com o Banco

| Porta | Destino    | Finalidade                   |
| ----- | ---------- | ---------------------------- |
| 5432  | sg_prod_bd | Comunicação com o PostgreSQL |

### Comunicação com Serviços AWS

| Porta | Destino      | Finalidade                                                                                                |
| ----- | ------------ | --------------------------------------------------------------------------------------------------------- |
| 443   | Serviços AWS | Amazon ECR, CloudWatch, Secrets Manager, Systems Manager, SNS e demais serviços utilizados pela aplicação |

Na proposta **Low-Cost**, essa comunicação ocorre por meio dos **VPC Endpoints**.

Na proposta **Maior Investimento**, a comunicação ocorre através do **NAT Gateway**, permitindo acesso seguro aos serviços públicos da AWS.

---

# Security Group do Banco de Dados

## Identificação

```text
sg_prod_bd
```

Associado à instância Amazon RDS PostgreSQL.

O banco de dados permanece completamente isolado da Internet, aceitando conexões exclusivamente da camada de aplicação.

---

## Regras de Entrada (Inbound)

| Porta | Protocolo | Origem      | Finalidade             |
| ----- | --------- | ----------- | ---------------------- |
| 5432  | TCP       | sg_prod_app | Comunicação PostgreSQL |

---

## Regras de Saída (Outbound)

Como o Amazon RDS não inicia conexões para a aplicação, não são necessárias regras específicas de saída além das padrões gerenciadas pelo serviço.

---

# Fluxo de Comunicação

O fluxo autorizado entre os Security Groups ocorre da seguinte forma:

```text
Usuário

        │

        ▼

Cloudflare / CloudFront

        │

        ▼

Application Load Balancer

        │

        ▼

sg_prod_alb

        │

        ▼

sg_prod_app

        │

        ▼

sg_prod_bd
```

Nenhuma comunicação direta entre Internet e EC2, ou entre Internet e Amazon RDS, é permitida.

---

# Comunicação com Serviços AWS

## Proposta Low-Cost

A arquitetura utiliza **VPC Endpoints**, permitindo que as instâncias EC2 acessem serviços da AWS sem utilizar Internet pública.

Fluxo simplificado:

```text
EC2

        │

        ▼

VPC Endpoint

        │

        ▼

Amazon ECR

CloudWatch

Secrets Manager

SNS
```

Essa abordagem reduz custos de transferência de dados e elimina a necessidade de um NAT Gateway.

---

## Proposta Maior Investimento

A arquitetura utiliza um **NAT Gateway**, permitindo que as instâncias privadas acessem os serviços públicos da AWS mantendo o isolamento da camada de aplicação.

Fluxo simplificado:

```text
EC2

        │

        ▼

NAT Gateway

        │

        ▼

Amazon ECR

CloudWatch

Secrets Manager

Systems Manager

SNS
```

---

# Princípio do Menor Privilégio

Todas as regras seguem o princípio de menor privilégio.

Cada Security Group comunica-se apenas com os recursos estritamente necessários para sua operação.

Resumo:

```text
sg_prod_alb

↓

Apenas sg_prod_app

------------------------

sg_prod_app

↓

Apenas sg_prod_bd

↓

Serviços AWS (HTTPS)

------------------------

sg_prod_bd

↓

Apenas conexões provenientes do sg_prod_app
```

Essa segmentação reduz significativamente os riscos decorrentes de movimentação lateral em caso de comprometimento de algum recurso.

---

# Boas Práticas Adotadas

* Separação lógica por camada da aplicação;
* Instâncias EC2 mantidas exclusivamente em sub-redes privadas;
* Banco de dados completamente isolado da Internet;
* Comunicação entre camadas utilizando referências entre Security Groups;
* Eliminação de acessos diretos às instâncias;
* Utilização apenas das portas estritamente necessárias;
* Restrição das regras de saída para comunicação com o banco e serviços da AWS;
* Aplicação do princípio do menor privilégio.

---

# Comparativo das Arquiteturas

| Característica                       | Low-Cost      | Maior Investimento |
| ------------------------------------ | ------------- | ------------------ |
| Security Group ALB                   | Sim           | Sim                |
| Security Group EC2                   | Sim           | Sim                |
| Security Group RDS                   | Sim           | Sim                |
| Comunicação privada com serviços AWS | VPC Endpoints | NAT Gateway        |
| Instâncias públicas                  | Não           | Não                |
| Banco acessível pela Internet        | Não           | Não                |

---

# Considerações Finais

A estratégia de Security Groups adotada fornece isolamento entre as diferentes camadas da infraestrutura, permitindo apenas os fluxos indispensáveis para o funcionamento da aplicação.

A utilização de Security Groups independentes para o Application Load Balancer, camada de aplicação e banco de dados simplifica o gerenciamento das permissões, reduz a superfície de ataque e facilita futuras expansões da arquitetura.

Aliada ao uso de sub-redes privadas, IAM Roles, VPC Endpoints ou NAT Gateway, essa abordagem atende às boas práticas recomendadas pela AWS para ambientes de produção, equilibrando segurança, simplicidade operacional e facilidade de manutenção.
