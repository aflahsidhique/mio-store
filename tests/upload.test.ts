import { describe, expect, it } from "vitest";
import { MAX_UPLOAD_BYTES, validateUpload } from "@/lib/validation/upload";

describe("private upload validation", () => {
  it("accepts a bounded STL", () => expect(validateUpload({ name: "part.stl", size: 1024, type: "model/stl" }).success).toBe(true));
  it("rejects executable extensions", () => expect(validateUpload({ name: "part.exe", size: 1024, type: "application/octet-stream" }).success).toBe(false));
  it("rejects oversized files", () => expect(validateUpload({ name: "part.stl", size: MAX_UPLOAD_BYTES + 1, type: "model/stl" }).success).toBe(false));
});
