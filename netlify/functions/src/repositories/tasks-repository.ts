import { CollectionReference, DocumentReference, DocumentSnapshot, QuerySnapshot, WriteResult } from "firebase-admin/firestore";
import { GenericRepository } from "@shared/classes";
import { BackendModules } from "@shared/enums";
import { IUserTask, ITask } from "@shared/interfaces";


export class TasksRepository extends GenericRepository<IUserTask | ITask> {
  private static _instance: TasksRepository;

  constructor() { super(BackendModules.USER_TASKS); }

  static getInstance(): TasksRepository {
    if (this._instance) return this._instance;
    this._instance = new TasksRepository();
    return this._instance;
  }

  override createWithId(id: string, data: Partial<IUserTask>): Promise<WriteResult> {
    return super.createWithId(id, data);
  }

  override createSubcollection(id: string, data: Partial<ITask>, subcollection: BackendModules = BackendModules.TASKS): Promise<DocumentReference> {
    return super.createSubcollection(id, data, subcollection);
  }

  override readOne(id: string): Promise<DocumentSnapshot> {
    return super.readOne(id);
  }

  override readOneSubcollection(id: string, idSubcollection: string, subcollection: BackendModules = BackendModules.TASKS): Promise<DocumentSnapshot> {
    return super.readOneSubcollection(id, idSubcollection, subcollection);
  }

  override readAllSubcollection(id: string, subcollection: BackendModules = BackendModules.TASKS, orderField: keyof ITask = "createdAt"): Promise<QuerySnapshot> {
    return (super.readAllSubcollection(id, subcollection) as CollectionReference).orderBy(orderField, "desc").get();
  }

  override updateSubcollection(id: string, idSubcollection: string, data: Partial<ITask>, subcollection: BackendModules = BackendModules.TASKS): Promise<WriteResult> {
    return super.updateSubcollection(id, idSubcollection, data, subcollection);
  }

  override deleteSubcollection(id: string, idSubcollection: string, subcollection: BackendModules = BackendModules.TASKS): Promise<WriteResult> {
    return super.deleteSubcollection(id, idSubcollection, subcollection);
  }
}