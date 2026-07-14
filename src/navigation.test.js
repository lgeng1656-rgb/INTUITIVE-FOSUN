import test from "node:test";
import assert from "node:assert/strict";
import {
  createInitialState,
  goBack,
  openPage,
  openStage
} from "./navigation.js";

test("首页进入术前全场景", () => {
  assert.deepEqual(openStage(createInitialState(), "pre"), {
    current: "pre-overview",
    stage: "pre",
    history: ["home"]
  });
});

test("进入详情后按层级返回", () => {
  const overview = openStage(createInitialState(), "pre");
  const planning = openPage(overview, "pre-planning");
  const video = openPage(planning, "video-planning");

  assert.equal(goBack(video).current, "pre-planning");
  assert.equal(goBack(goBack(video)).current, "pre-overview");
});

test("阶段按钮清空旧详情历史并切换阶段", () => {
  const planning = openPage(
    openStage(createInitialState(), "pre"),
    "pre-planning"
  );

  assert.deepEqual(openStage(planning, "post"), {
    current: "post-overview",
    stage: "post",
    history: ["home"]
  });
});

test("首页和空历史状态不会继续后退", () => {
  const initial = createInitialState();
  assert.deepEqual(goBack(initial), initial);
});
