# ビルド方法
ここではLainan Desktopのビルド方法をご紹介します。

## 1. Node.jsのインストール
Lainan DesktopはElectronで動いており、ElectronはNode.jsのモジュールです。

### Node.jsをダウンロード
[Node.js公式サイト](https://nodejs.org/ja/)からダウンロードしてください。

### Node.jsをインストール
先程ダウンロードしたファイルを開いてインストールしてください。

※Node.jsには付属のパッケージマネージャのNPMがあります。

## 2. Lainan Desktopのリポジトリをダウンロード
[Lainan Desktopのリポジトリ](https://github.com/TarochanChannel/lainan-desktop/)からリポジトリ全体のzipファイルをダウンロードして、展開してください。

## 3. 必要なパッケージをインストール
先程展開したフォルダを開いて、package.jsonを見つけてください。

見つけたらそのフォルダで、
```shell
$ npm install
```
を実行してください。

必要なパッケージがインストールされます。

## 4. ビルド
パッケージをインストールしたあと、
```shell
$ npm run build
```
を実行してください。

実行すると、distというフォルダの中にお使いの環境に合わせたものが入っているはずです。

## 5. 完成
お疲れ様でした。

慣れている方は非常にカンタンに行えたかと思います。

説明不足や間違いなどありましたら、気軽にGithubでフォークしてください。


楽しいプログラミング生活を。Renorariでした。