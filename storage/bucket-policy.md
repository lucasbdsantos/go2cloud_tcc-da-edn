# Bucket Policy

## Visão Geral

A **Bucket Policy** define as regras de acesso ao bucket Amazon S3 utilizado pela aplicação. Seu principal objetivo é controlar quais identidades da AWS podem acessar os objetos armazenados, quais operações são permitidas e sob quais condições esse acesso pode ocorrer.

Neste projeto, o bucket é utilizado para armazenar arquivos estáticos da aplicação, como imagens, documentos e demais conteúdos enviados pelos usuários, servindo como camada de armazenamento altamente disponível, escalável e durável.

A política foi elaborada seguindo o princípio de **Least Privilege (Privilégio Mínimo)**, concedendo apenas as permissões estritamente necessárias para o funcionamento da aplicação.

---

# Objetivos

A Bucket Policy possui os seguintes objetivos:

* Restringir o acesso apenas aos serviços autorizados;
* Impedir acesso público aos objetos;
* Permitir leitura apenas quando necessária;
* Permitir gravação apenas pela aplicação;
* Garantir maior segurança dos dados armazenados;
* Reduzir riscos de exposição acidental de informações.

---

# Estratégia de Segurança

O bucket será configurado com o recurso **Block Public Access** totalmente habilitado.

## Configuração

| Configuração                    | Valor      |
| ------------------------------- | ---------- |
| Block Public ACLs               | Habilitado |
| Ignore Public ACLs              | Habilitado |
| Block Public Bucket Policies    | Habilitado |
| Restrict Public Bucket Policies | Habilitado |

Essa configuração impede que ACLs ou políticas públicas exponham os objetos armazenados na Internet.

---

# Controle de Acesso

O acesso ao bucket será realizado exclusivamente por identidades IAM autorizadas.

As permissões serão concedidas por meio de IAM Roles associadas às instâncias EC2 responsáveis pela execução da aplicação.

Fluxo simplificado:

```text
EC2

│

▼

IAM Role

│

▼

Amazon S3
```

Dessa forma, nenhuma credencial permanente será armazenada na aplicação, utilizando credenciais temporárias fornecidas automaticamente pelo serviço IAM.

---

# Permissões da Aplicação

A aplicação necessita apenas das operações essenciais para manipular os arquivos armazenados.

## Permissões Permitidas

| Ação            | Finalidade                            |
| --------------- | ------------------------------------- |
| s3:GetObject    | Download de arquivos                  |
| s3:PutObject    | Upload de arquivos                    |
| s3:DeleteObject | Exclusão de arquivos                  |
| s3:ListBucket   | Listagem de objetos quando necessária |

Nenhuma permissão administrativa será concedida à aplicação.

---

# Princípio do Menor Privilégio

A política será limitada exclusivamente ao bucket utilizado pela aplicação.

Exemplo conceitual:

```text
Permitido

Bucket da Aplicação

✔ GetObject

✔ PutObject

✔ DeleteObject

✔ ListBucket

-----------------------------

Negado

Outros Buckets

✖ Sem acesso
```

Essa abordagem reduz significativamente o impacto de possíveis falhas de configuração ou comprometimento da aplicação.

---

# Proteção contra Exclusão Acidental

Como complemento à política de acesso, recomenda-se habilitar o Versionamento do bucket.

Com o versionamento ativo:

* exclusões tornam-se reversíveis;
* alterações em arquivos mantêm versões anteriores;
* recuperações podem ser realizadas rapidamente.

Essa funcionalidade aumenta significativamente a resiliência do armazenamento.

---

# Criptografia

Todos os objetos armazenados deverão permanecer criptografados em repouso.

## Configuração

| Configuração           | Valor      |
| ---------------------- | ---------- |
| Server-Side Encryption | Habilitado |
| Método                 | SSE-S3     |

Em ambientes com maiores requisitos de segurança, poderá ser utilizada criptografia baseada em AWS KMS (SSE-KMS).

---

# Comunicação Segura

Toda comunicação entre a aplicação e o bucket deverá ocorrer utilizando HTTPS.

O acesso por conexões não criptografadas deverá ser bloqueado pela Bucket Policy.

Fluxo permitido:

```text
Aplicação

HTTPS (TLS)

↓

Amazon S3
```

Fluxo bloqueado:

```text
Aplicação

HTTP

↓

Acesso Negado
```

Essa configuração protege os dados durante a transmissão.

---

# Auditoria

As operações realizadas no bucket poderão ser registradas utilizando serviços nativos da AWS, permitindo rastreabilidade e auditoria das ações executadas.

Entre os eventos monitorados destacam-se:

* Upload de arquivos;
* Download de arquivos;
* Exclusão de objetos;
* Alterações nas permissões do bucket.

Esses registros auxiliam na identificação de incidentes de segurança e na análise de eventos operacionais.

---

# Arquitetura de Acesso

```text
Usuário

│

▼

Aplicação

│

▼

EC2

│

IAM Role

│

▼

Amazon S3

│

Objetos
```

A comunicação ocorre de forma autenticada utilizando credenciais temporárias da IAM Role, eliminando a necessidade de armazenar Access Keys na aplicação.

---

# Boas Práticas Adotadas

* Block Public Access habilitado;
* Aplicação do princípio do menor privilégio;
* Utilização de IAM Roles em vez de credenciais estáticas;
* Comunicação exclusivamente via HTTPS;
* Criptografia dos objetos em repouso;
* Versionamento para proteção contra exclusões acidentais;
* Auditoria das operações realizadas no bucket.

---

# Considerações Finais

A estratégia de Bucket Policy adotada busca equilibrar segurança, simplicidade operacional e facilidade de manutenção.

Ao restringir o acesso exclusivamente às identidades autorizadas, bloquear acessos públicos, utilizar criptografia e seguir o princípio do menor privilégio, a solução reduz significativamente a superfície de ataque e atende às boas práticas recomendadas pela AWS para ambientes de produção.

Essa configuração garante que o Amazon S3 seja utilizado como um serviço de armazenamento seguro, altamente disponível e integrado à arquitetura proposta para o projeto.
