# socket.io-chat

socket.io を使ったチャットアプリケーションです。

## 必要なモジュール

ログの格納に__NeDB__モジュールを利用します。  
https://github.com/louischatriot/nedb  

ログ記録/読込時にタイムスタンプを利用するため__Date-Utils__モジュールを利用します。  
https://github.com/JerrySievert/date-utils/

コマンドライン引数の処理に__argv__モジュールを利用します。  
https://www.npmjs.com/package/argv

## 使い方

サーバーの起動:
```
$ nodejs server.js
```

クライアントの起動:
```
$ nodejs client.js
```

## ログの出力形式

```
user: message_...
user: message_before
user: message_last
```

## ログの出力数

> server.js
```
var max_output_log = 15;
```

代入する値を任意の値にすることで出力されるログの最大数を設定できます。
