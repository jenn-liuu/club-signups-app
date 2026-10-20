import assert from "node:assert/strict";
import test from "node:test";
import { validateEmail, validateSignup } from "./validate.ts";

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

test("requires a non-empty name", () => {
  assert.equal(validateSignup("", "a@b.co"), "Please enter your name.");
  assert.equal(validateSignup("   ", "a@b.co"), "Please enter your name.");
});

test("requires a valid email address", () => {
  assert.equal(
    validateSignup("Alex", "not-an-email"),
    "Please enter a valid email address.",
  );
});

test("accepts a name and email that have surrounding whitespace", () => {
  assert.equal(validateSignup(" Alex ", " a@b.co "), null);
});
