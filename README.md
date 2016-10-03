# socket.io-chat

socket.io を使ったチャットアプリケーションです。

## 追加で必要なモジュールについて

ログの格納に__NeDB__モジュールを利用します。  
https://github.com/louischatriot/nedb  

ログ記録/検索時にタイムスタンプを利用するため__Date-Utils__モジュールを利用します。  
https://github.com/JerrySievert/date-utils/  

## 使い方

サーバーの起動:
```
$ nodejs server.js
```

クライアントの起動:
```
$ nodejs client.js
```

過去ログから検索パターンに一致する発言を出力:
```
> :s [検索パターン]
```

## 検索結果の出力形式
```
search result: start
user: match message_1st
user: match message_2nd
user: match message_3rd
user: match message_... 
user: match message_last
search result: end 
```

## 検索範囲

デフォルトではログ全件から検索  
> server.js
> `// var limit_search_log=100;`  
> `db.find({'message':target_pattern}).sort({'date':1}).limit(/*limit_search_log*/).exec(function (err, LOG) {`  
をコメントアウトすることで、最新100件の中から検索  
