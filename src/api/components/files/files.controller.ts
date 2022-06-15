import { BaseController } from "../../../core/controllers";
import { multerUpload } from "../../../core/utils";
import { AuthRepository } from "../auth";
import { FilesRepository } from "./files.repository";

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
			multerUpload.single("file"),
			AuthRepository.isAuthenticated,
			FilesRepository.uploadProductFile
		);

		this.router.post(
			this.apiPrefix + "/upload/user/:id",
			multerUpload.single("file"),
			AuthRepository.isAuthenticated,
			FilesRepository.uploadUserFile
		);
	}
}

export default FilesController;
