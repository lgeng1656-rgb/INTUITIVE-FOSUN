import test from "node:test";
import assert from "node:assert/strict";
import {
  getBreathDuration,
  smoothAmbientVolume
} from "./audio-reactive-breath.js";

test("ambient volume shortens the breathing duration within safe limits", () => {
  assert.equal(getBreathDuration(0), 5.5);
  assert.equal(getBreathDuration(0.015), 5.5);
  assert.equal(getBreathDuration(0.215), 1.2);
  assert.equal(getBreathDuration(1), 1.2);
  assert.ok(getBreathDuration(0.12) < getBreathDuration(0.04));
});

test("ambient volume reacts faster to loud sounds than to silence", () => {
  assert.equal(smoothAmbientVolume(0, 1), 0.25);
  assert.equal(smoothAmbientVolume(1, 0), 0.92);
});
