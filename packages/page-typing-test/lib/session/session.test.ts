import { type WordList } from "@keybr/content";
import { FakeRNGStream } from "@keybr/rand";
import { textDisplaySettings, textInputSettings } from "@keybr/textinput";
import test from "ava";
import { CommonWordsGenerator } from "../generator/index.ts";
import { Session } from "./session.ts";
import { DurationType } from "./types.ts";

test("lines", (t) => {
  const wordList: WordList = ["one", "two", "three", "four", "five"];
  const session = new Session(
    {
      duration: {
        type: DurationType.Length,
        value: 10,
      },
      numLines: 3,
      numCols: 3,
      textInput: textInputSettings,
      textDisplay: textDisplaySettings,
    },
    new CommonWordsGenerator(
      { wordListSize: 1000 },
      wordList,
      FakeRNGStream(wordList.length),
    ),
  );

  {
    const lines = session.getLines();
    t.is(lines.length, 3);

    t.deepEqual(lines[0].mark, { mark: 0 });
    t.is(lines[0].text, "one ");

    t.deepEqual(lines[1].mark, { mark: 1 });
    t.is(lines[1].text, "two ");

    t.deepEqual(lines[2].mark, { mark: 2 });
    t.is(lines[2].text, "three ");
  }

  session.handleTextInput({
    timeStamp: 100,
    inputType: "appendChar",
    codePoint: "one ".codePointAt(0)!,
    timeToType: 100,
  });
  session.handleTextInput({
    timeStamp: 200,
    inputType: "appendChar",
    codePoint: "one ".codePointAt(1)!,
    timeToType: 100,
  });
  session.handleTextInput({
    timeStamp: 300,
    inputType: "appendChar",
    codePoint: "one ".codePointAt(2)!,
    timeToType: 100,
  });
  session.handleTextInput({
    timeStamp: 400,
    inputType: "appendChar",
    codePoint: "one ".codePointAt(3)!,
    timeToType: 100,
  });

  {
    const lines = session.getLines();
    t.is(lines.length, 3);

    t.deepEqual(lines[0].mark, { mark: 1 });
    t.is(lines[0].text, "two ");

    t.deepEqual(lines[1].mark, { mark: 2 });
    t.is(lines[1].text, "three ");

    t.deepEqual(lines[2].mark, { mark: 3 });
    t.is(lines[2].text, "four ");
  }
});
