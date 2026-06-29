# Database RDS

## Visão Geral

O banco de dados da aplicação é executado utilizando o **Amazon Relational Database Service (Amazon RDS)** com o mecanismo **PostgreSQL 16**, oferecendo um serviço gerenciado para armazenamento persistente dos dados da aplicação.

O Amazon RDS elimina a necessidade de administração manual do sistema operacional, instalação do banco de dados, gerenciamento de atualizações, replicação, monitoramento da infraestrutura e recuperação automática em caso de falhas, permitindo que a equipe concentre seus esforços no desenvolvimento da aplicação.

Nas duas propostas arquiteturais deste projeto, o banco de dados permanece hospedado em uma infraestrutura Multi-AZ, garantindo alta disponibilidade e recuperação automática em caso de indisponibilidade da instância primária.

---

# Objetivos

A utilização do Amazon RDS possui os seguintes objetivos:

* Armazenar de forma persistente os dados da aplicação;
* Disponibilizar um banco de dados gerenciado pela AWS;
* Garantir alta disponibilidade através da implantação Multi-AZ;
* Automatizar tarefas administrativas do banco de dados;
* Permitir recuperação automática em caso de falhas;
* Integrar-se com os serviços de monitoramento e backup da AWS;
* Reduzir o esforço operacional relacionado à administração do banco de dados.

---

# Arquitetura da Solução

O banco de dados é implantado utilizando o recurso **Multi-AZ Deployment**, mantendo uma instância primária responsável pelo processamento das conexões da aplicação e uma instância secundária sincronizada em outra Availability Zone.

A replicação entre as duas instâncias ocorre de forma síncrona, garantindo que os dados gravados na instância principal também sejam registrados na instância de contingência antes da confirmação da transação.

Em caso de indisponibilidade da instância principal ou da Availability Zone onde ela está localizada, o Amazon RDS realiza automaticamente o processo de Failover, promovendo a instância secundária para assumir as conexões da aplicação.

---

# Funcionamento nas Arquiteturas do Projeto

## Proposta Low-Cost

Na arquitetura Low-Cost, o banco de dados permanece configurado em modo Multi-AZ, proporcionando um nível elevado de disponibilidade mesmo em um ambiente otimizado para redução de custos.

Características:

* Banco PostgreSQL totalmente gerenciado;
* Instância principal e standby distribuídas em duas Availability Zones;
* Comunicação restrita às instâncias da aplicação;
* Backup automatizado;
* Recuperação automática em caso de falhas;
* Snapshots conforme estratégia definida em **snapshot_db.md**.

Apesar da arquitetura priorizar redução de custos em outros componentes da infraestrutura, o banco de dados mantém elevada disponibilidade devido à criticidade dos dados armazenados.

---

## Proposta de Maior Investimento

Na proposta de maior investimento, o funcionamento do banco permanece idêntico.

A diferença está na infraestrutura ao redor do banco de dados, composta por componentes de rede altamente redundantes, aumentando a disponibilidade geral da aplicação.

O RDS continua responsável por:

* Persistência dos dados;
* Replicação síncrona entre Availability Zones;
* Failover automático;
* Recuperação automática;
* Backups automatizados;
* Snapshots periódicos.

---

# Configuração da Instância

## Identificação

| Configuração  | Valor       |
| ------------- | ----------- |
| Identificador | go2cloud-db |
| Engine        | PostgreSQL  |
| Versão        | 16          |
| Implantação   | Multi-AZ    |
| Classe        | db.t3.micro |

---

## Credenciais

| Configuração   | Valor                               |
| -------------- | ----------------------------------- |
| Usuário Master | postgres                            |
| Senha          | Gerenciada pelo AWS Secrets Manager |

As credenciais administrativas do banco de dados não são armazenadas diretamente na aplicação, sendo protegidas através do AWS Secrets Manager.

---

## Armazenamento

| Configuração | Valor          |
| ------------ | -------------- |
| Tipo         | Amazon EBS gp3 |
| Capacidade   | 20 GB          |

O armazenamento gp3 oferece baixa latência, desempenho consistente e possibilidade de expansão futura sem necessidade de recriação da instância.

---

# Configuração de Rede

O banco de dados está isolado em uma camada exclusiva da arquitetura.

| Configuração   | Valor             |
| -------------- | ----------------- |
| VPC            | vpc_prod          |
| Subnet A       | snet_bd_private_a |
| Subnet B       | snet_bd_private_b |
| Security Group | sg_bd_prod        |

A implantação em duas subnets distintas permite que o recurso Multi-AZ distribua automaticamente as instâncias entre Availability Zones diferentes.

---

# Controle de Acesso

O acesso ao banco de dados é realizado exclusivamente pelas instâncias EC2 da aplicação.

O Security Group **sg_bd_prod** permite conexões apenas provenientes dos recursos associados ao Security Group **sg_prod_app**.

Fluxo simplificado:

```text
Internet
    │
    ▼
Application Load Balancer
    │
    ▼
Instâncias EC2
(Security Group: sg_prod_app)
    │
    ▼
Security Group: sg_bd_prod
    │
    ▼
Amazon RDS PostgreSQL
```

Essa estratégia impede conexões externas diretamente ao banco de dados, aumentando a segurança da solução.

---

# Fluxo de Funcionamento

## Fluxo de Conexão da Aplicação

```text
Usuário
│
▼
Cloudflare ou AWS Services
│
▼
Application Load Balancer
│
▼
Instância EC2
│
▼
Aplicação Docker
│
▼
Conexão PostgreSQL
│
▼
Amazon RDS
│
▼
Leitura e gravação dos dados
```

Todas as operações de leitura e escrita são realizadas pela instância primária do banco de dados.

---

## Funcionamento do Multi-AZ

```text
            Aplicação
                │
                ▼
      Instância Primária
                │
     Replicação Síncrona
                │
                ▼
      Instância Standby
```

Cada transação somente é considerada concluída após ser gravada tanto na instância principal quanto na instância de contingência.

Essa abordagem reduz significativamente o risco de perda de dados.

---

## Processo de Failover

Em caso de falha da instância principal:

```text
Instância Primária
      │
      ▼
Falha detectada
      │
      ▼
Amazon RDS
      │
      ▼
Promove Standby
      │
      ▼
Nova Instância Primária
      │
      ▼
Aplicação reconecta automaticamente
```

Todo esse processo é realizado automaticamente pelo Amazon RDS, dispensando intervenção manual.

---

# Backup e Recuperação

A estratégia de proteção dos dados é composta por:

* Backups automáticos do Amazon RDS;
* Snapshots manuais;
* Snapshots automatizados;
* Recuperação Point-in-Time;
* Replicação síncrona Multi-AZ.

A política completa de snapshots encontra-se documentada no arquivo **snapshot_db.md**.

---

# Fluxo Completo do Banco de Dados

```text
                 Usuário
                     │
                     ▼
                Cloudflare ou AWS Serviçes
                     │
                     ▼
          Application Load Balancer
                     │
                     ▼
            Auto Scaling Group
                     │
                     ▼
             Instância EC2 Docker
                     │
                     ▼
          Security Group sg_prod_app
                     │
                     ▼
          Security Group sg_bd_prod
                     │
                     ▼
          Amazon RDS PostgreSQL 16
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
 Instância Primária      Instância Standby
      (AZ-A)                  (AZ-B)
         │
         ▼
 Replicação Síncrona
         │
         ▼
 Backups e Snapshots
```

---

# Segurança

O banco de dados adota diversas práticas para proteção das informações:

* Isolamento em subnets dedicadas;
* Comunicação restrita por Security Groups;
* Credenciais protegidas pelo AWS Secrets Manager;
* Ausência de acesso direto pela Internet;
* Replicação Multi-AZ;
* Backups automáticos;
* Snapshots periódicos.

Essas medidas reduzem significativamente a superfície de ataque e aumentam a confiabilidade da solução.

---

# Benefícios da Configuração

## Proposta Low-Cost

* Banco totalmente gerenciado;
* Alta disponibilidade através do Multi-AZ;
* Baixo esforço operacional;
* Recuperação automática;
* Persistência dos dados;
* Escalabilidade futura de armazenamento.

---

## Proposta de Maior Investimento

* Todos os benefícios da proposta Low-Cost;
* Maior resiliência da infraestrutura de rede;
* Maior disponibilidade geral da aplicação;
* Integração com uma arquitetura altamente redundante;
* Melhor continuidade operacional em cenários de falhas.

---

# Considerações Técnicas

O Amazon RDS PostgreSQL 16 foi escolhido por oferecer um ambiente gerenciado, seguro e altamente disponível para armazenamento dos dados da aplicação.

A utilização do modo **Multi-AZ**, aliada à replicação síncrona, backups automáticos, snapshots e gerenciamento das credenciais pelo AWS Secrets Manager, proporciona uma infraestrutura resiliente e alinhada às boas práticas recomendadas pela AWS para ambientes de produção.

Essa configuração reduz a complexidade operacional, aumenta a disponibilidade do serviço e garante maior proteção aos dados da aplicação, sendo adequada tanto para a proposta Low-Cost quanto para a arquitetura de maior investimento.
