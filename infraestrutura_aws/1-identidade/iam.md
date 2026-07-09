# AWS Identity and Access Management (IAM)

### Visão Geral

O AWS Identity and Access Management (IAM) é o serviço responsável pelo gerenciamento de identidades e permissões dentro da infraestrutura AWS da plataforma **EscolaTech**.

Neste projeto, o IAM é utilizado para controlar o acesso dos integrantes da equipe aos recursos da infraestrutura, garantindo que cada usuário possua apenas as permissões necessárias para desempenhar suas atividades.

A estratégia adotada segue o princípio do **Menor Privilégio (Principle of Least Privilege)**, utilizando grupos IAM para centralizar o gerenciamento das permissões, facilitar a administração dos usuários e manter um ambiente seguro, organizado e alinhado às boas práticas recomendadas pela AWS.

A estrutura de IAM foi projetada para atender **igualmente as duas arquiteturas propostas do projeto (Low Cost e Maior Investimento)**. Independentemente da infraestrutura de rede, dos serviços adicionais utilizados ou do nível de investimento adotado, o modelo de gerenciamento de identidades e permissões permanece exatamente o mesmo, garantindo padronização, segurança e governança em ambos os cenários.

---

### Objetivos

O AWS IAM possui os seguintes objetivos:

* Controlar o acesso aos recursos da infraestrutura AWS.
* Aplicar o princípio do menor privilégio, concedendo apenas as permissões necessárias.
* Gerenciar identidades e permissões de usuários, através de grupos, funções (roles) e políticas do IAM.
* Segregar responsabilidades entre os diferentes perfis da equipe.
* Prover autenticação e autorização para acesso seguro aos serviços da AWS.

---

### Arquiteturas Utilizadas

</br>

| Arquitetura        | Utiliza IAM |
|:------------------:|:-----------:|
| Low Cost           | ✔ |
| Maior Investimento | ✔ |

O modelo de gerenciamento de identidades é exatamente o mesmo nas duas propostas arquiteturais.

Não existem diferenças de configuração entre os ambientes **Low Cost** e **Maior Investimento** quanto ao uso do AWS IAM. A estrutura de grupos, políticas e funções (IAM Roles) permanece padronizada em ambas as arquiteturas, garantindo consistência operacional, simplificando a administração dos acessos e facilitando a evolução da infraestrutura ao longo do projeto.

---

### Estrutura de Grupos do IAM

A administração dos usuários é realizada por meio de quatro grupos principais, organizados conforme as responsabilidades de cada perfil da equipe.

| Grupo | Finalidade |
| ------ | ---------- |
| **grp-admin** | Administração completa da conta AWS |
| **grp-architect** | Arquitetura e governança da infraestrutura |
| **grp-operator** | Operação da infraestrutura |
| **grp-readonly** | Consulta e auditoria dos recursos |

---
</br>

## Grupos do IAM

### 1. grp-admin

#### Descrição

Grupo destinado aos administradores da conta AWS.

#### Política Associada

| Política |
| -------- |
| AdministratorAccess |

#### Responsabilidades

* Gerenciar todos os recursos da conta AWS.
* Criar, alterar e remover recursos.
* Administrar usuários, grupos, roles e políticas IAM.
* Gerenciar configurações de faturamento.
* Administrar AWS Organizations.
* Gerenciar configurações globais da conta.

#### Nível de Acesso

Os usuários pertencentes ao grupo **grp-admin** possuem acesso administrativo completo à conta AWS.

---

### 2. grp-architect

#### Descrição

Grupo destinado aos arquitetos responsáveis pelo planejamento, implantação e governança da infraestrutura AWS.

#### Políticas Associadas

| Política |
| -------- |
| AdministratorAccess |
| Deny-Architect |

#### Responsabilidades

* Projetar e implementar a arquitetura da solução.
* Gerenciar recursos de rede.
* Administrar recursos computacionais.
* Gerenciar bancos de dados.
* Configurar monitoramento.
* Administrar usuários, grupos, roles e políticas IAM.
* Aplicar controles de segurança e governança.


#### Serviços Administrados

##### 1.1 Rede

* Amazon VPC
* Subnets Públicas
* Subnets Privadas
* Internet Gateway
* Route Tables
* Security Groups

##### 1.2 Computação

* Amazon EC2
* Launch Templates
* Auto Scaling Groups
* Application Load Balancer

##### 1.3 Banco de Dados

* Amazon RDS

##### 1.4 Monitoramento

* Amazon CloudWatch

##### 1.5 Identidade

* IAM Users
* IAM Groups
* IAM Roles
* IAM Policies

##### 1.6 Governança

* AWS Budgets
* Cost Explorer
* Cost and Usage Reports
* Tags


#### Restrições

Os usuários pertencentes ao grupo **grp-architect** não possuem acesso às seguintes funcionalidades:

* AWS Support.
* AWS Organizations.
* Configurações administrativas da conta.
* Alteração do plano de suporte AWS.
* Gerenciamento corporativo da conta.


#### Política de Restrição

Para limitar o acesso administrativo à conta AWS é utilizada uma política personalizada denominada **Deny-Architect**.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "DenySupportAndAccountManagement",
            "Effect": "Deny",
            "Action": [
                "support:*",
                "organizations:*",
                "account:*",
                "aws-portal:*"
            ],
            "Resource": "*"
        }
    ]
}
```

Essa política permite que os arquitetos tenham controle total sobre a infraestrutura do projeto, porém impede alterações relacionadas à administração da conta AWS.

---

### 3. grp-operator

#### Descrição

Grupo destinado aos profissionais responsáveis pela operação diária da infraestrutura.

#### Políticas Associadas

| Política |
| -------- |
| AmazonEC2FullAccess |
| AmazonVPCFullAccess |
| ElasticLoadBalancingFullAccess |
| AutoScalingFullAccess |
| AmazonRDSFullAccess |
| CloudWatchFullAccess |
| ResourceGroupsAndTagEditorFullAccess |
| AWSBillingReadOnlyAccess |

#### Responsabilidades

* Gerenciar instâncias EC2.
* Operar Auto Scaling Groups.
* Administrar recursos de rede.
* Configurar Application Load Balancer.
* Administrar bancos de dados Amazon RDS.
* Monitorar recursos utilizando Amazon CloudWatch.
* Gerenciar tags.
* Consultar custos e orçamentos.

#### Restrições

Os usuários deste grupo não possuem permissões para:

* IAM Users.
* IAM Groups.
* IAM Roles.
* IAM Policies.
* AWS Organizations.
* Configurações administrativas da conta.

Dessa forma, os operadores possuem autonomia para administrar toda a infraestrutura do projeto sem acesso às configurações críticas da conta AWS.

---

### 4. grp-readonly

#### Descrição

Grupo destinado aos usuários que necessitam apenas visualizar os recursos da infraestrutura.

#### Política Associada

| Política |
| -------- |
| ReadOnlyAccess |

#### Responsabilidades

* Consultar configurações da infraestrutura.
* Visualizar recursos de rede.
* Consultar instâncias EC2.
* Consultar bancos de dados Amazon RDS.
* Visualizar métricas do CloudWatch.
* Apoiar auditorias e documentação técnica.

#### Restrições

Os usuários deste grupo não podem:

* Criar recursos.
* Alterar configurações.
* Excluir recursos.
* Modificar políticas de segurança.
* Executar ações administrativas.

---

</br>

## Padrão de Nomenclatura dos Usuários

Todos os usuários IAM seguem o padrão:

```text
nome.sobrenome
```

#### Exemplos

* paulo.souza
* lucas.santos
* joao.silva
* maria.oliveira

### Hierarquia de Acesso

```text
grp-admin
└── AdministratorAccess

grp-architect
├── AdministratorAccess
└── Deny-Architect

grp-operator
├── AmazonEC2FullAccess
├── AmazonVPCFullAccess
├── ElasticLoadBalancingFullAccess
├── AutoScalingFullAccess
├── AmazonRDSFullAccess
├── CloudWatchFullAccess
├── ResourceGroupsAndTagEditorFullAccess
└── AWSBillingReadOnlyAccess

grp-readonly
└── ReadOnlyAccess
```

---
</br>

## Relação com as Arquiteturas

Embora as arquiteturas **Low Cost** e **Maior Investimento** apresentem diferenças relacionadas à conectividade, segurança de rede, monitoramento e serviços complementares da AWS, a estratégia de gerenciamento de identidades permanece exatamente a mesma.

Em ambas as propostas são utilizados:

* Os mesmos grupos IAM.
* As mesmas políticas gerenciadas e personalizadas.
* O mesmo padrão de nomenclatura para usuários.
* O mesmo modelo de segregação de responsabilidades.
* IAM Roles para acesso seguro das instâncias Amazon EC2 aos serviços AWS.

Essa padronização reduz a complexidade operacional, facilita a administração do ambiente e garante que a evolução entre as duas arquiteturas não exija alterações no modelo de controle de acesso.

---
</br>

## Benefícios da Implementação

A estratégia adotada para o AWS IAM proporciona os seguintes benefícios:

* Aplicação consistente do princípio do menor privilégio.
* Separação clara de responsabilidades entre os integrantes da equipe.
* Centralização do gerenciamento de permissões.
* Redução de riscos operacionais e de alterações indevidas.
* Maior segurança no gerenciamento da conta AWS.
* Facilidade para inclusão de novos integrantes na equipe.
* Melhor rastreabilidade das ações realizadas pelos usuários.
* Padronização do controle de acesso em toda a infraestrutura.
* Alinhamento com as melhores práticas de segurança e governança recomendadas pela AWS.

---
</br>

## Decisões Arquiteturais

As principais decisões relacionadas ao IAM foram:

### Utilização de Grupos IAM

As permissões são atribuídas aos grupos IAM, simplificando a administração dos usuários e reduzindo a possibilidade de erros de configuração.

---

### Aplicação do Princípio do Menor Privilégio

Cada grupo recebe apenas as permissões necessárias para execução de suas atividades, reduzindo riscos de segurança e limitando impactos decorrentes de alterações indevidas.

---

### Restrição das Funções Administrativas

Embora o grupo **grp-architect** possua acesso administrativo à infraestrutura, foi criada uma política personalizada de negação (**Deny-Architect**) para impedir alterações relacionadas à administração da conta AWS.

Essa estratégia permite autonomia técnica aos arquitetos sem comprometer a governança da conta.

---

### Utilização de IAM Roles

As instâncias Amazon EC2 utilizam **IAM Roles** para acessar serviços da AWS, como Amazon ECR, Amazon S3, AWS Systems Manager e Amazon Secrets Manager, eliminando a necessidade de armazenamento de credenciais na aplicação ou no sistema operacional.

Essa abordagem aumenta significativamente a segurança da infraestrutura e segue as recomendações da AWS para ambientes de produção.

---
</br>

## Resumo

O **AWS Identity and Access Management (IAM)** é o componente responsável pelo gerenciamento de identidades e permissões da infraestrutura AWS do projeto **EscolaTech**.

A mesma estratégia de IAM é utilizada nas arquiteturas **Low Cost** e **Maior Investimento**, garantindo padronização, segurança e governança independentemente da infraestrutura implantada.

Por meio da utilização de grupos IAM, políticas gerenciadas e personalizadas, além de IAM Roles para acesso seguro aos serviços da AWS, a solução proporciona um ambiente escalável, organizado e alinhado às melhores práticas recomendadas pela AWS para ambientes corporativos.