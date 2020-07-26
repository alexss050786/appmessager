#Aplicativo de troca de mensagens (Desenvolvido para efeito didatico)
##=============== Backend ===================
###### Algumas Dependencias
- "bcryptjs": "^2.4.3",
- "express": "^4.17.1",
- "jsonwebtoken": "^8.5.1",
- "multer": "^1.4.2",
- "sequelize": "^5.21.0",
- "socket.io": "^2.2.0"

###### Principais tarefas
    - [x] Gerenciamento de Usuario
        - [x] Novo (Store)
        - [x] Alterar (Update)
        - [x] Ler (Show)
        - [x] Deletar (Destroy)

    - [x] Gerenciamento de Contatos
        - [x] Listar (Index)
        - [x] Novo (Store)
        - [x] Alterar (Update)
        - [x] Ler (Show)
        - [x] Deletar (Destroy)

    - [] Gerenciamento de Grupos do Usuario   //Usuario que gerencia o grupo
        - [x] Listar (Index)    //Lista todos grupo criado pelo usuario
        - [x] Novo (Store)      //Cria um novo grupo
        - [] Alterar (Update)   //Altera o nome do grupo
        - [x] Deletar (Destroy) //Deleta o grupo

    - [x] Gerenciamento de Grupos dos Usuarios
        - [x] Listar (Index)    //Lista os grupos onde o usuario esta cadastrado
        - [x] Novo (Store)      //Adiciona o usuario em um grupo
        - [x] Deletar (Destroy) //Remove o usuario de um grupo

    - [x] Gerenciamento de Grupos
        - [x] Listar (Index)     //Lista todos os grupos
        - [x] Ler (Show)         //Recupera um grupo com seus usuarios

    - [] Gerenciamento de Mensagens
        - [x] Listar (Index)
        - [x] Novo (Store)
        - [] Alterar (Update)
        - [] Ler (Show)
        - [] Deletar (Destroy)

    - [x] Controle de Acesso
        - [x] Autentificação

##=============== Frontend ===================
###### Algumas Dependencias
"axios": "^0.19.0",
"react": "^16.9.0",
"react-dom": "^16.9.0",
"react-router-dom": "^5.0.1",
"socket.io-client": "^2.2.0"

###### Principais tarefas
    - [] Gerenciamento de Usuario
        - [x] Novo (Store)
        - [] Alterar (Update)
        - [x] Ler (Show)
        - [] Deletar (Destroy)

    - [] Gerenciamento de Contatos
        - [x] Listar (Index)
        - [x] Novo (Store)
        - [] Alterar (Update)
        - [x] Ler (Show)
        - [] Deletar (Destroy)

    - [] Gerenciamento de Grupos do Usuario   //Usuario que gerencia o grupo
        - [] Listar (Index)    //Lista todos grupo criado pelo usuario
        - [] Novo (Store)      //Cria um novo grupo
        - [] Alterar (Update)
        - [] Ler (Show)
        - [] Deletar (Destroy) //Deleta o grupo

    - [] Gerenciamento de Grupos dos Usuarios
        - [x] Listar (Index)   //Lista os grupos onde o usuario esta cadastrado
        - [] Novo (Store)      //Adiciona o usuario em um grupo
        - [] Deletar (Destroy) //Remove o usuario de um grupo

    - [] Gerenciamento de Grupos
        - [x] Listar (Index)    //Lista todos os grupos
        - [] Ler (Show)         //Recupera um grupo com seus usuarios

    - [] Gerenciamento de Mensagens
        - [x] Listar (Index)
        - [x] Novo (Store)
        - [] Alterar (Update)
        - [] Ler (Show)
        - [] Deletar (Destroy)

    - [x] Controle de Acesso
        - [x] Autentificação
