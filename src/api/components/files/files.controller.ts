import { BaseController } from "../../../core/controllers";
import { AuthRepository } from "../auth";
import { FilesRepository } from "./files.repository";
import multer from "multer";

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

class FilesController extends BaseController {
	apiPrefix = "/files";

	constructor() {
		super();

		this.initRoutes();
	}

	initRoutes(): void {
		this.router.get(
			this.apiPrefix,
			[],
			AuthRepository.isAuthenticated,
			FilesRepository.index
		);

		this.router.post(
			this.apiPrefix + "/upload/product/:id",
			upload.single("file"),
			AuthRepository.isAuthenticated,
			FilesRepository.uploadProductFile
		);

		this.router.post(
			this.apiPrefix + "/upload/user/:id",
			upload.single("file"),
			AuthRepository.isAuthenticated,
			FilesRepository.uploadUserFile
		);
	}
}

export default FilesController;
