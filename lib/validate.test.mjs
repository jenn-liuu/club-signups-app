import assert from "node:assert/strict";
import test from "node:test";
import { validateEmail } from "./validate.ts";

test("accepts a valid email address", () => {
  assert.equal(validateEmail("a@b.co"), true);
});

test("rejects an email with an empty domain label", () => {
  assert.equal(validateEmail("a@.co"), false);
});

test("rejects malformed email addresses", () => {
  assert.equal(validateEmail(""), false);
  assert.equal(validateEmail("a@b"), false);
  assert.equal(validateEmail("a@@b.co"), false);
  assert.equal(validateEmail("a b@b.co"), false);
});
