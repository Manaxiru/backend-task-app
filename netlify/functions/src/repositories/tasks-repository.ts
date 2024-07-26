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

  override createWithId(id: string, data: Partial<IUserTask>): Promise<FirebaseFirestore.WriteResult> {
    return super.createWithId(id, data);
  }

  override create(id: string, data: Partial<ITask>, subCollection: BackendModules = BackendModules.TASKS): Promise<FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>> {
    return super.create(id, data, subCollection);
  }

  override readOne(id: string): Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>> {
    return super.readOne(id);
  }

  override readAllCollection(id: string, subCollection: BackendModules = BackendModules.TASKS, orderField: keyof ITask = "createdAt"): Promise<FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>> {
    return (super.readAllCollection(id, subCollection) as FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>)
      .orderBy(orderField, "desc").get();
  }
}