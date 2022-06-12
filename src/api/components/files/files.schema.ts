import { Schema } from "mongoose";
import { FileType } from "./files.model";

export interface IFileDocument extends FileType, Document {}

const FileSchema = new Schema(
	{
		image: {
			type: Buffer,
			required: true,
			content: String,
		},
	},
	{
		versionKey: false,
		collection: "Files",
		timestamps: true,
	}
);

export { FileSchema };
