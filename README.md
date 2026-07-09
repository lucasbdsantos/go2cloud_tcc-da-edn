# Go2Cloud: Arquitetura Multicamada na AWS
<img width="1300" height="700" alt="Image" src="https://github.com/user-attachments/assets/a00376c3-0e15-4c3b-ba7f-9904f237c7bf" />

## Descrição
Este projeto é o TCC da Escola da Nuvem. Ele apresenta o design e a implementação de uma infraestrutura de nuvem robusta, escalável e segura na AWS. O foco central é a comparação entre duas abordagens arquiteturais: uma **Low-Cost** (otimizando custos com Cloudflare e VPC Endpoints) e uma **Enterprise** (totalmente integrada com serviços nativos AWS como CloudFront, Route 53 e WAF). A plataforma educacional **EscolaTech** é utilizada como aplicação de referência para validar a infraestrutura.

## 📂 Estrutura do Repositório

O repositório está organizado para separar as camadas de aplicação e as definições arquiteturais da infraestrutura:

```text
├── site/                        # Código-fonte da aplicação EscolaTech
│   ├── frontend/                # Interface em Next.js
│   └── backend/                 # API em Node.js/Express
├── infraestrutura_aws/          # Documentação da infraestrutura
│   ├── 1-identidade/            # Gestão de acessos e IAM
│   ├── 2-computacao/            # Auto Scaling e instâncias EC2
│   ├── 3-armazenamento/         # Políticas de S3 e Lifecycle
│   ├── 4-banco_de_dados/        # Configurações de RDS e Backups
│   ├── 5-rede/                  # VPC, Subnets e Roteamento
│   └── arquiteturas/            # Propostas de implementação
│       ├── menor_custo/         # Arquitetura Low-Cost
│       └── maior_custo/         # Arquitetura Enterprise
```

## 💻 O Site Estático (Front-end & Back-end)

A aplicação foi desenvolvida com foco em performance e segurança, utilizando tecnologias modernas para garantir uma experiência fluida:

*   **Front-end (Next.js):** Interface responsiva baseada em um design system "Cloud Native Dark", utilizando **Tailwind CSS** para estilização e **TypeScript** para maior robustez. Opera na porta **3001**.
*   **Back-end (Node.js/Express):** API REST que gerencia as regras de negócio e autenticação. Implementa **Connection Pooling (pg Pool)** para otimização de consultas ao banco de dados. Opera na porta **3000**.
*   **Banco de Dados (PostgreSQL 16):** Persistência de dados com indexação estratégica em campos críticos (como e-mail e user_id) para garantir escalabilidade.
*   **Segurança da Aplicação:** Autenticação via **JWT** (tokens com 7 dias de expiração), hash de senhas com **bcryptjs** e proteção contra SQL Injection via queries parametrizadas.

## ☁️ Infraestrutura AWS

A infraestrutura é baseada em uma **Amazon VPC** segmentada em sub-redes públicas e privadas, distribuídas em duas **Availability Zones** para garantir tolerância a falhas. O projeto oferece duas abordagens:

### 1. Arquitetura de Menor Custo (Low-Cost)
Focada em eficiência financeira e simplicidade operacional, ideal para startups e pequenas empresas.

*   **Cloudflare:** Centraliza os serviços de **DNS, CDN e WAF**, substituindo serviços nativos pagos da AWS (Route 53, CloudFront e AWS WAF).
*   **VPC Endpoints:** Permite que as instâncias EC2 acessem serviços AWS (S3, ECR, Secrets Manager) de forma privada, eliminando a necessidade e o custo de um **NAT Gateway**.
*   **Amazon EC2 & Auto Scaling:** Gerenciamento de containers Docker com escalabilidade horizontal automática baseada em demanda.
*   **Amazon RDS Multi-AZ:** Banco de dados gerenciado com alta disponibilidade e failover automático.

### Diagrama da arquitetura de Menor custo
<img width="1216" height="1280" alt="Image" src="https://github.com/user-attachments/assets/7a40ec2f-fafa-4983-bb4c-7289be0de6a8" />

### 2. Arquitetura de Maior Investimento (Enterprise)
Prioriza performance global, resiliência total e observabilidade avançada, seguindo as melhores práticas para ambientes corporativos críticos.

*   **Amazon Route 53 & CloudFront:** Resolução DNS nativa e rede de entrega de conteúdo global com baixíssima latência.
*   **AWS WAF & Shield:** Proteção avançada contra ataques na camada de aplicação e mitigação de DDoS.
*   **Amazon Cognito:** Delega a gestão de identidades para um serviço gerenciado, facilitando recursos como **MFA (Autenticação Multifator)**.
*   **NAT Gateway:** Fornece acesso controlado à internet para instâncias em sub-redes privadas, permitindo atualizações de sistema e download de dependências externas.
*   **Observabilidade Avançada:** Inclui **CloudWatch Logs, Dashboards e Alarmes**, além de auditoria completa via **AWS Config** e **CloudTrail**.

### Diagrama da arquitetura de Maior custo
<img width="1221" height="1220" alt="Image" src="https://github.com/user-attachments/assets/fa01feed-ce63-48b9-a195-2681d7f581a4" />

</br>

## 🚀 Como Entender e Executar o Projeto

### Navegação na Documentação
Para entender as decisões de design, recomenda-se a leitura dos arquivos dentro de `infraestrutura_aws/arquiteturas/`, que detalham os fluxos de tráfego e justificativas de custo.

### Execução Local
A aplicação pode ser executada localmente utilizando **Docker Compose**, o que garante que o ambiente de desenvolvimento seja idêntico ao de produção:
1. Configure as variáveis de ambiente baseadas no arquivo `.env.example`.
2. Execute o comando `docker-compose up -d`.
3. Acesse o Frontend em `localhost:3001` e a API em `localhost:3000/api`.

### Deploy em Produção
O fluxo de deploy é automatizado via pipeline de **CI/CD**: push para o GitHub aciona o **AWS CodeBuild**, que gera a imagem Docker, armazena no **Amazon ECR** e atualiza as instâncias via **AWS Systems Manager**.

## 🧑🏻‍💻 Autores
Desenvolvido por: Cassiano Moura, Lucas Rafael, Lucas Santos, Matheus Luiz, [@Paulo Souza](https://github.com/prsouza91) e Vinicius Vasconcelos.
