#!/usr/bin/env node

import enquirer from "enquirer";
import { exec } from "node:child_process";
import { Client } from "./client.js";
import { School } from "./school.js";

const { prompt } = enquirer;
const { Toggle } = enquirer;

const questionsToSearch = [
  {
    type: "select",
    name: "school_type_code",
    message: "校種を選んでください。",
    limit: 8,
    choices: School.typeList.map(([code, name]) => ({
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
    choices: School.prefectureList.map(([code, name]) => ({
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
    choices: School.founderList.map(([code, name]) => ({
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
const answersToSearch = await prompt(questionsToSearch);

const params = {};
Object.keys(answersToSearch).forEach((key) => {
  if (answersToSearch[key] !== "0") {
    params[key] = answersToSearch[key];
  }
});

let token;
if (process.env.API_TOKEN) {
  token = process.env.API_TOKEN;
} else {
  const answer = await prompt({
    type: "input",
    name: "token",
    message: "APIトークンが未設定です。入力してください。",
  });
  token = answer.token;
}

let foundSchools;
try {
  const client = new Client();
  foundSchools = await client.search(token, params);
} catch (error) {
  if (error.response && error.response.status === 401) {
    console.error("APIトークンが不正です。設定し直してください。");
  } else {
    console.error("学校データの取得に失敗しました。");
  }
  console.error(
    `Error: ${error.message}, Status: ${error.response.status}, Status Text: ${error.response.statusText}`
  );
  process.exit();
}

if (foundSchools.length === 0) {
  console.log("学校が見つかりませんでした");
  process.exit();
}

const selectSchool = {
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
const selected = await prompt(selectSchool)
const selectedSchool = selected.school;
console.log(selectedSchool.info());

const confirmDisplayMap = new Toggle({
  enabled: "地図を開く",
  disabled: "検索をやめる",
});
const displayConfirm = await confirmDisplayMap.run();

if (!displayConfirm) {
  console.log("\n検索を終了しました");
  process.exit();
} else {
  const mapUrl = selectedSchool.mapUrl();
  exec(`open "${mapUrl}"`, (error) => {
    if (error) {
      console.error("地図の表示に失敗しました。");
      throw error;
    }
  });
}
