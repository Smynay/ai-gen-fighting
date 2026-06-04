import enquirer from "enquirer";
import type { IUIOption } from "../interfaces";

export class IO {
  static LINE_SIZE = 32;
  static BORDER_SYMBOL_VERTICAL = "\u2506";
  static BORDER_SYMBOL_HORIZONTAL = "\u2500";
  static CORNER_SYMBOL = "\u2605";

  static async prompt(text: string): Promise<string> {
    const { result } = await enquirer.prompt<{ result: string }>({
      type: "input",
      name: "result",
      message: text,
    });

    return result;
  }

  static async confirm(text: string): Promise<boolean> {
    const { result } = await enquirer.prompt<{ result: boolean }>({
      type: "confirm",
      name: "result",
      message: text,
      initial: true,
    });

    return result;
  }

  static async select<T extends string>(
    text: string,
    options: T[] | IUIOption<T>[],
  ): Promise<T> {
    const { result } = await enquirer.prompt<{ result: T }>({
      type: "select",
      name: "result",
      message: text,
      choices: options,
    });

    return result;
  }

  static write(text: string | [string, string], center = true): void {
    if (text.length > IO.LINE_SIZE - 4) {
      throw new Error(`Text length is larger then ${IO.LINE_SIZE - 4}`);
    }

    const output = Array.from({ length: IO.LINE_SIZE }, () => " ");

    let startIndex = 3;

    if (typeof text === "string") {
      if (center) {
        startIndex = Math.floor((IO.LINE_SIZE - text.length) / 2);
      }

      output.splice(startIndex, text.length, text);
    } else {
      if (center) {
        const lengthWithSeparator = text.join("").length + 3;
        startIndex = Math.floor((IO.LINE_SIZE - lengthWithSeparator) / 2);
      }

      const joinedText = text.join("  " + IO.BORDER_SYMBOL_VERTICAL + "  ");

      output.splice(startIndex, joinedText.length, joinedText);
    }

    output[0] = IO.BORDER_SYMBOL_VERTICAL;
    output[output.length - 1] = IO.BORDER_SYMBOL_VERTICAL;

    console.log(output.join(""));
  }

  static writeDivider(bordered = false): void {
    const output = Array.from(
      { length: IO.LINE_SIZE },
      () => IO.BORDER_SYMBOL_HORIZONTAL,
    );

    const symbol = bordered ? IO.BORDER_SYMBOL_VERTICAL : IO.CORNER_SYMBOL;
    output[0] = symbol;
    output[output.length - 1] = symbol;

    console.log(output.join(""));
  }

  static writeEmpty(): void {
    const output = Array.from({ length: IO.LINE_SIZE }, () => " ");
    output[0] = IO.BORDER_SYMBOL_VERTICAL;
    output[output.length - 1] = IO.BORDER_SYMBOL_VERTICAL;

    console.log(output.join(""));
  }
}
