# Política de Segurança – Exigência de MFA (Require-MFA)

### Objetivo

Esta política tem como objetivo reforçar a segurança da conta AWS do projeto por meio da obrigatoriedade de autenticação multifator (MFA) para todos os usuários IAM.

A MFA adiciona uma camada extra de proteção, exigindo um segundo fator de autenticação além da senha, reduzindo significativamente o risco de acesso não autorizado.

---

### Descrição da Política

A política **Require-MFA** foi criada para garantir que nenhuma ação relevante na infraestrutura AWS possa ser executada sem que o usuário esteja autenticado com MFA ativo.

Ela atua como um mecanismo de controle de segurança transversal, sendo aplicada a todos os grupos IAM do projeto.

#### Nome da Policy

`Require-MFA`

#### Tipo de Política

- IAM Managed Policy (Custom Policy)
- Baseada em JSON
- Controle de Segurança (Security Control Policy)

---

### Lógica de Funcionamento

A política utiliza dois mecanismos principais.

#### 1. Permissões básicas sem MFA

Permite que o usuário execute ações mínimas relacionadas à própria conta IAM, como:

- Visualizar informações da conta;
- Alterar senha;
- Configurar dispositivo MFA;
- Listar dispositivos MFA.

#### 2. Bloqueio condicional (Deny)

A política implementa uma regra de **negação explícita (Deny)** que impede determinadas ações na AWS caso o usuário não esteja autenticado com MFA.

Essa negação é aplicada através da condição:

```json
"Condition": {
  "BoolIfExists": {
    "aws:MultiFactorAuthPresent": "false"
  }
}
```

---

### Política IAM (JSON)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowBasicAccountActions",
      "Effect": "Allow",
      "Action": [
        "iam:ListVirtualMFADevices",
        "iam:ListMFADevices",
        "iam:GetAccountSummary",
        "iam:ChangePassword",
        "iam:GetUser",
        "iam:CreateVirtualMFADevice",
        "iam:EnableMFADevice",
        "iam:ResyncMFADevice",
        "sts:GetSessionToken"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DenyNetworkAndComputeIfNoMFA",
      "Effect": "Deny",
      "Action": [
        "ec2:*",
        "elasticloadbalancing:*",
        "autoscaling:*",
        "rds:*"
      ],
      "Resource": "*",
      "Condition": {
        "BoolIfExists": {
          "aws:MultiFactorAuthPresent": "false"
        }
      }
    }
  ]
}
```

---

### Processo de Aplicação

A política foi aplicada aos seguintes grupos IAM:

- `grp-admin`
- `grp-architect`
- `grp-operator`
- `grp-readonly`

Dessa forma, todos os usuários da conta estão sujeitos à exigência de MFA.

---

### Fluxo de Segurança

```text
                                            Usuário realiza login com senha IAM
                                                            │
                                                            ▼
                                                    MFA está habilitado?
                                                           │
                                                     ┌─────┴─────────────────┐
                                                     │                       │
                                                    Não                     Sim
                                                     │                       │
                                                     ▼                       ▼
                                               Acesso bloqueado     Usuário autentica com MFA
                                               para ações AWS                │
                                                                             ▼
                                                                  Acesso conforme permissões
                                                                      do grupo IAM
```

---

### Benefícios da Política

- Redução do risco de comprometimento de credenciais;
- Aumento da segurança de acesso à conta AWS;
- Aplicação das boas práticas do AWS Well-Architected Framework;
- Proteção contra acessos não autorizados;
- Controle adicional além de usuário e senha;
- Maior rastreabilidade das ações dos usuários.

---

### Considerações Finais

A implementação da política **Require-MFA** reforça o modelo de segurança do projeto ao garantir que todos os acessos à infraestrutura AWS sejam autenticados por múltiplos fatores.

Essa abordagem é amplamente utilizada em ambientes corporativos e representa uma prática essencial de governança, conformidade e proteção de ambientes em nuvem.