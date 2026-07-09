# User Data

### Visão Geral

O **User Data** consiste em um script executado automaticamente durante a inicialização de uma instância Amazon EC2. Neste projeto, sua configuração é realizada diretamente no **Launch Template**, permitindo que todas as instâncias criadas pelo Auto Scaling Group executem as mesmas tarefas de inicialização de forma automatizada.

Como a preparação do sistema operacional e das dependências da aplicação já foi realizada previamente na AMI personalizada, o User Data possui uma responsabilidade bastante reduzida, concentrando-se apenas nas atividades necessárias para disponibilizar a versão mais recente da aplicação.

Essa abordagem reduz o tempo de bootstrap das instâncias, simplifica o processo de inicialização e facilita futuras alterações no fluxo de implantação, sem necessidade de recriação da AMI.

---

### Objetivos do User Data

O script de User Data possui como principais objetivos:

* automatizar o processo de inicialização das instâncias;
* realizar a autenticação no Amazon Elastic Container Registry (Amazon ECR);
* obter as imagens Docker mais recentes da aplicação;
* reiniciar os containers garantindo a utilização das versões atualizadas;
* assegurar que a aplicação seja iniciada corretamente após a criação da instância.

---

### Configuração no Launch Template

O User Data é configurado diretamente no **Launch Template**, tornando-se parte do processo de provisionamento das instâncias pertencentes ao Auto Scaling Group.

Sempre que uma nova instância for criada, o script será executado automaticamente durante o primeiro processo de inicialização, sem necessidade de intervenção manual.

Essa estratégia permite que uma única AMI personalizada seja reutilizada em diferentes ambientes, mantendo separadas as responsabilidades entre a imagem do sistema operacional e as ações executadas durante o bootstrap.

---

### Fluxo de Execução

Durante a inicialização da instância, o User Data executa as seguintes etapas:

1. Inicialização do sistema operacional utilizando a AMI personalizada;
2. Inicialização do serviço Docker;
3. Autenticação no Amazon Elastic Container Registry (Amazon ECR);
4. Download das imagens Docker mais recentes da aplicação;
5. Reinicialização dos containers da aplicação;
6. Validação da inicialização dos serviços.

Ao final desse processo, a instância encontra-se pronta para receber tráfego do Load Balancer.

---

### Atualização das Imagens Docker

Em vez de manter as imagens Docker armazenadas permanentemente na AMI, o User Data realiza sua obtenção diretamente no Amazon ECR durante a criação da instância.

Essa estratégia garante que novas instâncias iniciem utilizando sempre a versão mais recente da aplicação disponível no repositório de imagens, eliminando a necessidade de gerar uma nova AMI para cada atualização da aplicação.

Além disso, essa abordagem reduz o tamanho da AMI e simplifica o processo de publicação de novas versões.

---

### Reinicialização dos Containers

Após a obtenção das imagens Docker atualizadas, o User Data executa comandos responsáveis por reinicializar os containers da aplicação.

Essa etapa garante que eventuais containers existentes sejam substituídos pelas versões recém-baixadas, assegurando que a instância execute exatamente a versão mais recente disponibilizada no Amazon ECR.

Esse procedimento também contribui para um processo de inicialização mais previsível e consistente em todas as instâncias do Auto Scaling Group.

---

### Utilização na Proposta Low-Cost

Na arquitetura **Low-Cost**, o User Data possui um fluxo simplificado, executando apenas as tarefas essenciais para disponibilização da aplicação.

Suas responsabilidades incluem:

* autenticação no Amazon ECR;
* download das imagens Docker;
* reinicialização dos containers da aplicação;
* validação da inicialização dos serviços.

Como toda a preparação do ambiente já está incorporada à AMI personalizada, o bootstrap permanece rápido e com baixa complexidade operacional.

---

### Utilização na Proposta de Maior Investimento

Na arquitetura de **Maior Investimento**, o User Data mantém exatamente a mesma função desempenhada na proposta Low-Cost.

Independentemente dos recursos adicionais existentes na infraestrutura, como serviços de gerenciamento, monitoramento ou automação, o processo de inicialização das instâncias permanece padronizado, garantindo que todas obtenham as versões mais recentes das imagens Docker armazenadas no Amazon ECR antes de entrarem em operação.

Essa padronização facilita a manutenção da infraestrutura e assegura um comportamento consistente entre os diferentes ambientes implantados.

---

### Benefícios da Estratégia

A utilização do User Data em conjunto com uma AMI personalizada proporciona diversas vantagens para ambas as arquiteturas:

* redução do tempo de bootstrap;
* separação entre preparação da AMI e inicialização da aplicação;
* reutilização da mesma imagem em diferentes ambientes;
* atualização automática das imagens Docker durante o provisionamento;
* simplificação do processo de implantação;
* padronização das instâncias criadas pelo Auto Scaling Group;
* maior facilidade para manutenção e evolução da infraestrutura.

---

### Considerações Finais

A adoção de um User Data enxuto, configurado diretamente no Launch Template, complementa a estratégia de utilização da AMI personalizada neste projeto.

Enquanto a AMI concentra toda a preparação do sistema operacional e das dependências da aplicação, o User Data é responsável apenas pelas atividades necessárias durante o bootstrap da instância, como a autenticação no Amazon ECR, obtenção das imagens Docker atualizadas e inicialização dos containers.

Essa divisão de responsabilidades torna o processo de implantação mais simples, reduz o tempo de provisionamento das instâncias e garante maior consistência operacional em ambas as propostas arquiteturais do projeto.