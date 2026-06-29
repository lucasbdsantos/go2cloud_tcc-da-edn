# Amazon EC2 Launch Template

## Visão Geral

O **Amazon EC2 Launch Template** é o recurso responsável por definir o padrão de provisionamento das instâncias EC2 utilizadas pela camada de aplicação da plataforma **EscolaTech**.

Seu objetivo é garantir que todas as instâncias iniciadas pelo **Amazon EC2 Auto Scaling Group (ASG)** sejam criadas com configurações padronizadas, reduzindo erros operacionais e permitindo atualizações consistentes da infraestrutura.

Nas duas arquiteturas propostas (**Low Cost** e **Maior Investimento**), o Launch Template possui praticamente a mesma configuração. A principal diferença entre as propostas está na infraestrutura de rede e nos serviços complementares utilizados, enquanto o processo de provisionamento das instâncias permanece padronizado.

---

# Objetivos

O Launch Template possui as seguintes responsabilidades:

* Padronizar a criação das instâncias EC2;
* Definir o sistema operacional utilizado pela aplicação;
* Definir o tipo da instância;
* Configurar o volume de armazenamento;
* Associar o Security Group da aplicação;
* Executar automaticamente o User Data durante o boot da instância;
* Servir como base para o Auto Scaling Group.

---

# Arquiteturas Utilizadas

| Arquitetura        | Utiliza Launch Template |
| ------------------ | ----------------------- |
| Low Cost           | ✔ Sim                   |
| Maior Investimento | ✔ Sim                   |

Em ambas as arquiteturas, o Launch Template é utilizado pelo Auto Scaling Group para provisionar novas instâncias sempre que houver necessidade de substituição ou escalabilidade horizontal.

---

# Configuração da Instância

## Sistema Operacional

| Configuração             | Valor                   |
| ------------------------ | ----------------------- |
| Sistema Operacional Base | Ubuntu Server 24.04 LTS |
| Tipo da Imagem           | AMI Customizada         |
| Arquitetura              | x86_64                  |

A base do Launch Template utiliza o **Ubuntu Server 24.04 LTS**, escolhido por seu longo ciclo de suporte (Long Term Support), estabilidade e ampla compatibilidade com aplicações containerizadas.

Antes de ser utilizada pelo Auto Scaling Group, essa imagem é personalizada para atender aos requisitos da aplicação. Durante esse processo são realizados procedimentos como instalação e atualização do Docker, instalação de dependências do sistema operacional e demais componentes necessários para a execução da aplicação.

Após a preparação do ambiente, essa configuração é armazenada como uma **Amazon Machine Image (AMI) customizada**, que passa a ser utilizada pelo Launch Template no provisionamento das novas instâncias. Essa abordagem reduz significativamente o tempo de inicialização (bootstrap), padroniza o ambiente e garante maior consistência entre todas as instâncias da camada de aplicação.

---

## Tipo da Instância

| Configuração | Valor    |
| ------------ | -------- |
| Família      | t3       |
| Tipo         | t3.micro |

A instância **t3.micro** foi selecionada por apresentar baixo custo operacional e capacidade suficiente para suportar a aplicação proposta neste projeto.

Essa configuração também é compatível com o Free Tier da AWS (quando aplicável) e pode ser facilmente substituída por instâncias de maior capacidade sem alterações na arquitetura.

---

## Armazenamento

| Configuração          | Valor      |
| --------------------- | ---------- |
| Volume                | Amazon EBS |
| Tipo                  | gp3        |
| Capacidade Inicial    | 8 GB       |
| Delete on Termination | Habilitado |

O Launch Template utiliza um volume **Amazon EBS do tipo gp3**, que oferece melhor relação entre desempenho e custo quando comparado às gerações anteriores.

Foi definido inicialmente um volume de **8 GB**, considerando que a aplicação executa em containers Docker e mantém a persistência dos dados no Amazon RDS, reduzindo a necessidade de armazenamento local.

Entretanto, essa configuração não é fixa. Conforme o crescimento da aplicação, aumento do número de containers, necessidade de armazenamento de logs locais ou novos requisitos operacionais, a capacidade do volume poderá ser ampliada para atender à demanda, sem necessidade de alterações significativas na arquitetura da solução.

---

# Configuração de Rede

O Launch Template **não define configurações de rede**.

As interfaces de rede são atribuídas automaticamente pelo **Auto Scaling Group**, respeitando a configuração das sub-redes privadas da VPC.

Também não são definidos:

* Endereço IP público;
* Elastic IP;
* Interface de rede específica.

Essa abordagem aumenta a flexibilidade da infraestrutura e permite que as instâncias sejam iniciadas em qualquer subnet privada configurada pelo Auto Scaling Group.

---

# Par de Chaves (Key Pair)

Nenhum par de chaves SSH é associado ao Launch Template.

A administração das instâncias é realizada exclusivamente por meio do **AWS Systems Manager (SSM)**, eliminando a necessidade de acesso SSH e reduzindo a superfície de ataque da infraestrutura.

---

# Security Group

O Launch Template associa o Security Group da camada de aplicação.

| Configuração   | Valor       |
| -------------- | ----------- |
| Security Group | sg_prod_app |

O Security Group controla todo o tráfego permitido para as instâncias EC2.

## Regras de Entrada (Inbound)

| Porta | Protocolo | Origem                    | Finalidade                      |
| ----- | --------- | ------------------------- | ------------------------------- |
| 80    | TCP       | Application Load Balancer | Tráfego HTTP                    |
| 443   | TCP       | Application Load Balancer | Tráfego HTTPS                   |
| 5432  | TCP       | Amazon RDS PostgreSQL     | Comunicação com banco de dados* |

> **Observação:** na prática, aplicações web normalmente iniciam conexões para o banco de dados. Assim, a implementação mais comum consiste em permitir a comunicação da aplicação com o Amazon RDS por meio de regras complementares entre os Security Groups, restringindo o acesso exclusivamente aos recursos autorizados.

## Regras de Saída (Outbound)

As regras de saída permitem comunicação com os serviços necessários para o funcionamento da aplicação, incluindo:

* Amazon Elastic Container Registry (ECR);
* Amazon CloudWatch;
* AWS Systems Manager;
* Amazon Secrets Manager;
* Amazon RDS PostgreSQL;
* Demais serviços acessados por meio de VPC Endpoints ou NAT Gateway, conforme a arquitetura utilizada.

---

# User Data

O Launch Template utiliza um script de **User Data** executado automaticamente durante a inicialização da instância.

Sua responsabilidade é preparar o ambiente para execução da aplicação.

O script realiza apenas as operações necessárias para obtenção da versão mais recente da aplicação armazenada no Amazon Elastic Container Registry (ECR).

Entre as atividades executadas estão:

* autenticação no Amazon ECR;
* download (pull) das imagens Docker da aplicação;
* preparação do ambiente para execução dos containers.

Toda a lógica de instalação do sistema operacional, configuração da instância e instalação do Docker é considerada parte da imagem base (AMI), mantendo o processo de inicialização mais rápido e padronizado.

---

# Integração com o Auto Scaling Group

O Launch Template é utilizado diretamente pelo Auto Scaling Group.

Sempre que houver necessidade de:

* criação de novas instâncias;
* substituição automática de instâncias;
* Instance Refresh;
* escalabilidade horizontal;

o Auto Scaling Group utilizará este Launch Template como referência para provisionamento.

Isso garante que todas as instâncias mantenham exatamente a mesma configuração.

---

# Relação com as Arquiteturas

## Proposta Low Cost

Na arquitetura de baixo custo, o Launch Template é utilizado para criar instâncias EC2 localizadas em sub-redes privadas, atrás de um Application Load Balancer.

A comunicação com serviços da AWS ocorre por meio dos VPC Endpoints definidos para essa arquitetura.

---

## Proposta Maior Investimento

Na arquitetura de maior investimento, o Launch Template mantém exatamente a mesma configuração.

As diferenças concentram-se na infraestrutura ao redor das instâncias, incluindo serviços como Amazon CloudFront, Amazon Cognito, NAT Gateway, AWS GuardDuty e demais componentes adicionais.

Essa estratégia permite reutilizar o mesmo padrão de provisionamento, simplificando a administração e reduzindo o esforço de manutenção entre os diferentes ambientes.

---

# Benefícios da Utilização do Launch Template

* Padronização da configuração das instâncias EC2;
* Provisionamento automatizado;
* Utilização de AMI customizada para reduzir o tempo de inicialização;
* Integração nativa com Auto Scaling Group;
* Facilidade de atualização por meio de novas versões do Launch Template;
* Redução de erros operacionais;
* Reutilização da mesma configuração entre diferentes ambientes;
* Suporte a processos automatizados de escalabilidade e substituição de instâncias.
