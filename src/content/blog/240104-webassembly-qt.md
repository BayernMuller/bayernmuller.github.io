---
title: 'WASM—run C++ Qt Application on your browser'
description: 'Running Qt in the Web Using WebAssembly'
pubDate: 'Jan 04 2024'
heroImage: '/thumbnails/webassembly-qt.webp'
categories: ['Development', 'English']
authors: ['jayden']
tags: ['qt', 'webassembly']
---

In this post, we’ll explore how to run Qt applications in a web browser using WebAssembly (WASM). With WASM, you can compile C++ Qt code to run efficiently in the browser, providing near-native performance. We’ll walk through the tools, techniques, and steps required to bring complex Qt applications to the web, ensuring no loss of performance.

Learn how to bring your Qt applications to the web with WASM in a seamless, high-performance way!

## Setup Development Environment

I’m developing on an Apple M2 MacBook Air, so I’ll explain based on my system. The overall process shouldn’t be much different for other OS/Devices.

### 1. Install emsdk

The Emscripten SDK (emsdk) is a toolchain for compiling C and C++ code into WebAssembly (Wasm), enabling high-performance applications to run in web browsers. It provides a comprehensive set of tools, including the Emscripten compiler, which converts C/C++ into JavaScript and Wasm. This SDK is essential for developers looking to bring complex, computation-intensive applications to the web platform.

You can download and install emsdk from GitHub using the following commands:

```bash
git clone https://github.com/emscripten-core/emsdk

cd emsdk
./emsdk install latest
./emsdk activate latest

source emsdk_env.sh
```

To set the emsdk environment variables every time zsh opens:

```bash
echo 'source "/path/to/emsdk/emsdk_env.sh"' >> $HOME/.zprofile
```

### 2. Install Qt

You need to install the regular version of Qt first to build Qt for cross-compiling for wasm.

```bash
brew install qt
```

Once installed, download the code-level Qt to build it for the wasm platform using the following commands:

```bash
wget https://download.qt.io/official_releases/qt/6.6/6.6.1/single/qt-everywhere-src-6.6.1.tar.xz
tar xf qt-everywhere-src-6.6.1.tar.xz
```

```bash
mkdir -p /path/to/dst
cd /path/to/dst

/path/to/qt/qt-everywhere-src-6.6.1/configure -qt-host-path "/opt/homebrew/Cellar/qt/6.6.1" -platform wasm-emscripten -prefix $PWD/qtbase

cmake --build . -t qtbase -t qtdeclarative -t qtsvg -t qtimageformats
# to build my gui program, I had to add qtsvg and qtimageformats

ls ./qtbase/bin/qt-cmake
```

Note: `/opt/homebrew/Cellar/qt/6.6.1` is the path to the regular Qt installed via brew earlier. This may vary, so adjust according to your environment.
If you have the `qtbase/bin/qt-cmake` file, you are ready to build for wasm!

### 3. Build Qt Application

Now that we have built Qt for wasm, let’s compile a Qt application. We’ll create a simple snake game and build it for desktop apps.

```bash
$ ls
game.cpp      game.h      main.cpp      snake.pro

$ qmake
$ make
$ open snake.app
```

![](/assets/desktop-snakegame.webp)

The snake game works well on the desktop app. Now let’s build it for wasm.

```bash
$ /path/to/qt-wasm/qtbase/bin/qmake
$ make
$ ls
qtloader.js      snake.js      snake.html      snake.wasm      ....
```

The method is exactly the same as when building for the desktop app. Just use the wasm qmake we built above. Now the .wasm file is ready. Let’s open a server and view the snake.html. I will use Python.

```bash
python3 -m http.server 8000
open http://localhost:8000/snake.html
```

![](/assets/webassembly-snakegame.webp)

Now you can see the snake game working in Chrome as well.


## Conclusion

Building Qt applications for WebAssembly offers significant benefits. Firstly, it enables cross-platform compatibility, ensuring that our applications run seamlessly in web browsers, regardless of the user’s operating system. This enhances accessibility and user reach. Secondly, WebAssembly maintains high performance and efficiency, crucial for resource-intensive applications like games. The ease of deployment and updates, since the application resides on a web server, simplifies maintenance and improves user experience. Finally, this approach leverages the mature, feature-rich environment of Qt while embracing the modern web ecosystem, representing a significant step forward in application development.

## References

- [Qt for WebAssembly](https://doc.qt.io/qt-6/wasm.html)
- [Qt for macOS](https://doc.qt.io/qt-6/macos.html)
- [Download and install emscripten](https://emscripten.org/docs/getting_started/downloads.html)