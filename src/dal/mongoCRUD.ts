import { MongoClient, MongoCollection, Db, Document, ObjectId } from 'mongodb';

export default class MongoCRUD<T> {
  private readonly MONGO_URI = process.env.MONGO_URI;
  private readonly DB_NAME = process.env.DB_NAME;

  private collection: string;

  constructor(collection: string) {
    console.log('URI:' + this.MONGO_URI);
    this.collection = collection;
  }

  private async connect(callback: Function): Promise<any> {
    return MongoClient.connect(this.MONGO_URI, { useUnifiedTopology: true })
      .then(async (client: MongoClient) => {
        return this.getOrCreateCollection(this.collection, client.db(this.DB_NAME))
          .then((collection: MongoCollection) => callback(collection)
            .then((result: Document) => {
              client.close();
              return result;
            }));
      });
  }

  async create(document: T): Promise<T> {
    return this.connect((collection: MongoCollection) => collection.insertOne(document)
      .then((result) => result.ops[0]));
  }

  async read(query: any, options?: Document): Promise<T> {
    return this.connect((collection: MongoCollection) => collection.findOne(query, options));
  }

  update(id: string, updatedDocument: T): Promise<T> {
    return this.connect((collection: MongoCollection) => collection.updateOne({ _id: new ObjectId(id.toString()) },
      { '$set': updatedDocument }));
  }

  async delete(id: string): Promise<T> {
    return this.connect((collection: MongoCollection) => collection
      .deleteOne({ _id: new ObjectId(id.toString()) }));
  }

  async readAll(): Promise<T[]> {
    return this.connect((collection: MongoCollection) => collection.find({}).toArray());
  }

  clearDB(): Promise<T> {
    return this.connect((collection: MongoCollection) => collection.deleteMany({}));
  }
  private async getOrCreateCollection(collectionName: string, db: Db) {
    let collectionExists = await db.listCollections({ name: collectionName })
      .hasNext();
    if (collectionExists) {
      return db.collection(collectionName);
    }
    return db.createCollection(collectionName);
  }

}
