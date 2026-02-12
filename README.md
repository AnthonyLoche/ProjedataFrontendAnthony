# Sistema de Gestão de Produtos e Matérias-Primas
  
<div align="center">

**Sistema completo para gerenciamento de produtos, matérias-primas e cálculo de produção**

[![Java](https://img.shields.io/badge/Java-17-orange?logo=java)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green?logo=spring)](https://spring.io/projects/spring-boot)
[![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?logo=vue.js)](https://vuejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?logo=postgresql)](https://www.postgresql.org/)

[Demo ao Vivo](https://projedata-frontend-anthony.vercel.app/) • [Documentação da API](https://projedatabackendanthony.onrender.com/swagger-ui/index.html#/) • [Funcionalidades](#-funcionalidades-principais)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Instalação e Execução](#-instalação-e-execução)
- [Documentação da API](#-documentação-da-api)
- [Deploy](#-deploy)
- [Regras de Negócio](#-regras-de-negócio)
- [Sobre o Desenvolvedor](#-sobre-o-desenvolvedor)

---

## 🎯 Sobre o Projeto

Este sistema foi desenvolvido como parte de um desafio técnico para a posição de **Desenvolvedor Full Stack Júnior**. A aplicação permite o gerenciamento completo de produtos e matérias-primas, incluindo controle de estoque, associação de componentes e cálculo inteligente de capacidade produtiva.

### Diferenciais do Projeto

- **Arquitetura em Camadas**: Separação clara de responsabilidades seguindo princípios SOLID
- **API RESTful**: Backend totalmente desacoplado do frontend
- **Cálculo Inteligente**: Sistema de priorização de produção baseado em valor
- **Interface Moderna**: Design responsivo desenvolvido com Vuetify
- **Documentação Interativa**: Swagger/OpenAPI para testes e visualização de endpoints

---

## ✨ Funcionalidades Principais

### Gerenciamento de Produtos
- ✅ Cadastro completo com nome, descrição e valor
- ✅ Edição e exclusão de produtos
- ✅ Busca e filtros personalizados
- ✅ Visualização de lucro potencial
- ✅ Associação com múltiplas matérias-primas

### Gerenciamento de Matérias-Primas
- ✅ Cadastro com controle de estoque em tempo real
- ✅ Validação de exclusão (impede remoção se vinculada a produtos)
- ✅ Visualização de produtos que utilizam cada matéria-prima
- ✅ Atualização de quantidades disponíveis

### Cálculo de Produção
- ✅ Análise automática de produtos que podem ser fabricados
- ✅ Cálculo de quantidade máxima baseado no estoque disponível
- ✅ Priorização por maior valor agregado
- ✅ Estimativa de valor total de produção possível
- ✅ Relatório detalhado de capacidade produtiva

---

## 🛠 Tecnologias Utilizadas

### Backend

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| Java | 17 | Linguagem principal |
| Spring Boot | 3.x | Framework backend |
| Maven | - | Gerenciamento de dependências |
| PostgreSQL | Latest | Banco de dados relacional |
| Swagger/OpenAPI | - | Documentação de API |
| Docker | - | Containerização |

### Frontend

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| Vue.js | 3 | Framework JavaScript progressivo |
| Vuetify | 3.x | Biblioteca de componentes Material Design |
| Axios | - | Cliente HTTP para requisições |
| Vue Router | - | Gerenciamento de rotas |

### Outras Habilidades Técnicas

**Backend**: Python (Django, DRF), Node.js  
**Frontend**: React, Angular  
**Bancos de Dados**: MySQL  
**DevOps**: Docker, CI/CD  
**Outras**: APIs REST, ESP32 + RFID, Autenticação JWT

---

## 🏗 Arquitetura

### Estrutura Backend

O projeto segue uma arquitetura em camadas bem definida:

```
src/
├── domain/
│   ├── models/          # Entidades do domínio
│   └── repositories/    # Interfaces de persistência
│
├── application/
│   ├── dtos/            # Data Transfer Objects
│   ├── controllers/     # Endpoints REST
│   ├── services/        # Lógica de negócio
│   └── exceptions/      # Tratamento de erros
│
└── infrastructure/
    └── config/          # Configurações (CORS, Swagger, etc)
```

### Estrutura Frontend

O projeto segue uma arquitetura em camadas bem definida:

```
src/
├── assets/              # Recursos estáticos (imagens, fontes, estilos)
├── components/          # Componentes reutilizáveis da aplicação
├── layouts/             # Estruturas de layout (AppBar, Sidebar, Footer)
├── plugin/              # Plugins e configurações (Vuetify, etc)
├── router/              # Configuração de rotas Vue Router
├── services/            # Serviços de API e comunicação com backend
├── stores/              # Gerenciamento de estado (Pinia/Vuex)
├── utils/               # Funções utilitárias e helpers
├── views/               # Páginas/views da aplicação
├── App.vue              # Componente raiz da aplicação
└── main.js              # Ponto de entrada da aplicação
```

### Benefícios da Arquitetura

- **Manutenibilidade**: Fácil localização e modificação de código
- **Testabilidade**: Camadas isoladas facilitam testes unitários
- **Escalabilidade**: Estrutura preparada para crescimento
- **Legibilidade**: Organização clara e intuitiva

### Padrões Utilizados

- Repository Pattern
- DTO Pattern
- Service Layer Pattern
- Dependency Injection
- RESTful API Design

---

## 🚀 Instalação e Execução

### Pré-requisitos

- Java 17+
- Node.js 16+

### Backend

```bash
# Clonar o repositório
git clone [url-do-repositorio]

# Navegar até a pasta do backend
cd backend

# Configurar banco de dados no application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/seu_banco
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

```

A API estará disponível em `http://localhost:8080`

### Frontend

```bash
# Navegar até a pasta do frontend
cd frontend

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

---

## 📚 Documentação da API

### Swagger UI

A documentação interativa está disponível em:

```
http://localhost:8080/swagger-ui/index.html#/
```

### Principais Endpoints

#### Produtos

```http
GET    /products              # Listar todos os produtos
GET    /products/{id}         # Buscar produto por ID
POST   /products              # Criar novo produto
PUT    /products/{id}         # Atualizar produto
DELETE /products/{id}         # Excluir produto
GET    /products/{id}/production     # Calcular produtos possíveis
```

#### Matérias-Primas

```http
GET    /raw-materials    # Listar todas as matérias-primas
GET    /raw-materials/{id}  # Buscar matéria-prima por ID
POST   /raw-materials       # Criar nova matéria-prima
PUT    /raw-materials/{id}  # Atualizar matéria-prima
DELETE /raw-materials/{id}  # Excluir matéria-prima (com validação)
GET    /raw-materials/{id}/products # Lista todos os produtos associados a esta matéria prima
```

### Exemplos de Requisições

**Criar Produto**
```json
POST /products
{
  "name": "string",
  "value": 0,
  "rawMaterials": [
    {
      "idRawMaterial": 0,
      "qnt": 1
    }
  ]
}
```

**Criar Matéria-Prima**
```json
POST /api/raw-materials
{
  "name": "string",
  "qnt": 0
}
```

---

## 🌐 Deploy

### Backend - Render

**URL**: https://projedatabackendanthony.onrender.com/

- Hospedagem via Docker container
- Banco de dados PostgreSQL gerenciado
- **Observação**: O plano gratuito entra em modo sleep após ~50 segundos de inatividade
  - Primeira requisição pode levar alguns segundos extras
  - Requisições subsequentes são instantâneas

### Frontend - Vercel

**URL**: https://projedata-frontend-anthony.vercel.app/

- Deploy automático via integração GitHub
- CDN global para alta performance
- SSL/HTTPS automático
- Atualizações em tempo real via push

### Configuração de CORS

O backend está configurado para aceitar requisições de:
- `https://projedata-frontend-anthony.vercel.app/` (produção)
- `http://localhost:5173` (desenvolvimento)

---

## 📝 Regras de Negócio

### Validações Implementadas

1. **Matéria-Prima Vinculada**
   - Uma matéria-prima não pode ser excluída se estiver associada a algum produto
   - O sistema retorna erro com lista de produtos dependentes

2. **Cálculo de Produção**
   - Verifica disponibilidade em estoque de todas as matérias-primas necessárias
   - Calcula quantidade máxima fabricável baseado no componente limitante
   - Exclui produtos sem matérias-primas suficientes

3. **Estoque Negativo**
   - Sistema impede cadastro de quantidades negativas
   - Validação tanto no frontend quanto no backend

---

## 👨‍💻 Sobre o Desenvolvedor

### Anthony Gabriel Lopes dos Reis

**Desenvolvedor Full Stack** com foco em backend e arquitetura de software

### Formação

🎓 **Técnico em Informática para Internet**  
Instituto Federal Catarinense - Campus Araquari

### Experiência Profissional

💼 **Projeto Fábrica de Software**
- Desenvolvimento de sistemas para demandas reais institucionais
- Trabalho em equipe com metodologias ágeis
- Contato direto com clientes e levantamento de requisitos
- Ambiente próximo ao mercado de trabalho real

### Stack Técnica Completa

**Backend Avançado**
- Python (Django, Django REST Framework - Avançado)
- Node.js (Express - Avançado)
- Java (Java Spring - Intermediário)

**Frontend**
- Vue.js 3 (Composition API, Vuex/Pinia, Vue Router - Avançado)
- React (Intermediário)
- Angular (Intermediário)

**Banco de Dados**
- PostgreSQL (queries complexas, otimização)
- MySQL (stored procedures, triggers)
- Modelagem relacional

**DevOps & Ferramentas**
- Docker (containerização, docker-compose)
- Git (versionamento, branches, pull requests)
- APIs REST (design, versionamento, documentação)
- Swagger/OpenAPI

**Projetos Especiais**
- ESP32 + RFID: Sistema de autenticação integrado com backend Node.js
- APIs de terceiros: Integração e consumo

### Soft Skills

- 🤝 **Trabalho em Equipe**: Experiência colaborativa em projetos reais
- 💬 **Comunicação**: Clareza na documentação e apresentação de ideias
- 👔 **Relacionamento com Cliente**: Levantamento de requisitos e alinhamento de expectativas
- 📊 **Liderança**: Coordenação de pequenas equipes em projetos acadêmicos
- 🎯 **Organização**: Metodologias ágeis e gestão de tempo

### Aprendizado Contínuo

- Facilidade em absorver novas tecnologias
- Adaptação rápida a diferentes contextos
- Interesse constante em melhores práticas
- Busca por código limpo e manutenível

---

## 📬 Contato

Estou disponível para discutir:
- Decisões arquiteturais do projeto
- Detalhes de implementação
- Desafios enfrentados e soluções aplicadas
- Oportunidades de colaboração

- Email: anthonylocheifc@gmail.com
- Telefone: 47 999636618
- Portfólio: https://my-portfolio-anthonygabriel.vercel.app/

---

<div align="center">
**Desenvolvido com ❤️ por Anthony Gabriel Lopes dos Reis**
</div>
