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

ログイン時に出力されるログの最大数を設定する場合:

```
$ nodejs client.ls -l value
```
デフォルトでは15件です。  

## ログの出力形式

```
[ MM/DD HH24:MI ]user: message_...
[ MM/DD HH24:MI ]user: message_before_last
[ MM/DD HH24:MI ]user: message_last
```

