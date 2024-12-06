# Skripto
Create a **VisualNovel** using **LLM**.

ノベルゲームをLLMを使って生成します

## Setup
ノベルゲームに使用するリソースを準備します  
リソースには立ち絵・背景・音楽を指定する必要があります

### 立ち絵
1. ./player/resources/characterにキャラクターごとにフォルダを作成する(female1、male1など)  
2. 立ち絵差分をそのフォルダに追加します  
3. character/info.jsonを編集し、{id: フォルダ名, description: 立ち絵の印象}を配列に追加します

### 背景
1. ./player/resources/backgroundに背景を追加します(1280x720推奨)
2. background/info.jsonを編集し、{id: 画像ファイル名, description: 画像の説明}を配列に追加します

### 音楽
1. ./player/resources/musicに音楽ファイルを追加します
2. music/info.jsonを編集し、{id: 画像ファイル名, description: 画像の説明}を配列に追加します

## Installation
godot 4.xのインストールが必要です
### 1. run_launcher.ps1でGUIを実行
以下のコマンドを実行してGUIを実行  
`> ./run_launcher.ps1`

### 2. 設定
OpenAIのAPIキーとシナリオ保存先のフォルダ名、ビューアのパス、Godotのパスを指定する必要があります

> [!NOTE]
> ビューアのパスには./playerを指定します

## License
Copyright (c) 2022 itachi_doma

This project is released under the MIT license