import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { HttpError } from "../errors/http_error";

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new HttpError(400, "Invalid file type. Only JPEG, PNG and GIF are allowed."));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
});

export const uploads = {
  single: (fieldName: string) => upload.single(fieldName),
  array: (fieldName: string, maxCount: number) => upload.array(fieldName, maxCount),
  fields: (fieldsArray: { name: string; maxCount?: number }[]) => upload.fields(fieldsArray),
};

// ---------------- Item photos specific storage ----------------
const itemPhotosDir = path.join(__dirname, "../../public/item_photos");
if (!fs.existsSync(itemPhotosDir)) {
  fs.mkdirSync(itemPhotosDir, { recursive: true });
}

const itemPhotosStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, itemPhotosDir),
  filename: (req, file, cb) => {
    const unique = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

export const itemsUpload = multer({
  storage: itemPhotosStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// ---------------- Job seeker qualification images storage ----------------
const qualificationDir = path.join(__dirname, "../../public/qualification_images");
if (!fs.existsSync(qualificationDir)) {
  fs.mkdirSync(qualificationDir, { recursive: true });
}

const qualificationStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, qualificationDir),
  filename: (req, file, cb) => {
    const unique = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

export const qualificationUpload = multer({
  storage: qualificationStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// ---------------- Employer company document storage ----------------
// Business registration docs may be PDFs, so this uses its own, wider file filter.
const companyDocDir = path.join(__dirname, "../../public/company_documents");
if (!fs.existsSync(companyDocDir)) {
  fs.mkdirSync(companyDocDir, { recursive: true });
}

const companyDocStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, companyDocDir),
  filename: (req, file, cb) => {
    const unique = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const companyDocFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new HttpError(400, "Invalid file type. Only JPEG, PNG and PDF are allowed."));
  }
};

export const companyDocUpload = multer({
  storage: companyDocStorage,
  fileFilter: companyDocFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit, docs can be bigger
});

// Combined uploader for the employer registration route:
// expects a single "companyDocument" file field.
export const employerRegisterUpload = companyDocUpload.fields([
  { name: "companyDocument", maxCount: 1 },
]);

// Combined uploader for the job seeker registration route:
// expects multiple files under "qualificationImages".
export const jobSeekerRegisterUpload = qualificationUpload.fields([
  { name: "qualificationImages", maxCount: 5 },
]);