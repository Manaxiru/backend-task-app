import { BackendModules } from "@shared/enums";
import { getFirestore } from "firebase-admin/firestore";


export abstract class GenericRepository<T> {

  constructor(private repositoryModuleURL: BackendModules) { }

  protected create(data: Partial<T>): Promise<FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>> {
    return getFirestore().collection(this.repositoryModuleURL).add(data);
  }

  protected readOne(id: string): Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>> {
    return getFirestore().collection(this.repositoryModuleURL).doc(id).get();
  }

  protected readAll(): Promise<FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>> {
    return getFirestore().collection(this.repositoryModuleURL).get();
  }

  protected readByField(field: keyof T, data: string | number): Promise<FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>> {
    return getFirestore().collection(this.repositoryModuleURL).where(field.toString(), "==", data).get();
  }
}
