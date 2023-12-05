import enquirer from "enquirer";
import { typeList, prefectureList, founderList } from "./lists.js";

const { prompt } = enquirer;
const { Toggle } = enquirer;

export class Question {
  static async AskSearchConditions() {
    const questions = [
      {
        type: "select",
        name: "school_type_code",
        message: "校種を選んでください。",
        limit: 8,
        choices: typeList.map(([code, name]) => ({
          name: name,
          value: code,
        })),
        result() {
          return this.focused.value;
        },
      },
      {
        type: "autocomplete",
        name: "pref_code",
        message: "都道府県を選ぶか、漢字で入力してください。",
        limit: 10,
        choices: prefectureList.map(([code, name]) => ({
          name: code,
          message: name,
          value: name,
        })),
        result() {
          return this.focused.name;
        },
      },
      {
        type: "select",
        name: "school_founder_code",
        message: "設置区分を選んでください",
        choices: founderList.map(([code, name]) => ({
          name: name,
          value: code,
        })),
        result() {
          return this.focused.value;
        },
      },
      {
        type: "input",
        name: "keyword",
        message:
          "キーワードがあれば入力してください。（ない場合はエンターキーで進む。）",
      },
    ];
    return await prompt(questions);
  }

  static async AskSchoolToSee(foundSchools) {
    const question = {
      type: "autocomplete",
      limit: 10,
      name: "school",
      message: "知りたい学校を入力するか、選択してください",
      choices: foundSchools.map((school) => ({
        name: school,
        message: school.name,
        value: school.name,
      })),
      result() {
        return this.focused.name;
      },
    };
    return await prompt(question);
  }

  static async setToken() {
    const answer = await prompt({
      type: "input",
      name: "token",
      message: "APIトークンが未設定です。入力してください。",
    });
    return answer.token;
  }

  static async askOpenMapOrExit() {
    const confirm = new Toggle({
      enabled: "地図を開く",
      disabled: "検索をやめる",
    });
    return await confirm.run();
  }
}
