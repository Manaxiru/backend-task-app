import { getFirestore, CollectionReference, DocumentReference, DocumentSnapshot, QuerySnapshot, WriteResult } from "firebase-admin/firestore";
import { BackendModules } from "@shared/enums";


export abstract class GenericRepository<T> {

  constructor(private repositoryModuleURL: BackendModules) { }

  protected createWithId(id: string, data: Partial<T>): Promise<WriteResult> {
    return getFirestore().collection(this.repositoryModuleURL).doc(id).set(data, { merge: true });
  }

  protected createSubcollection(id: string, data: Partial<T>, subcollection: BackendModules): Promise<DocumentReference> {
    return getFirestore().collection(this.repositoryModuleURL).doc(id).collection(subcollection).add(data);
  }

  protected readOne(id: string): Promise<DocumentSnapshot> {
    return getFirestore().collection(this.repositoryModuleURL).doc(id).get();
  }

  protected readOneSubcollection(id: string, idSubcollection: string, subcollection: BackendModules): Promise<DocumentSnapshot> {
    return getFirestore().collection(this.repositoryModuleURL).doc(id).collection(subcollection).doc(idSubcollection).get();
  }

  protected readAll(): Promise<QuerySnapshot> {
    return getFirestore().collection(this.repositoryModuleURL).get();
  }

  protected readAllSubcollection(id: string, subcollection: BackendModules, orderField?: keyof T): CollectionReference | Promise<QuerySnapshot> {
    return getFirestore().collection(this.repositoryModuleURL).doc(id).collection(subcollection);
  }

  protected updateSubcollection(id: string, idSubcollection: string, data: Partial<T>, subcollection: BackendModules): Promise<WriteResult> {
    return getFirestore().collection(this.repositoryModuleURL).doc(id).collection(subcollection).doc(idSubcollection).update(data);
  }

  protected deleteSubcollection(id: string, idSubcollection: string, subcollection: BackendModules): Promise<WriteResult> {
    return getFirestore().collection(this.repositoryModuleURL).doc(id).collection(subcollection).doc(idSubcollection).delete({ exists: true });
  }
}
