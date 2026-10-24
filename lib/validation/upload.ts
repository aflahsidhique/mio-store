import { z } from "zod";

export const allowedUploadExtensions = new Set([
  "stl", "3mf", "obj", "step", "stp", "iges", "igs", "jpg", "jpeg", "png", "webp", "pdf",
]);

export const allowedUploadMimeTypes = new Set([
  "application/octet-stream",
  "model/stl",
  "model/3mf",
  "model/obj",
  "application/step",
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

export function validateUpload(file: Pick<File, "name" | "size" | "type">) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return z.object({
    extension: z.string().refine((value) => allowedUploadExtensions.has(value)),
    size: z.number().positive().max(MAX_UPLOAD_BYTES),
    type: z.string().refine((value) => allowedUploadMimeTypes.has(value || "application/octet-stream")),
  }).safeParse({ extension, size: file.size, type: file.type || "application/octet-stream" });
}
