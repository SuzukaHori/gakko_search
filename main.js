#!/usr/bin/env node

import { exec } from "node:child_process";
import { ApiClient } from "./api-client.js";
import { enterApiToken, askSearchParams, selectSchool, confirmMapDisplay } from "./questions.js";

let token;
if (process.env.GAKKOU_SEARCH_API_TOKEN) {
  token = process.env.GAKKOU_SEARCH_API_TOKEN;
} else {
  token = await enterApiToken();
}

const searchParams = await askSearchParams();
const params = {};
Object.keys(searchParams).forEach((key) => {
  if (searchParams[key] !== "0") {
    params[key] = searchParams[key];
  }
});

let response;
try {
  const apiClient = new ApiClient(token, params);
  response = await apiClient.search();
} catch (error) {
  if (error.response && error.response.status === 401) {
    console.error("APIトークンが不正です。設定し直してください。");
  } else {
    console.error("学校データの取得に失敗しました。");
  }
  console.error(`Error: ${error.message}, Status: ${error.response.status}, Status Text: ${error.response.statusText}`);
  process.exit();
}

const total = response.total;
if (total === 0) {
  console.log("学校が見つかりませんでした");
  process.exit();
} else if (total > 100) {
  console.log(`\n${total}件の学校が見つかりました。最初の100件のみ表示します。\n`);
} else {
  console.log(`\n${total}件の学校が見つかりました。\n`);
}

const schools = response.schools;
const selected = await selectSchool(schools);
const selectedSchool = selected.school;
console.log(selectedSchool.info());

const mapConfirm = await confirmMapDisplay();
if (mapConfirm) {
  const mapUrl = selectedSchool.mapUrl();
  exec(`open "${mapUrl}"`, (error) => {
    if (error) {
      console.error("地図の表示に失敗しました。");
      throw error;
    }
  });
} else {
  console.log("\n検索を終了しました");
}
