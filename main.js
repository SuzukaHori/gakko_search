#!/usr/bin/env node

import { exec } from "node:child_process";
import { Client } from "./client.js";
import { Question } from "./questions.js";

const searchConditions = await Question.AskSearchConditions();
const params = {};
Object.keys(searchConditions).forEach((key) => {
  if (searchConditions[key] !== "0") {
    params[key] = searchConditions[key];
  }
});

let token;
if (process.env.API_TOKEN) {
  token = process.env.API_TOKEN;
} else {
  token = await Question.setToken();
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

const selected = await Question.AskSchoolToSee(foundSchools);
const selectedSchool = selected.school;
console.log(selectedSchool.info());

const needForMap = await Question.askOpenMapOrExit();
if (!needForMap) {
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
