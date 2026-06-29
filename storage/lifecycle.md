# Lifecycle Strategy

## Visão Geral

A estratégia de **Lifecycle** define as políticas automáticas de gerenciamento do ciclo de vida dos objetos armazenados no Amazon S3.

Seu objetivo é reduzir os custos de armazenamento ao longo do tempo, mantendo a disponibilidade dos arquivos conforme sua frequência de acesso e respeitando os períodos de retenção estabelecidos pela aplicação.

Neste projeto, as regras de Lifecycle são aplicadas aos diferentes tipos de arquivos armazenados no Amazon S3, permitindo que a movimentação entre classes de armazenamento ocorra automaticamente, sem necessidade de intervenção manual.

---

# Objetivos

A estratégia de Lifecycle possui os seguintes objetivos:

* Reduzir custos de armazenamento;
* Automatizar a movimentação dos objetos entre classes do Amazon S3;
* Garantir a retenção dos documentos pelo período necessário;
* Eliminar atividades manuais de gerenciamento dos arquivos;
* Manter alta durabilidade dos dados armazenados;
* Aplicar boas práticas de gerenciamento do ciclo de vida dos objetos.

---

# Estratégia Adotada

Todos os objetos enviados ao Amazon S3 são armazenados inicialmente utilizando a classe **Amazon S3 Intelligent-Tiering**.

Essa classe monitora continuamente o padrão de acesso aos objetos e realiza automaticamente a movimentação entre suas camadas internas de armazenamento, proporcionando economia sem necessidade de configuração manual para cada objeto.

Para os certificados emitidos pela instituição de ensino, uma política adicional de Lifecycle realiza a migração automática para o **Amazon S3 Glacier Deep Archive**, reduzindo significativamente os custos de armazenamento de longo prazo.

---

# Classes de Armazenamento Utilizadas

| Classe                  | Finalidade                                   |
| ----------------------- | -------------------------------------------- |
| S3 Intelligent-Tiering  | Armazenamento inicial de todos os arquivos   |
| S3 Glacier Deep Archive | Arquivamento de longo prazo dos certificados |

---

# Política por Tipo de Arquivo

## Backups do Banco de Dados

Os arquivos de backup lógico do PostgreSQL permanecem armazenados inicialmente em **Amazon S3 Intelligent-Tiering**, permitindo acesso rápido quando necessário e otimização automática dos custos conforme o padrão de utilização.

---

## Históricos Escolares

Os históricos escolares enviados pelos usuários permanecem armazenados em **Amazon S3 Intelligent-Tiering**, uma vez que podem ser consultados durante todo o período de permanência do aluno na instituição.

O gerenciamento automático entre as camadas internas dessa classe garante redução de custos sem comprometer a disponibilidade dos documentos.

---

## Certificados

Os certificados emitidos pela instituição possuem retenção de cinco anos.

Após o período inicial de maior utilização, uma regra de Lifecycle transfere automaticamente esses arquivos para o **Amazon S3 Glacier Deep Archive**, onde permanecem arquivados até o término da política de retenção.

Essa abordagem reduz significativamente os custos de armazenamento de documentos pouco acessados, preservando sua durabilidade e disponibilidade para recuperação quando necessário.

---

# Fluxo do Ciclo de Vida

```text id="9w8mfh"
Upload do Arquivo
        │
        ▼
Amazon S3 Intelligent-Tiering
        │
        ▼
Monitoramento Automático
do Padrão de Acesso
        │
        ▼
Lifecycle Policy
        │
        ▼
Glacier Deep Archive
(apenas certificados)
        │
        ▼
Retenção por 5 anos
```

---

# Funcionamento da Política

O gerenciamento do ciclo de vida ocorre automaticamente pelo Amazon S3.

Fluxo simplificado:

```text id="y2n5vk"
Arquivo enviado
        │
        ▼
Amazon S3
        │
        ▼
Objeto armazenado
em Intelligent-Tiering
        │
        ▼
Verificação das regras
de Lifecycle
        │
        ▼
Objeto elegível?
      │           │
     Não         Sim
      │           │
      ▼           ▼
Permanece     Glacier
na classe     Deep Archive
atual
```

Todo o processo é realizado automaticamente pelo serviço, sem necessidade de intervenção administrativa.

---

# Benefícios

A estratégia de Lifecycle oferece diversas vantagens para a infraestrutura da aplicação:

* Redução automática dos custos de armazenamento;
* Maior eficiência no gerenciamento dos objetos;
* Eliminação de processos manuais;
* Elevada durabilidade dos arquivos;
* Armazenamento otimizado conforme o padrão de acesso;
* Arquivamento econômico para documentos de longa retenção;
* Facilidade de administração do ambiente.

---

# Aplicação nas Arquiteturas

## Proposta Low-Cost

Na proposta Low-Cost, o Lifecycle é utilizado para reduzir custos de armazenamento dos arquivos enviados pelos usuários e dos certificados emitidos pela instituição, mantendo uma solução simples e eficiente.

---

## Proposta de Maior Investimento

Na proposta de maior investimento, a estratégia permanece a mesma, atendendo também aos objetos utilizados pelo CloudFront e aos arquivos de monitoramento armazenados no Amazon S3.

Embora o volume de dados seja maior, a política de Lifecycle continua contribuindo para a otimização dos custos operacionais e para o gerenciamento automatizado do armazenamento.

---

# Considerações Finais

A utilização das políticas de Lifecycle do Amazon S3 permite automatizar o gerenciamento do ciclo de vida dos objetos, reduzindo custos sem comprometer a segurança, a disponibilidade ou a durabilidade das informações.

Neste projeto, a combinação entre **Amazon S3 Intelligent-Tiering** e **Amazon S3 Glacier Deep Archive** proporciona uma estratégia equilibrada para armazenamento de documentos, backups e certificados, alinhada às boas práticas recomendadas para ambientes de pequenas e médias empresas hospedados na AWS.
