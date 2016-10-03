# socket.io-chat

socket.io を使ったチャットアプリケーションです。

## 使い方

サーバーの起動:
```
$ nodejs server.js
```

クライアントの起動:
```
$ nodejs client.js
```
こちらのブランチではクライアントの入力が
```
:s [文字列]
```
であった場合に過去ログより適合する発言をするコマンドを実装します。

## 必要なモジュールについて

ログの記録に__NeDB__モジュールを利用します。
https://github.com/louischatriot/nedb

ログ検索時にタイムスタンプを利用するため__Date-Utils__モジュールを利用します。
https://github.com/JerrySievert/date-utils/

