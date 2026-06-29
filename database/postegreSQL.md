# PostgreSQL 16

## Visão Geral

O banco de dados utilizado em ambas as propostas arquiteturais deste projeto é o **PostgreSQL 16**, executado por meio do serviço **Amazon RDS (Relational Database Service)**.

O PostgreSQL é um Sistema Gerenciador de Banco de Dados Relacional (SGBDR) de código aberto, amplamente utilizado em ambientes corporativos devido à sua confiabilidade, desempenho, conformidade com o padrão SQL e recursos avançados para gerenciamento de dados.

Ao utilizar o Amazon RDS, toda a administração da infraestrutura do banco de dados passa a ser gerenciada pela AWS, incluindo instalação, atualizações, monitoramento, backups e recuperação automática em caso de falhas.

---

# Objetivos

A utilização do PostgreSQL 16 possui os seguintes objetivos:

* Armazenar de forma persistente os dados da aplicação;
* Garantir integridade e consistência das informações;
* Oferecer alta confiabilidade para operações de leitura e escrita;
* Utilizar um banco de dados amplamente adotado pelo mercado;
* Integrar-se aos serviços gerenciados da AWS.

---

# Utilização nas Arquiteturas do Projeto

## Proposta Low-Cost

Na proposta Low-Cost, o PostgreSQL 16 é executado através do Amazon RDS em uma configuração **Multi-AZ**, garantindo alta disponibilidade e recuperação automática em caso de falhas.

Essa abordagem permite que a infraestrutura mantenha um banco de dados robusto e confiável, mesmo em uma arquitetura otimizada para redução de custos.

---

## Proposta de Maior Investimento

Na proposta de maior investimento, o PostgreSQL 16 permanece com a mesma configuração e funcionalidades.

A principal diferença está na infraestrutura de suporte da aplicação, que possui componentes adicionais de redundância e disponibilidade. O banco de dados continua desempenhando o papel de armazenamento central das informações da aplicação.

---

# Principais Características

* Banco de dados relacional de código aberto;
* Compatibilidade com o padrão SQL;
* Alto desempenho para aplicações web;
* Suporte a transações ACID;
* Controle de concorrência por MVCC (Multi-Version Concurrency Control);
* Alta confiabilidade e estabilidade;
* Ampla documentação e comunidade ativa;
* Integração nativa com o Amazon RDS.

---

# Benefícios da Escolha

A adoção do PostgreSQL 16 proporciona diversas vantagens para o projeto:

* Solução amplamente utilizada em ambientes corporativos;
* Elevada confiabilidade para aplicações em produção;
* Facilidade de administração quando utilizado com o Amazon RDS;
* Excelente desempenho para aplicações web;
* Escalabilidade para futuras expansões da infraestrutura;
* Compatibilidade com ferramentas modernas de desenvolvimento e monitoramento.

---

# Considerações Finais

O PostgreSQL 16 foi escolhido por oferecer uma combinação entre desempenho, confiabilidade e recursos avançados de gerenciamento de dados. Sua execução por meio do Amazon RDS reduz a complexidade operacional da infraestrutura e contribui para uma arquitetura mais segura, resiliente e alinhada às boas práticas da AWS.

Dessa forma, tanto a proposta Low-Cost quanto a proposta de maior investimento utilizam a mesma tecnologia de banco de dados, diferenciando-se apenas pelos componentes de infraestrutura que compõem cada arquitetura.
