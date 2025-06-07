# WiseChats - Avaliação Técnica

Este repositório contém a solução para a avaliação técnica da **WiseChats**, com foco em uma aplicação full stack utilizando **Laravel 11** no backend e **Next.js 15 + TypeScript** no frontend.

---

## 🔎 Contexto

O desafio propôs o desenvolvimento de uma plataforma administrativa para gestão de pedidos, com autenticação de usuários, CRUD completo de pedidos e feedbacks visuais no frontend.  
O backend deveria expor uma API RESTful e o frontend consumi-la via chamadas HTTP seguras.

---

## 🚀 Tecnologias Utilizadas

### Backend

- **Laravel 11**
- **PHP 8.3**
- **Laravel Sanctum** (autenticação)
- **Spatie Laravel Data** (DTOs)
- **PHPUnit** (testes)

### Frontend

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Axios** (consumo de API)
- **React Hook Form + Zod** (validação de formulário)

### DevOps / Infra

- **Docker**
- **Docker Compose**

---

## 🔄 Funcionalidades Implementadas

### Backend (API REST Laravel)

- Cadastro, login e autenticação de usuários com **Sanctum**
- CRUD completo de **pedidos**:
     - Pedido contém dados do cliente (nome e email)
     - Lista de produtos com nome, quantidade, preço unitário e total calculado
- CRUD de **produtos**: criação, edição, listagem e exclusão
- CRUD de **usuários**: gerenciamento completo (restrito a usuários autenticados)
- **DTOs** com validações robustas usando Spatie Laravel Data
- **Testes de API** com PHPUnit para garantir estabilidade das funcionalidades principais

### Frontend (Painel Administrativo)

- Tela de **login** com autenticação integrada à API
- Tela de **listagem de pedidos** com funcionalidades de edição e exclusão
- Tela de **listagem de produtos** com opções de criação, edição e exclusão
- Tela de **criação e edição de pedidos** com suporte a múltiplos produtos dinâmicos

> Obs.: A única funcionalidade não implementada foi o teste unitário com Jest no frontend.

## 🚧 Como rodar o projeto (Docker)

### Requisitos

- Docker
- Docker Compose

### Passos

1. **Clone o repositório:**
     ```bash
     git clone https://github.com/traozin/wisechats-app
     cd wisechats-app
     ```

2. **Suba os containers:**
     ```bash
     docker-compose up --build
     ```

3. **Acesse:**
     - Frontend: [http://localhost:3000](http://localhost:3000)
     - Backend API: [http://localhost:8000/api/v1/ping](http://localhost:8000/api/v1/ping)

---

## 🔗 Endpoints da API

### Autenticação

- `POST /api/v1/login` — Login do usuário
- `POST /api/v1/users` — Cadastro de novo usuário
- `GET /api/v1/me` — Dados do usuário autenticado
- `POST /api/v1/logout` — Logout

### Pedidos

- `GET /api/v1/orders` — Listar pedidos
- `POST /api/v1/orders` — Criar pedido
- `PUT /api/v1/orders/{id}` — Atualizar pedido
- `DELETE /api/v1/orders/{id}` — Deletar pedido

### Produtos

- `GET /api/v1/products` — Listar produtos
- `POST /api/v1/products` — Criar produto
- `GET /api/v1/products/{id}` — Detalhes do produto
- `PUT /api/v1/products/{id}` — Atualizar produto
- `DELETE /api/v1/products/{id}` — Deletar produto

### Usuários

- `GET /api/v1/users` — Listar usuários
- `GET /api/v1/users/{id}` — Detalhes do usuário
- `PUT /api/v1/users/{id}` — Atualizar usuário
- `DELETE /api/v1/users/{id}` — Deletar usuário

### Outros

- `GET /api/v1/ping` — Endpoint de teste (retorna "pong")

> Enviado como parte da avaliação técnica para a vaga na WiseChats.
