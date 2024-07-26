import { BackendModules } from "@shared/enums";
import { getFirestore } from "firebase-admin/firestore";


export abstract class GenericRepository<T> {

  constructor(private repositoryModuleURL: BackendModules) { }

  protected create(id: string, data: Partial<T>, subCollection: BackendModules): Promise<FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>> {
    return getFirestore().collection(this.repositoryModuleURL).doc(id).collection(subCollection).add(data);
  }

  protected createWithId(id: string, data: Partial<T>): Promise<FirebaseFirestore.WriteResult> {
    return getFirestore().collection(this.repositoryModuleURL).doc(id).set(data, { merge: true });
  }

  protected readOne(id: string): Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>> {
    return getFirestore().collection(this.repositoryModuleURL).doc(id).get();
  }

  protected readAll(): Promise<FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>> {
    return getFirestore().collection(this.repositoryModuleURL).get();
  }

  protected readAllCollection(id: string, subCollection: BackendModules, orderField?: keyof T): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData> | Promise<FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>> {
    return getFirestore().collection(this.repositoryModuleURL).doc(id).collection(subCollection);
  }
}
