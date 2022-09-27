import { test } from "tap";

test("test", ({ plan, same }) => {
  plan(1);
  same(1, 1);
});
