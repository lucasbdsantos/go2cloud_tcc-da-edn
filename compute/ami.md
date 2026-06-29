# Amazon Machine Image (AMI)

## Visão Geral

A **Amazon Machine Image (AMI)** é responsável por fornecer a imagem base utilizada para criação automática das instâncias EC2 pertencentes ao Auto Scaling Group nas duas propostas arquiteturais deste projeto.

Em vez de realizar toda a instalação da aplicação durante o processo de inicialização (*bootstrap*), foi adotada uma estratégia de **pré-provisionamento da AMI**, reduzindo significativamente o tempo necessário para disponibilização de novas instâncias e aumentando a confiabilidade do ambiente.

A imagem foi construída pela equipe de Infraestrutura em conjunto com a equipe de Desenvolvimento, utilizando como base uma imagem oficial da AWS contendo o **Ubuntu Server 24.04 LTS**.

---

# Objetivos da AMI

A utilização de uma AMI personalizada possui os seguintes objetivos:

* Reduzir o tempo de inicialização das instâncias;
* Evitar instalações demoradas durante o User Data;
* Garantir padronização entre todas as instâncias do ambiente;
* Facilitar o processo de Auto Scaling;
* Diminuir riscos de falhas causadas por indisponibilidade de repositórios externos;
* Permitir que novas instâncias estejam prontas para executar a aplicação poucos minutos após sua criação.

---

# Imagem Base

| Configuração        | Valor                                    |
| ------------------- | ---------------------------------------- |
| Sistema Operacional | Ubuntu Server 24.04 LTS                  |
| Origem              | Imagem Oficial AWS                       |
| Arquitetura         | x86_64                                   |
| Tipo                | Amazon Machine Image (AMI) personalizada |

A escolha do Ubuntu Server 24.04 LTS foi realizada devido ao seu longo ciclo de suporte (**Long Term Support - LTS**), estabilidade, ampla compatibilidade com aplicações Linux e excelente suporte ao Docker.

---

# Processo de Construção da AMI

A criação da AMI ocorre a partir de uma instância EC2 temporária.

Durante sua preparação são realizadas diversas etapas de configuração do servidor.

## Atualização do Sistema

Inicialmente são executadas atualizações de segurança e instalação das versões mais recentes dos pacotes do sistema operacional.

Essa etapa garante que todas as instâncias iniciem com um ambiente atualizado e seguro.

---

## Instalação do Docker

São instalados todos os componentes necessários para execução de containers Docker.

Entre eles:

* Docker Engine;
* Docker CLI;
* Docker Compose Plugin;
* Dependências do sistema;
* Configurações do serviço Docker.

Ao final da preparação, o serviço permanece habilitado para inicialização automática.

---

## Configuração do Ambiente

Também são realizadas configurações necessárias para funcionamento da aplicação, incluindo:

* criação de diretórios utilizados pela aplicação;
* configuração de permissões;
* instalação de bibliotecas auxiliares;
* ajustes do sistema operacional;
* preparação do ambiente para execução dos containers.

Essas configurações seguem os padrões definidos pela equipe de Infraestrutura e Desenvolvimento.

---

## Instalação do AWS Systems Manager Agent

Durante a preparação da imagem também é instalado o **AWS Systems Manager Agent (SSM Agent)**.

Sua presença na AMI permite que recursos do AWS Systems Manager sejam utilizados quando necessários, sem exigir reinstalação posterior do agente.

A utilização efetiva do Systems Manager dependerá da arquitetura implantada e dos recursos habilitados na infraestrutura.

---

---

# User Data

A AMI personalizada **não possui configurações de User Data incorporadas**, uma vez que esse mecanismo é definido durante a criação das instâncias por meio do **Launch Template**.

Essa separação permite que a mesma AMI seja reutilizada em diferentes cenários de implantação, mantendo a imagem responsável apenas pela padronização do sistema operacional e das dependências da aplicação, enquanto o processo de inicialização fica centralizado no Launch Template.

Dessa forma, o script de User Data pode ser alterado conforme a necessidade de cada arquitetura, sem que seja necessário gerar uma nova AMI.

Na proposta deste projeto, o User Data é responsável apenas por executar as tarefas necessárias durante a inicialização da instância, como a obtenção das imagens Docker atualizadas e a inicialização dos containers da aplicação, aproveitando toda a preparação previamente realizada na AMI personalizada.

---

# Utilização na Proposta Low-Cost

Na arquitetura **Low-Cost**, a mesma AMI personalizada é utilizada pelas instâncias pertencentes ao Auto Scaling Group.

Nessa proposta, o User Data realiza apenas o provisionamento das imagens Docker e a inicialização da aplicação, aproveitando toda a preparação previamente realizada na AMI.

Caso o AWS Systems Manager não seja utilizado nessa arquitetura, o agente permanecerá instalado, porém sem impacto no funcionamento da aplicação.

---

# Utilização na Proposta de Maior Investimento

Na arquitetura de **Maior Investimento**, a mesma AMI personalizada também é utilizada pelo Auto Scaling Group.

Entretanto, essa proposta pode habilitar recursos adicionais do AWS Systems Manager para administração das instâncias, permitindo funcionalidades como:

* acesso remoto sem SSH;
* execução de comandos;
* automação operacional;
* gerenciamento centralizado;
* aplicação de atualizações e tarefas administrativas.

Como o agente já está incorporado à AMI, basta habilitar os endpoints, permissões IAM e demais componentes necessários para utilização desses recursos.

---

# Benefícios da Estratégia

A utilização de uma AMI personalizada proporciona diversas vantagens operacionais para ambas as arquiteturas:

* padronização completa das instâncias;
* redução do tempo de provisionamento;
* inicialização mais rápida do Auto Scaling;
* menor dependência de downloads durante o bootstrap;
* maior previsibilidade no processo de implantação;
* redução de falhas durante criação de novas instâncias;
* simplificação do User Data;
* maior facilidade de manutenção da infraestrutura.

---

# Considerações Finais

A adoção de uma AMI personalizada representa uma boa prática para ambientes que utilizam Auto Scaling e infraestrutura automatizada.

Ao concentrar toda a preparação do sistema operacional, do Docker e das dependências da aplicação em uma imagem previamente validada, o processo de criação de novas instâncias torna-se mais rápido, confiável e consistente, permitindo que ambas as arquiteturas deste projeto mantenham um ambiente padronizado e preparado para atender às demandas da aplicação.
