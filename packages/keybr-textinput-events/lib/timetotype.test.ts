import test from "ava";
import { TimeToType } from "./timetotype.ts";

test("no keydown or keyup events", (t) => {
  t.is(new Tester().measure(1100), 100);
});

test("character", (t) => {
  const tester = new Tester();
  t.is(tester.add(1100, "keydown", "KeyA", "a").measure(1150), 150);
  t.is(tester.add(1250, "keydown", "KeyB", "b").measure(1350), 200);
});

test("Shift down+character", (t) => {
  t.is(
    new Tester()
      .add(1100, "keydown", "ShiftLeft", "Shift")
      .add(1200, "keydown", "KeyA", "a")
      .measure(1200),
    100,
  );
});

test("AltGraph down+character (Windows)", (t) => {
  t.is(
    new Tester()
      .add(1100, "keydown", "ControlLeft", "Control")
      .add(1101, "keydown", "AltRight", "AltGraph")
      .add(1200, "keydown", "KeyA", "a")
      .measure(1200),
    100,
  );
});

test("AltGraph down+character (Linux)", (t) => {
  t.is(
    new Tester()
      .add(1100, "keydown", "AltRight", "AltGraph")
      .add(1200, "keydown", "KeyA", "a")
      .measure(1200),
    100,
  );
});

test("Alt down+character (MacOS)", (t) => {
  t.is(
    new Tester()
      .add(1100, "keydown", "AltLeft", "Alt")
      .add(1200, "keydown", "KeyA", "a")
      .measure(1200),
    100,
  );
});

test("Shift down+AltGraph down+character (Windows)", (t) => {
  t.is(
    new Tester()
      .add(1100, "keydown", "ShiftLeft", "Shift")
      .add(1200, "keydown", "ControlLeft", "Control")
      .add(1201, "keydown", "AltRight", "AltGraph")
      .add(1300, "keydown", "KeyA", "a")
      .measure(1300),
    100,
  );
});

test("Shift down+AltGraph down+character (Linux)", (t) => {
  t.is(
    new Tester()
      .add(1100, "keydown", "ShiftLeft", "Shift")
      .add(1200, "keydown", "AltRight", "AltGraph")
      .add(1300, "keydown", "KeyA", "a")
      .measure(1300),
    100,
  );
});

test("Shift down+Alt down+character (MacOS)", (t) => {
  t.is(
    new Tester()
      .add(1100, "keydown", "ShiftLeft", "Shift")
      .add(1200, "keydown", "AltLeft", "Alt")
      .add(1300, "keydown", "KeyA", "a")
      .measure(1300),
    100,
  );
});

test("Dead down,Dead up,character", (t) => {
  t.is(
    new Tester()
      .add(1100, "keydown", "Equal", "Dead")
      .add(1200, "keyup", "Equal", "Dead")
      .add(1300, "keydown", "KeyA", "a")
      .measure(1300),
    200,
  );
});

test("Shift down,Dead down,Dead up,Shift up,character", (t) => {
  t.is(
    new Tester()
      .add(1100, "keydown", "ShiftLeft", "Shift")
      .add(1200, "keydown", "Equal", "Dead")
      .add(1300, "keyup", "Equal", "Dead")
      .add(1400, "keyup", "ShiftLeft", "Shift")
      .add(1500, "keydown", "KeyA", "a")
      .measure(1500),
    300,
  );
});

test("Shift down,Dead down,Shift up,Dead up,character", (t) => {
  t.is(
    new Tester()
      .add(1100, "keydown", "ShiftLeft", "Shift")
      .add(1200, "keydown", "Equal", "Dead")
      .add(1300, "keyup", "ShiftLeft", "Shift")
      .add(1400, "keyup", "Equal", "Dead")
      .add(1500, "keydown", "KeyA", "a")
      .measure(1500),
    300,
  );
});

test("Shift down,Shift up,Alt down,Alt up,character", (t) => {
  t.is(
    new Tester()
      .add(1100, "keydown", "ShiftLeft", "Shift")
      .add(1200, "keyup", "ShiftLeft", "Shift")
      .add(1300, "keydown", "AltLeft", "Alt")
      .add(1400, "keyup", "AltLeft", "Alt")
      .add(1500, "keydown", "KeyA", "a")
      .measure(1500),
    200,
  );
});

test("Shift down,Alt down,Alt up,Shift up,character", (t) => {
  t.is(
    new Tester()
      .add(1100, "keydown", "ShiftLeft", "Shift")
      .add(1200, "keydown", "AltLeft", "Alt")
      .add(1300, "keyup", "AltLeft", "Alt")
      .add(1400, "keyup", "ShiftLeft", "Shift")
      .add(1500, "keydown", "KeyA", "a")
      .measure(1500),
    300,
  );
});

test("Shift down,Alt down,Shift up,Alt up,character", (t) => {
  t.is(
    new Tester()
      .add(1100, "keydown", "ShiftLeft", "Shift")
      .add(1200, "keydown", "AltLeft", "Alt")
      .add(1300, "keyup", "ShiftLeft", "Shift")
      .add(1400, "keyup", "AltLeft", "Alt")
      .add(1500, "keydown", "KeyA", "a")
      .measure(1500),
    300,
  );
});

class Tester {
  timeStamp = 1000;
  ttt = new TimeToType();

  constructor() {
    this.ttt.measure({ timeStamp: this.timeStamp });
  }

  add(timeStamp: number, type: string, code: string, key: string) {
    if (this.timeStamp > timeStamp) {
      throw new Error();
    }
    this.timeStamp = timeStamp;
    this.ttt.add({ timeStamp, type, code, key });
    return this;
  }

  measure(timeStamp: number) {
    if (this.timeStamp > timeStamp) {
      throw new Error();
    }
    this.timeStamp = timeStamp;
    return this.ttt.measure({ timeStamp });
  }
}
