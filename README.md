# Gakko search

日本の学校を検索することができるnpmです。

## 準備

「学校コード検索 API」の利用登録が必要です。（無料）
利用登録後、ログインして「トークンの一覧」から「トークンの生成」を行なってください。
https://api.edu-data.jp/

「学校コード検索 API」利用規約を確認してください。

## インストール
```
npm install -g gakko-search
```

## 使用方法
1. APIトークンを環境変数に設定します。
```
export API_TOKEN='xxxxxxxxxxxxxxx'
```
1. `gakko-search`コマンドを実行すると検索できます。

