import DataSample from '../entities/dataSample';
import { MongoClient, MongoCollection, Db } from 'mongodb';


export default class MongoCRUD<T> {
  private readonly MONGO_URI = process.env.MONGO_URI;
  private readonly DB_NAME = process.env.DB_NAME;

  private client: MongoClient;
  private collection: string;

  constructor(collection: string) {
    console.log('URI:')
    console.log(this.MONGO_URI);
    this.collection = collection;
  }

  private async connect(callback: Function): Promise<T> {
    return MongoClient.connect(this.MONGO_URI)
      .then((client) => {
        return this.getOrCreate(this.collection, client.db(this.DB_NAME))
          .then(collection =>
            callback(collection)
              .then((result) => {
                client.close();
                return result.ops;
              }));
      });
  }

  async create(document: T): Promise<T> {
    return this.connect((collection: MongoCollection) => collection.insertOne(document));
  }

  async read(id: object): Promise<T> {
    return this.connect((collection: MongoCollection) => collection.findOne(id));
  }

  update(id: object, dataSample: DataSample) {
    this.connect((collection: MongoCollection) => collection.updateOne({ "_id": id }, dataSample));
  }

  delete(id: object) {
    this.connect((collection: MongoCollection) => collection.delete({ "_id": id }));
  }

  clearDB(): Promise<T> {
    return this.connect((collection: MongoCollection) => collection.remove({}));
  }
  private async getOrCreate(collectionName: string, db: Db) {
    let collectionExists = await db.listCollections({ name: collectionName })
      .hasNext();
    if (collectionExists) {
      return db.collection(collectionName);
    }
    return db.createCollection(collectionName);
  }

}
