import { model, Model, ObjectId } from "mongoose";
import { FileSchema, IFileDocument } from "./files.schema";

interface FileType {
	_id: ObjectId;
	image: Buffer;
}

interface IFilesModel extends Model<IFileDocument> {}

const FilesModel: IFilesModel = model<IFileDocument, IFilesModel>(
	"Files",
	FileSchema
);

export { FilesModel, FileType, IFilesModel };
