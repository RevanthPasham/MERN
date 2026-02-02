import CollectionsModel, { ICollection } from "../models/CollectionModels";

export class CollectionService {

    async getAll(): Promise<ICollection[]> {
        return await CollectionsModel.find();
    }

}
