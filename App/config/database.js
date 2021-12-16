import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

export default class DatabaseManager {
  static initializeDatabase() {
    db.transaction(
      (tx) => {
        // tx.executeSql('DROP TABLE IF EXISTS "credits"');
        // tx.executeSql('DROP TABLE IF EXISTS "listProduitsCredit"');
        // create table persons
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS "persons" (\
            "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
            "nom"	TEXT NOT NULL,\
            "phone"	TEXT NOT NULL,\
            "genre"	INTEGER NOT NULL,\
            "created_at" TEXT DEFAULT CURRENT_TIMESTAMP\
          );'
        );
        // create table credits
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS "credits" (\
            "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
            "id_person"	INTEGER NOT NULL,\
            "date_achat" TEXT NOT NULL,\
            "prix"	REAL NOT NULL,\
            "prix_attent" REAL NULL,\
            "date_attent" TEXT NULL,\
            "prix_payer"	REAL NULL,\
            "est_payer"	INTEGER DEFAULT 0,\
            "date_payer"	TEXT NULL,\
            "created_at" TEXT DEFAULT CURRENT_TIMESTAMP,\
            FOREIGN KEY("id_person") REFERENCES "persons"("id")\
          );'
        );
        // create table list produits de credit
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS "listProduitsCredit" (\
            "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
            "id_person"	INTEGER NOT NULL,\
            "id_credit"	INTEGER NOT NULL,\
            "nom" TEXT NOT NULL,\
            "prix"	REAL NOT NULL,\
            "qte" INTEGER NOT NULL,\
            "created_at" TEXT DEFAULT CURRENT_TIMESTAMP,\
            FOREIGN KEY("id_person") REFERENCES "persons"("id"),\
            FOREIGN KEY("id_credit") REFERENCES "credits"("id")\
          );'
        );
      },
      (e) => {
        console.log("ERREUR + " + e);
      },
      () => {
        console.log("OK + ");
      }
    );
  }

  static ExecuteQuery = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.transaction((trans) => {
        trans.executeSql(
          sql,
          params,
          (trans, results) => {
            resolve(results);
          },
          (trans, error) => {
            reject(error);
          }
        );
      });
    });

  //-------- start section general
  static async GetLastIdAdd() {
    let selectQuery = await this.ExecuteQuery(
      "SELECT last_insert_rowid() as lastId",
      []
    );
    return selectQuery.rows.item(0).lastId;
  }
  //-------- start section general

  //-------- start section Person
  // get person
  static async getPerson(where = "", params = []) {
    let result = [];
    let query = "";
    if (where === "") {
      query = "SELECT * FROM persons ORDER BY created_at DESC";
    } else {
      query = "SELECT * FROM persons " + where;
    }
    let selectQuery = await this.ExecuteQuery(query, params);

    var rows = selectQuery.rows;
    for (let i = 0; i < rows.length; i++) {
      var item = rows.item(i);
      result.push({
        id: item.id,
        nom: item.nom,
        phone: item.phone,
        genre: item.genre,
        created_at: item.created_at,
      });
    }

    return result;
  }

  // create person
  static async createPerson(person) {
    await this.ExecuteQuery(
      "INSERT INTO persons(nom, phone, genre) values(?, ?, ?)",
      person
    );
  }

  // update person
  static async editPerson(person) {
    await this.ExecuteQuery(
      "UPDATE persons SET nom=?, phone=?, genre=? WHERE id=?",
      person
    );
  }

  // delete person by id
  static async deletePersonWithId(id) {
    await this.ExecuteQuery("DELETE FROM persons WHERE id=?", [id]);
  }
  //-------- end section Person

  //-------- start section Credits
  // get credits
  static async getCredit(where = "", params = []) {
    let result = [];
    let query = "";
    if (where === "") {
      query = "SELECT * FROM credits ORDER BY created_at DESC";
    } else {
      query = "SELECT * FROM credits " + where;
    }
    let selectQuery = await this.ExecuteQuery(query, params);

    var rows = selectQuery.rows;
    for (let i = 0; i < rows.length; i++) {
      var item = rows.item(i);
      result.push({
        id: item.id,
        id_person: item.id_person,
        date_achat: item.date_achat,
        prix: item.prix,
        prix_attent: item.prix_attent,
        date_attent: item.date_attent,
        prix_payer: item.prix_payer,
        est_payer: item.est_payer,
        date_payer: item.date_payer,
        created_at: item.created_at,
      });
    }

    return result;
  }

  // create credit
  static async createCredit(credit) {
    await this.ExecuteQuery(
      "INSERT INTO credits\
        (id_person, date_achat, prix)\
        values(?, ?, ?)",
      credit
    );
  }

  // update credit
  static async editCredit(credit) {
    await this.ExecuteQuery(
      "UPDATE credits\
      SET prix=?, prix_attent=?, date_attent=?, prix_payer=?, est_payer=?, date_payer=?\
      WHERE id=?",
      credit
    );
  }

  // delete credit by id
  static async deleteCreditWithId(id) {
    await this.ExecuteQuery("DELETE FROM credits WHERE id=?", [id]);
  }
  //-------- end section Credits

  //-------- start section list produits de credit
  // get list produits de credit
  static async getListProduitsCredit(where = "", params = []) {
    let result = [];
    let query = "";
    if (where === "") {
      query = "SELECT * FROM listProduitsCredit ORDER BY created_at DESC";
    } else {
      query = "SELECT * FROM listProduitsCredit " + where;
    }
    let selectQuery = await this.ExecuteQuery(query, params);

    var rows = selectQuery.rows;
    for (let i = 0; i < rows.length; i++) {
      var item = rows.item(i);
      result.push({
        id: item.id,
        id_person: item.id_person,
        id_credit: item.id_credit,
        nom: item.nom,
        prix: item.prix,
        qte: item.qte,
        created_at: item.created_at,
      });
    }

    return result;
  }

  // create list produits de credit
  static async createListProduitsCredit(produits) {
    await this.ExecuteQuery(
      "INSERT INTO listProduitsCredit\
        (id_person, id_credit, nom, prix, qte)\
        values(?, ?, ?, ?, ?)",
      produits
    );
  }

  // update list produits de credit
  static async editListProduitsCredit(credit) {
    await this.ExecuteQuery(
      "UPDATE listProduitsCredit\
      SET id_person=?, id_credit=?, nom=?, prix=?, qte=?\
      WHERE id=?",
      credit
    );
  }

  // delete list produits de credit by id
  static async deleteListProduitsCreditWithId(id) {
    await this.ExecuteQuery("DELETE FROM listProduitsCredit WHERE id=?", [id]);
  }
  //-------- end section list produits de credit
}
