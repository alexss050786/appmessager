module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  port: '5433',
  username: 'postgres',
  password: 'postgres',
  database: 'messager',
  define: {
    // add the timestamp attributes (updated_at, created_at)
    // adiciona a data atual nos campos (updated_at (quando alterado), created_at(quando criado))
    timestamps: true,

    // don't delete database entries but set the newly added attribute deleted_at
    // to the current date (when deletion was done). paranoid will only work if
    // timestamps are enabled
    // Não apaga do banco de dados, mas coloca a data atual no campo deleted_at (quando a exclusão foi feita)
    // paranoid: true,

    // Will automatically set field option for all attributes to snake cased name.
    // Does not override attribute with field option already defined
    underscored: true,

    // disable the modification of table names; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    // desabilita a modificação dos nomes das tabelas; Por padrão, sequenciar automaticamente
    // transforma todos os nomes de modelos passados (primeiro parâmetro de define) no plural.
    // se você não quiser, defina o seguinte
    //freezeTableName: true,
  }
}
/*
{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  }
}
*/