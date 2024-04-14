export type DialogType = {
  id: number
  session_name: string
}
export const dialogListResponse = {
  data: [
    {
      id: 342,
      session_name: '淡定\n',
    },
    {
      id: 276,
      session_name: '99\n',
    },
    {
      id: 267,
      session_name: '1123\n',
    },
    {
      id: 266,
      session_name: '1\n',
    },
    {
      id: 265,
      session_name: '1122\n',
    },
    {
      id: 259,
      session_name: '222\n',
    },
    {
      id: 258,
      session_name: '222\n',
    },
    {
      id: 257,
      session_name: '111\n',
    },
    {
      id: 237,
      session_name: '新会话',
    },
    {
      id: 236,
      session_name: '新会话',
    },
    {
      id: 196,
      session_name: '新会话',
    },
    {
      id: 173,
      session_name: 'c++\n',
    },
    {
      id: 122,
      session_name: 'docker',
    },
    {
      id: 121,
      session_name: 'vue\n',
    },
    {
      id: 113,
      session_name: 'ceshi\n',
    },
    {
      id: 108,
      session_name: '你哈\n',
    },
    {
      id: 88,
      session_name: '新会话',
    },
    {
      id: 86,
      session_name: '新',
    },
    {
      id: 85,
      session_name: '新会话',
    },
    {
      id: 84,
      session_name: '新会话',
    },
    {
      id: 83,
      session_name: '新会话',
    },
    {
      id: 58,
      session_name: '新3会0',
    },
    {
      id: 49,
      session_name: '新会话',
    },
  ],
  state: 1,
  message: '操作成功',
}
export type MessageType = {
  id?: number
  role: string
  content: string
  createTime?: string
  score?: null | number
  imageUrls?: string[]
}
export const historyListResponse = {
  data: {
    list: [
      {
        id: 6134,
        role: 'user',
        content:
          "Cloning https://github.com/roy-ht/editdistance.git to c:\\users\\13265\\appdata\\local\\temp\\pip-req-build-y8w2dpm6\n  Running command git clone --filter=blob:none --quiet https://github.com/roy-ht/editdistance.git 'C:\\Users\\13265\\AppData\\Local\\Temp\\pip-req-build-y8w2dpm6'\n  Resolved https://github.com/roy-ht/editdistance.git to commit 3f5a5b0299f36662349df0917352a42c620e3dd4\n  Installing build dependencies ... done\n  Getting requirements to build wheel ... done\n  Preparing metadata (pyproject.toml) ... done\nBuilding wheels for collected packages: editdistance\n  Building wheel for editdistance (pyproject.toml) ... error\n  error: subprocess-exited-with-error\n\n  × Building wheel for editdistance (pyproject.toml) did not run successfully.\n  │ exit code: 1\n  ╰─> [14 lines of output]\n      running bdist_wheel\n      running build\n      running build_py\n      creating build\n      creating build\\lib.win-amd64-cpython-312\n      creating build\\lib.win-amd64-cpython-312\\editdistance\n      copying editdistance\\__init__.py -> build\\lib.win-amd64-cpython-312\\editdistance\n      copying editdistance\\__init__.pxd -> build\\lib.win-amd64-cpython-312\\editdistance\n      copying editdistance\\_editdistance.h -> build\\lib.win-amd64-cpython-312\\editdistance\n      copying editdistance\\bycython.pxd -> build\\lib.win-amd64-cpython-312\\editdistance\n      copying editdistance\\def.h -> build\\lib.win-amd64-cpython-312\\editdistance\n      running build_ext\n      building 'editdistance.bycython' extension\n      error: Microsoft Visual C++ 14.0 or greater is required. Get it with \"Microsoft C++ Build Tools\": https://visualstudio.microsoft.com/visual-cpp-build-tools/\n      [end of output]\n\n  note: This error originates from a subprocess, and is likely not a problem with pip.\n  ERROR: Failed building wheel for editdistance\nFailed to build editdistance\nERROR: Could not build wheels for editdistance, which is required to install pyproject.toml-based projects",
        createTime: '2024-01-09T06:27:27.110Z',
        score: null,
      },
      {
        id: 6135,
        role: 'assistant',
        content:
          '这个错误是因为在构建`editdistance`库的过程中，需要Microsoft Visual C++ 14.0或更高版本作为构建工具，但是在你的系统中并没有找到。\n\n你可以通过下列步骤来解决这个问题：\n\n1. 访问[Microsoft官方网站](https://visualstudio.microsoft.com/zh-hans/visual-cpp-build-tools/)，下载并安装最新版本的"Microsoft C++ Build Tools"。在安装过程中，确保选中"C++ build tools"，并确保Visual C++版本为14.0或更高。\n\n2. 安装完成后，在命令行中重新运行你的安装命令。\n\n此外，如果你的系统是Windows，你还可以尝试安装Python的[windows扩展包](https://www.lfd.uci.edu/~gohlke/pythonlibs/)（wheels）。例如editdistance的windows扩展包可以在这个[链接](https://www.lfd.uci.edu/~gohlke/pythonlibs/#editdistance)中找到。下载whl文件后，使用`pip install 文件名.whl`命令进行安装。',
        createTime: '2024-01-09T06:27:27.111Z',
        score: null,
      },
      {
        id: 6136,
        role: 'user',
        content: 'ERROR: ad3-2.2.1-cp310-cp310-win32.whl is not a supported wheel on this platform.',
        createTime: '2024-01-09T06:32:45.462Z',
        score: null,
      },
      {
        id: 6137,
        role: 'assistant',
        content:
          '这个错误是因为你尝试安装的wheel文件与你的系统不兼容。根据你提供的错误信息来看，你的系统应该是32位的Windows系统。\n\n解决方法是找到与你的系统兼容的wheel文件进行安装。你可以尝试以下几种方法：\n\n1. 在[Python Extension Packages for Windows](https://www.lfd.uci.edu/~gohlke/pythonlibs/)网站中，找到适用于32位Windows系统且适合你Python版本的whl文件，然后下载并使用`pip install`命令进行安装。\n\n2. 如果你的系统允许，可以考虑升级到64位的Windows系统，这样可以更方便地安装已编译的库文件。\n\n3. 如果没有可用的预编译版本，你可以尝试通过源代码安装。首先，下载源代码压缩包（zip或tar.gz格式），解压缩后使用命令行进入解压缩后的目录，然后运行`python setup.py install`命令进行安装。请确保已经安装了所需的构建工具和依赖库。\n\n希望这些方法能够帮助你解决问题。如果还有其他疑问，请随时提问。',
        createTime: '2024-01-09T06:32:45.463Z',
        score: null,
      },
      {
        id: 6138,
        role: 'user',
        content: 'ERROR: ad3-2.2.1-cp310-cp310-win32.whl is not a supported wheel on this platform.',
        createTime: '2024-01-09T06:33:38.389Z',
        score: null,
      },
      {
        id: 6139,
        role: 'assistant',
        content:
          '你所遇到的问题是尝试在不兼容的平台上安装.wheel文件，"cp310"表示的是针对Python 3.10版本构建的，"win32"表示的是为32位的Windows操作系统构建的。如果你使用的Python版本不是3.10，或者你使用的操作系统不是32位的Windows，那么你将无法安装该.whl文件。\n\n以下是一些可能的解决方案：\n\n1. 更改Python环境：你可以升级/降级你的Python环境以匹配wheel文件的版本，例如使用Python 3.10。\n\n2. 选择合适的wheel文件：确保你正在试图安装的wheel文件与你的Python版本和操作系统相兼容。你可以在这个[链接](https://www.lfd.uci.edu/~gohlke/pythonlibs/)找到针对各种Python版本和操作系统构建的多种packages的wheel文件。\n\n3. 从源码安装：如果找不到与你的环境相匹配的wheel文件，你可以尝试从库的源码进行安装。但是这通常需要安装额外的构建工具和依赖。\n\n4. 更新系统：如果你的系统是32位的Windows，可以考虑升级为64位的Windows系统，因为大部分的Python库都是为64位的Windows系统构建的。 \n\n希望以上信息能帮助你解决问题。',
        createTime: '2024-01-09T06:33:38.390Z',
        score: null,
      },
      {
        id: 6140,
        role: 'user',
        content: '如何让vscode拥有C++ 编译环境',
        createTime: '2024-01-09T07:21:24.392Z',
        score: null,
      },
      {
        id: 6141,
        role: 'assistant',
        content:
          '为VS Code 安装C++编译环境主要有以下步骤：\n\n1. 安装C++编译器：根据你的操作系统，你需要安装一个C++编译器。对于Windows，你可以安装MinGW或者把它作为Visual Studio的一部分安装；对于Mac OS，你需要安装Xcode Command Line Tools；对于Linux，你需要安装GCC。\n\n2. 为VS Code 安装C++插件：在VS Code中，打开扩展插件商店，搜索`c++`，然后安装名为“C/C++”的插件（出版商为Microsoft）。\n\n3. 配置C++编译任务：在VS Code中，你需要配置一个编译任务来告诉VS Code如何编译C++代码。首先，打开一个C++项目的目录。然后，从菜单选择"Terminal" -> "Configure Tasks" -> "Create tasks.json file from template" -> "Others"。在创建的tasks.json文件中，你需要配置一个"shell"类型的任务，然后提供`command`参数作为C++编译命令。\n\n这个流程对于简单的C++项目应该就能满足需求。对于更复杂的项目，你可能需要进行更多的配置，比如包含头文件的路径，链接库等等。这时，可以考虑使用构建系统，如CMake、Makefile等。\n\n注意：这里的步骤可能会根据你具体的操作系统和环境有所差异，所以在操作过程中如有问题，建议参考具体的文档或向我提问。',
        createTime: '2024-01-09T07:21:24.393Z',
        score: null,
      },
      {
        id: 6142,
        role: 'user',
        content: `111`,
        createTime: '2024-01-09T07:34:43.350Z',
        score: null,
      },
      {
        id: 6143,
        role: 'assistant',
        content:
          '这个问题是由于`editdistance`库在构建时遇到了问题。`editdistance`是一个Cython库，所以在构建它的wheel文件时，需要Cython和一个C++编译器。此外，它需要一个`editdistance/bycython.pyx`文件，但是看起来它在你的环境中没有找到。\n\n你可以试试以下几种方法来解决这个问题:\n\n1. 安装Cython：如果你还没有安装Cython，你可以尝试使用`pip install cython`命令来安装。\n   \n2. 确保C++编译器的存在：确保你的系统中已经安装了一个C++编译器。如果你是在Windows上，你可能需要安装一些额外的工具，比如`Microsoft Visual C++ Build Tools`。\n\n3. 直接使用wheel文件：尝试找到一个预编译的`editdistance`的wheel文件来安装。请根据你的Python版本和操作系统版本，到[Python Extension Packages](https://www.lfd.uci.edu/~gohlke/pythonlibs/#editdistance)下载对应的.whl文件。\n\n4. 尝试安装早期版本的paddlespeech，或者安装`editdistance`的旧版本，它们可能没有当前版本的构建问题。\n\n希望这些建议能帮助你解决问题。如果问题仍然存在，可能需要寻求具备Python环境配置经验的人的帮助。',
        createTime: '2024-01-09T07:34:43.352Z',
        score: null,
      },
      {
        id: 6144,
        role: 'user',
        content:
          "  Using cached HyperPyYAML-1.2.2-py3-none-any.whl.metadata (7.6 kB)\nWARNING: Retrying (Retry(total=4, connect=None, read=None, redirect=None, status=None)) after connection broken by 'ProxyError('Cannot connect to proxy.', RemoteDisconnected('Remote end closed connection without response'))': /simple/inflect/\nCollecting inflect (from paddlespeech==0.0.0)\n  Using cached inflect-7.0.0-py3-none-any.whl.metadata (21 kB)\nCollecting jsonlines (from paddlespeech==0.0.0)\n  Using cached jsonlines-4.0.0-py3-none-any.whl.metadata (1.6 kB)\nCollecting numpy==1.23.5 (from paddlespeech==0.0.0)\n  Downloading numpy-1.23.5.tar.gz (10.7 MB)\n     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 0.0/10.7 MB 25.3 kB/s eta 0:07:04\nERROR: THESE PACKAGES DO NOT MATCH THE HASHES FROM THE REQUIREMENTS FILE. If you have updated the package versions, please update the hashes. Otherwise, examine the package contents carefully; someone may have tampered with them.\n    numpy==1.23.5 from https://files.pythonhosted.org/packages/42/38/775b43da55fa7473015eddc9a819571517d9a271a9f8134f68fb9be2f212/numpy-1.23.5.tar.gz (from paddlespeech==0.0.0):\n        Expected sha256 1b1766d6f397c18153d40015ddfc79ddb715cabadc04d2d228d4e5a8bc4ded1a\n             Got        2d8af28108884d6b57aa900917ddaadb7c84a5b563fe300b0a4984cc26d26cdf",
        createTime: '2024-01-09T07:48:28.767Z',
        score: null,
      },
      {
        id: 6145,
        role: 'assistant',
        content:
          '这个错误是由于`numpy`包的下载过程中发生了问题。错误提示信息显示，下载的`numpy-1.23.5.tar.gz`文件的哈希值与要求文件中指定的哈希值不匹配。这可能是由于网络连接问题或者下载文件被修改造成的。\n\n你可以尝试以下几种方法来解决这个问题：\n\n1. 清除pip缓存并重新安装：运行以下命令来清除pip缓存然后重新安装`paddlespeech`：\n```shell\npip cache purge\npip install paddlespeech==0.0.0\n```\n\n2. 使用`--no-cache-dir`选项：尝试使用`--no-cache-dir`选项来禁用pip的缓存机制，然后重新安装：\n```\npip install --no-cache-dir paddlespeech==0.0.0\n```\n\n3. 使用其他下载源：可以尝试更换pip的下载源，使用国内的镜像源，例如使用清华大学的pip镜像源：\n```\npip install -i https://pypi.tuna.tsinghua.edu.cn/simple paddlespeech==0.0.0\n```\n\n希望这些建议能够解决问题。如果问题仍然存在，请确保你的网络连接正常，并尝试在网络条件更好的环境下重新运行安装命令。',
        createTime: '2024-01-09T07:48:28.769Z',
        score: null,
      },
      {
        id: 6146,
        role: 'user',
        content:
          "  Using cached HyperPyYAML-1.2.2-py3-none-any.whl.metadata (7.6 kB)\nWARNING: Retrying (Retry(total=4, connect=None, read=None, redirect=None, status=None)) after connection broken by 'ProxyError('Cannot connect to proxy.', RemoteDisconnected('Remote end closed connection without response'))': /simple/inflect/\nCollecting inflect (from paddlespeech==0.0.0)\n  Using cached inflect-7.0.0-py3-none-any.whl.metadata (21 kB)\nCollecting jsonlines (from paddlespeech==0.0.0)\n  Using cached jsonlines-4.0.0-py3-none-any.whl.metadata (1.6 kB)\nCollecting numpy==1.23.5 (from paddlespeech==0.0.0)\n  Downloading numpy-1.23.5.tar.gz (10.7 MB)\n     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 0.0/10.7 MB 25.3 kB/s eta 0:07:04\nERROR: THESE PACKAGES DO NOT MATCH THE HASHES FROM THE REQUIREMENTS FILE. If you have updated the package versions, please update the hashes. Otherwise, examine the package contents carefully; someone may have tampered with them.\n    numpy==1.23.5 from https://files.pythonhosted.org/packages/42/38/775b43da55fa7473015eddc9a819571517d9a271a9f8134f68fb9be2f212/numpy-1.23.5.tar.gz (from paddlespeech==0.0.0):\n        Expected sha256 1b1766d6f397c18153d40015ddfc79ddb715cabadc04d2d228d4e5a8bc4ded1a\n             Got        2d8af28108884d6b57aa900917ddaadb7c84a5b563fe300b0a4984cc26d26cdf",
        createTime: '2024-01-09T07:49:29.478Z',
        score: null,
      },
      {
        id: 6147,
        role: 'assistant',
        content:
          '这个问题是由于当前环境网络不稳定，导致pip下载的numpy库与期望值不匹配。\n\n以下是解决此问题的一些方法：\n\n1. 重新执行`pip install`命令。如果这是一个临时的网络问题，那么重试可能会成功。\n2. 清楚缓存：使用命令`pip cache purge`清楚pip缓存，然后再重新安装。\n3. 禁用缓存：使用命令`pip install --no-cache-dir paddlespeech`可以在安装时禁用缓存。\n4. 更换下载源：比如更换为国内的一些镜像源，如阿里云，豆瓣，清华大学等。\n   \n例如：\n\n```\npip install -i https://mirrors.aliyun.com/pypi/simple paddlespeech\n```\n\n或者:\n\n```\npip install -i https://pypi.tuna.tsinghua.edu.cn/simple paddlespeech\n```\n\n希望以上方法能够解决你的问题。',
        createTime: '2024-01-09T07:49:29.479Z',
        score: null,
      },
      {
        id: 6148,
        role: 'user',
        content:
          '翻译THESE PACKAGES DO NOT MATCH THE HASHES FROM THE REQUIREMENTS FILE. If you have updated the package versions, please update the hashes. Otherwise, examine the package contents carefully; someone may have tampered with them.',
        createTime: '2024-01-09T07:59:15.557Z',
        score: null,
      },
      {
        id: 6149,
        role: 'assistant',
        content:
          '这些包的哈希值与需求文件中的哈希值不匹配。如果你已经更新了包的版本，请更新哈希值。否则，请仔细检查包的内容，可能有人对其进行了篡改。',
        createTime: '2024-01-09T07:59:15.558Z',
        score: null,
      },
      {
        id: 6150,
        role: 'user',
        content:
          'Processing c:\\e\\ysh\\paddlespeech\n  Preparing metadata (setup.py) ... done\nCollecting braceexpand (from paddlespeech==0.0.0)\n  Downloading braceexpand-0.1.7-py2.py3-none-any.whl (5.9 kB)\nCollecting editdistance (from paddlespeech==0.0.0)\n  Downloading editdistance-0.6.2.tar.gz (31 kB)\n  Installing build dependencies ... error\n  error: subprocess-exited-with-error\n\n  × pip subprocess to install build dependencies did not run successfully.\n  │ exit code: 1\n  ╰─> [17 lines of output]\n      Collecting setuptools\n        Downloading setuptools-69.0.3-py3-none-any.whl.metadata (6.3 kB)\n      Collecting wheel\n        Downloading wheel-0.42.0-py3-none-any.whl.metadata (2.2 kB)\n      Collecting Cython\n        Downloading Cython-3.0.7-cp312-cp312-win_amd64.whl.metadata (3.2 kB)\n      Downloading setuptools-69.0.3-py3-none-any.whl (819 kB)\n                                                 15.2/819.5 kB 333.3 kB/s eta 0:00:03\n      Downloading wheel-0.42.0-py3-none-any.whl (65 kB)\n                                                  0.0/65.4 kB ? eta -:--:--\n      Downloading Cython-3.0.7-cp312-cp312-win_amd64.whl (2.8 MB)\n                                                  0.0/2.8 MB 49.0 kB/s eta 0:00:57\n      ERROR: THESE PACKAGES DO NOT MATCH THE HASHES FROM THE REQUIREMENTS FILE. If you have updated the package versions, please update the hashes. Otherwise, examine the package contents carefully; someone may have tampered with them.\n          unknown package:\n              Expected sha256 385eb4edd9c9d5c17540511303e39a147ce2fc04bc55289c322b9e5904fe2c05\n                   Got        c16ef9d5ca4f055c42cd617daefcb40ea9208617fe51972e5f32eecb975e243c\n\n      [end of output]\n\n  note: This error originates from a subprocess, and is likely not a problem with pip.\nerror: subprocess-exited-with-error\n\n× pip subprocess to install build dependencies did not run successfully.\n│ exit code: 1\n╰─> See above for output.\n\nnote: This error originates from a subprocess, and is likely not a problem with pip.\n\n这个错误是什么意思',
        createTime: '2024-01-09T08:00:53.551Z',
        score: null,
      },
      {
        id: 6151,
        role: 'assistant',
        content:
          '这个错误信息主要表示在尝试安装软件包的依赖项时遇到了问题。错误提示中的“这些包的哈希值与需求文件中的哈希值不匹配。如果你已经更新了包的版本，请更新哈希值。否则，请仔细检查包的内容，可能有人对其进行了篡改。”表示pip在尝试安装软件包时，下载的文件哈希值和预期的哈希值不匹配，可能是因为网络问题导致文件下载不完整，或者下载的文件被篡改。\n\n以下是解决此问题的一些方法：\n\n1. 重新执行`pip install`命令。如果这是一个临时的网络问题，那么重试可能会成功。\n2. 清楚缓存：使用命令`pip cache purge`清楚pip缓存，然后再重新安装。\n3. 禁用缓存：使用命令`pip install --no-cache-dir paddlespeech`可以在安装时禁用缓存。\n4. 更换下载源：比如更换为国内的一些镜像源，如阿里云，豆瓣，清华大学等。\n\n例如：\n\n```\npip install -i https://mirrors.aliyun.com/pypi/simple paddlespeech\n```\n\n或者:\n\n```\npip install -i https://pypi.tuna.tsinghua.edu.cn/simple paddlespeech\n```\n  \n希望以上方法能够解决你的问题。',
        createTime: '2024-01-09T08:00:53.552Z',
        score: null,
      },
      {
        id: 6396,
        role: 'user',
        content: '朱重八是谁',
        createTime: '2024-01-23T08:11:40.484Z',
        score: null,
      },
      {
        id: 6397,
        role: 'assistant',
        content:
          '朱重八是元朝直隶行省三河所设编管州承宣州(今温岭)人，明成祖朱棣的父亲，是明朝的奠基人明太祖朱元璋的第十五子，因为他是朱元璋的第八个庶子，因此被尊称为朱重八。由于明成祖朱棣起兵夺位后宣布自己是朱重八的儿子，从而使朱重八获得了在明朝历史上的重要地位。',
        createTime: '2024-01-23T08:11:40.485Z',
        score: null,
      },
      {
        id: 6388,
        role: 'user',
        content: '我想把坐标轴的0点设置往下一点  现在是在中间',
        createTime: '2024-01-23T07:49:32.188Z',
        score: null,
      },
      {
        id: 6389,
        role: 'assistant',
        content:
          '在Three.js中，坐标原点（0，0，0）默认总是位于场景的中心。你无法改变这个原点的位置，但是你可以通过调整你的物体、摄像机或光源的位置来达到相同的效果。\n\n如果你希望看到的坐标原点位于屏幕的某个不同位置，你可以移动摄像机的位置。例如，如果你希望坐标原点下移，你可以将摄像机向上移动一定的距离：\n\n```javascript\ncamera.position.y += 10;\n```\n\n这样做，你在屏幕上看到的场景就会下移，给人感觉坐标原点也下移了。\n\n相似的，如果你想让所有物体看起来都相对于新的原点进行移动，你可以为这些物体的位置做相对应的调整。例如，如果你希望新的坐标原点下移，在添加物体时，你可以给所有物体的y轴坐标增加一个相同的值：\n\n```javascript\nvar geometry = new THREE.BoxGeometry();\nvar material = new THREE.MeshBasicMaterial({color: 0x00ff00});\nvar cube = new THREE.Mesh(geometry, material);\nscene.add(cube);\ncube.position.y += 10; // 整个模型上移，看起来就像原点下移了10个单位\n```\n\n这样做的效果是所有物体看起来都下移了，也就像坐标原点被下移了。\n\n注意这两种方法是不同的，第一种方法是改变你观察场景的位置（视角的问题），第二种方法是改变物体在场景中的位置（物体位置的问题）。根据你的实际需求，选择合适的方法。',
        createTime: '2024-01-23T07:49:32.189Z',
        score: null,
      },
      {
        id: 6390,
        role: 'user',
        content: '车水马龙出自哪里',
        createTime: '2024-01-23T08:00:58.614Z',
        score: null,
      },
      {
        id: 6391,
        role: 'assistant',
        content:
          '"车水马龙"这个词语来自于中国古代的文献。最早出现在《诗经·小雅·车辖》中，原诗为：“车水马龙，辍辍攸同。”此处的“车水马龙”指的是战车上的装饰，比喻装饰华贵的意思。\n\n后来，“车水马龙”一词的意思逐渐发展变化，通常用来形容车马络绎不绝，繁华的街市或者车水马龙的大道，强调路上行人、车辆往来如织、熙熙攘攘的场景。所以现在我们提到 "车水马龙"的意思通常是形容繁忙的街道或者是来往不绝的人群场景。',
        createTime: '2024-01-23T08:00:58.615Z',
        score: null,
      },
      {
        id: 6392,
        role: 'user',
        content: '默写《诗经·小雅·车辖》',
        createTime: '2024-01-23T08:02:19.805Z',
        score: null,
      },
      {
        id: 6393,
        role: 'assistant',
        content:
          '《诗经·小雅·车辖》全文如下：\n\n蓺麭柚柚，草木樛樛，车辖辍辍，音駗駗駗。\n\n師匠旟旟，大邦有客，飲酒孔嘉，饋帶孔康。\n\n蓺麭柚柚，草木榛榛，车辖辖辖，音析析析。\n\n师匠覃覃，大邦有客，飲酒孔偕，饋帶孔硕。\n\n蓺麭柚柚，草木菑菑，车辖泉泉，音雋雋雋。\n\n師匠人人，大邦有客，飲酒孔稾，饋帶孔良。\n\n以上就是《诗经·小雅·车辖》全文的内容。',
        createTime: '2024-01-23T08:02:19.806Z',
        score: null,
      },
      {
        id: 6394,
        role: 'user',
        content: '车水马龙，辍辍攸同。没有这句呀',
        createTime: '2024-01-23T08:03:37.293Z',
        score: null,
      },
      {
        id: 6395,
        role: 'assistant',
        content:
          '对不起，我之前的回答有误。实际上，“车水马龙”这个词并没有出自《诗经·小雅·车辖》。这个词准确地说应该是出自魏晋南北朝时期的文献。在晚清袁枚的《子不语》中，就有“车水马龙”的记载，用来形容大街上人来车往，繁华景象。\n\n"车水马龙"出自《子不语·京兆人语》，原话是“京兆为亚矣，车如流水，马如游龙。”这句便是形容京城繁华景象的语句，后来被合并成了我们现在所说的“车水马龙”。请接受我对之前错误回答的道歉，感谢你的理解。',
        createTime: '2024-01-23T08:03:37.294Z',
        score: null,
      },
      {
        id: 6398,
        role: 'user',
        content: '车车水马龙出自哪里',
        createTime: '2024-01-23T08:14:55.205Z',
        score: null,
      },
      {
        id: 6399,
        role: 'assistant',
        content:
          '“车水马龙”是一个汉语成语，出自汉代·班固等《东观汉记 ·明德马皇后》这则成语意思是车如流水，马如游龙一般，形容热闹繁华的景象。其结构为联合式，在句子中可作谓语、定语。',
        createTime: '2024-01-23T08:14:55.206Z',
        score: null,
      },
      {
        id: 6400,
        role: 'user',
        content: '你好',
        createTime: '2024-01-29T06:37:29.997Z',
        score: null,
      },
      {
        id: 6401,
        role: 'assistant',
        content: '你好！有什么我可以帮助你的吗？',
        createTime: '2024-01-29T06:37:29.999Z',
        score: null,
      },
      {
        id: 6402,
        role: 'user',
        content: '车车水马龙出自哪里',
        createTime: '2024-01-29T06:37:39.577Z',
        score: null,
      },
      {
        id: 6403,
        role: 'assistant',
        content:
          '“车水马龙”这个词语出自于明代文学家施耐庵的长篇小说《水浒传》。在小说中，有这样一句形象的描写：“进了城，看那街市上，车水马龙，人山人海。”形容了街市繁忙、人来人往的热闹景象。此后，这个成语被广泛运用，用来形容繁忙、喧闹的场面。',
        createTime: '2024-01-29T06:37:39.578Z',
        score: null,
      },
      {
        id: 6404,
        role: 'user',
        content: '朱重八是谁',
        createTime: '2024-01-29T06:37:55.301Z',
        score: null,
      },
      {
        id: 6405,
        role: 'assistant',
        content:
          '朱重八，又称朱仙镜，是中国明朝时期的一位民间英雄。他出生于浙江绍兴，是南宋时期致仕文官朱亲王（朱标）的后裔。朱重八曾经因为不满明朝政府贪污腐败而起义，带领一众义军在浙江地区活动，他们以抢劫贪官富户的财物，帮助贫苦百姓为己任。朱重八在当地企业家中举办讲座活动，他很好地解决了社会矛盾，捣毁了腐败分子的陷害信件。由于他英勇善战，以及与官府抗衡的行动，他在民间深受敬重和爱戴。朱重八的事迹也被流传成了许多民间传说和戏剧作品。',
        createTime: '2024-01-29T06:37:55.302Z',
        score: null,
      },
      {
        id: 6406,
        role: 'user',
        content: '朱重八是谁',
        createTime: '2024-01-29T06:38:10.682Z',
        score: null,
      },
      {
        id: 6407,
        role: 'assistant',
        content:
          '朱重八是中国古代戏曲《铡美案》中的人物，他本是个木匠，后来因为救人被情人误会，情人王三娘怒而投毒将朱重八毒死，朱重八生前无法申冤，死后化作恶鬼索命，最终王三娘被鬼吓死。朱重八的故事被许多地方戏曲以及京剧吸收并进行改编演出，成为了中国传统戏曲的经典剧目。',
        createTime: '2024-01-29T06:38:10.684Z',
        score: null,
      },
      {
        id: 6408,
        role: 'user',
        content: '朱重八是谁',
        createTime: '2024-01-29T06:38:38.616Z',
        score: null,
      },
      {
        id: 6409,
        role: 'assistant',
        content:
          '```js\n' +
          'const coverTextToHtml = (text: string) => {\n' +
          '  if (!text) return\n' +
          '  const render = new marked.Renderer()\n' +
          '  marked.setOptions({\n' +
          '    renderer: render, // 这是必填项\n' +
          '    gfm: true, // 启动类似于Github样式的Markdown语法\n' +
          '    pedantic: false, // 只解析符合Markdwon定义的，不修正Markdown的错误\n' +
          '    // sanitize: false, // 原始输出，忽略HTML标签（关闭后，可直接渲染HTML标签）\n' +
          '    // 高亮的语法规范\n' +
          '    highlight: (code, lang) => highlight.highlight(code, { language: lang }).value,\n' +
          '  })\n' +
          '  result = marked(text)\n' +
          '  result = result.replace(\n' +
          '    /<pre><code/g,\n' +
          '    `<pre style="position:relative;"><button class="copy-btn" style="position:absolute;top:3px;right:5px;">复制</button><code`,\n' +
          '  )\n' +
          '  return result\n' +
          '}' +
          '\n\n```',
        createTime: '2024-01-29T06:38:38.617Z',
        score: 2,
      },
    ],
    firstMessageId: 6134,
    hasMore: true,
  },
  state: 1,
  message: '操作成功',
}
