const test = require("node:test");
const assert = require("node:assert/strict");

const { isValidHabit, isValidEntryStatus } = require("./validation");

test("accepts a valid positive habit", () => {
  const habit = {
    name: "Joggen",
    type: "positive",
    category: "Sport",
  };

  assert.equal(isValidHabit(habit), true);
});

test("accepts a valid negative habit", () => {
  const habit = {
    name: "Zu viel Social Media",
    type: "negative",
    category: "Digital",
  };

  assert.equal(isValidHabit(habit), true);
});

test("rejects an empty habit name", () => {
  const habit = {
    name: "",
    type: "positive",
    category: "Sport",
  };

  assert.equal(isValidHabit(habit), false);
});

test("rejects a habit name containing only spaces", () => {
  const habit = {
    name: "   ",
    type: "positive",
    category: "Sport",
  };

  assert.equal(isValidHabit(habit), false);
});

test("rejects an invalid habit type", () => {
  const habit = {
    name: "Joggen",
    type: "neutral",
    category: "Sport",
  };

  assert.equal(isValidHabit(habit), false);
});

test("rejects an empty category", () => {
  const habit = {
    name: "Joggen",
    type: "positive",
    category: "",
  };

  assert.equal(isValidHabit(habit), false);
});

test("accepts all valid habit entry statuses", () => {
  assert.equal(isValidEntryStatus("planned"), true);
  assert.equal(isValidEntryStatus("completed"), true);
  assert.equal(isValidEntryStatus("missed"), true);
  assert.equal(isValidEntryStatus("occurred"), true);
});

test("rejects an invalid habit entry status", () => {
  assert.equal(isValidEntryStatus("invalid"), false);
});
