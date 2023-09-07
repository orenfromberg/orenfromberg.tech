---
title: Installing Llama2 on a Windows Laptop
date: "2023-09-07"
description: The steps I took to install Llama 2 on my Windows laptop.
tags: ["AI","LLM"]
---
my Windows 10 Pro laptop is a Dell XPS 15 from around 2017:
* Intel Core i7-7700HQ 2.80 GHz
* 32 GB RAM
* 1TB NVMe SSD
* GPU 0 Intel HD Graphics 630
* GPU 2 NVIDIA GeForce GTX 1050

I started with the instructions here: https://news.ycombinator.com/item?id=36871730

1. Run powershell as an administrator
1. [install chocolatey](https://chocolatey.org/install#individual)
1. install git: 
```
choco install git
```
1. clone the llama.cpp repository locally:
```
git clone https://github.com/ggerganov/llama.cpp
```
1. [install CMake for windows](https://cmake.org/download/)
1. install visual studio community edition with at least the following components:
    * C++ CMake tools for Windows
    * C++ Clang Compiler for Windows (16.0.5)
1. [install the NVIDIA Cuda toolkit](https://developer.nvidia.com/cuda-downloads)
1. Download llama 2 model from here: ~https://huggingface.co/TheBloke/Llama-2-13B-chat-GGML/resolve/main/llama-2-13b-chat.ggmlv3.q4_0.bin~ (see discussion [here](https://huggingface.co/TheBloke/Llama-2-13B-chat-GGML/discussions/14)) https://huggingface.co/TheBloke/Llama-2-13B-chat-GGUF/resolve/main/llama-2-13b-chat.Q5_K_M.gguf
1. At this point I needed to create a new Visual Studio project (Cuda runtime C++) so it downloads all the necessary C++ dependencies (see [this comment](https://stackoverflow.com/a/31619842)).
1. In the llama.cpp repo, make a subdirectory and change into it:
    ```
    mkdir build
    cd build
    ```
1. Now build llama.cpp:
    ```
    PS C:\Users\orenf\llama.cpp\build> cmake .. -DLLAMA_CUBLAS=ON
    -- Building for: Visual Studio 17 2022
    -- Selecting Windows SDK version 10.0.22621.0 to target Windows 10.0.19045.
    -- The C compiler identification is MSVC 19.37.32822.0
    -- The CXX compiler identification is MSVC 19.37.32822.0
    -- Detecting C compiler ABI info
    -- Detecting C compiler ABI info - done
    -- Check for working C compiler: C:/Program Files/Microsoft Visual Studio/2022/Community/VC/Tools/MSVC/14.37.32822/bin/Hostx64/x64/cl.exe - skipped
    -- Detecting C compile features
    -- Detecting C compile features - done
    -- Detecting CXX compiler ABI info
    -- Detecting CXX compiler ABI info - done
    -- Check for working CXX compiler: C:/Program Files/Microsoft Visual Studio/2022/Community/VC/Tools/MSVC/14.37.32822/bin/Hostx64/x64/cl.exe - skipped
    -- Detecting CXX compile features
    -- Detecting CXX compile features - done
    -- Found Git: C:/Program Files/Git/cmd/git.exe (found version "2.42.0.windows.1")
    -- Performing Test CMAKE_HAVE_LIBC_PTHREAD
    -- Performing Test CMAKE_HAVE_LIBC_PTHREAD - Failed
    -- Looking for pthread_create in pthreads
    -- Looking for pthread_create in pthreads - not found
    -- Looking for pthread_create in pthread
    -- Looking for pthread_create in pthread - not found
    -- Found Threads: TRUE
    -- Found CUDAToolkit: C:/Program Files/NVIDIA GPU Computing Toolkit/CUDA/v12.2/include (found version "12.2.140")
    -- cuBLAS found
    -- The CUDA compiler identification is NVIDIA 12.2.140
    -- Detecting CUDA compiler ABI info
    -- Detecting CUDA compiler ABI info - done
    -- Check for working CUDA compiler: C:/Program Files/NVIDIA GPU Computing Toolkit/CUDA/v12.2/bin/nvcc.exe - skipped
    -- Detecting CUDA compile features
    -- Detecting CUDA compile features - done
    -- Using CUDA architectures: 52;61;70
    -- CMAKE_SYSTEM_PROCESSOR: AMD64
    -- x86 detected
    -- Configuring done (34.7s)
    -- Generating done (0.7s)
    -- Build files have been written to: C:/Users/orenf/llama.cpp/build
    ```
1. Then run:
    ```
    PS C:\Users\orenf\llama.cpp\build> cmake --build . --config Release
    ```
1. Once it finishes building, create a models subdirectory and copy the model into it:
    ```
    cd bin/Release
    mkdir models
    mv Folder\Where\You\Downloaded\The\Model .\models
    ```
1. Finally, run the model:
    ```
    .\main.exe -m .\models\llama-2-13b-chat.ggmlv3.q4_0.bin --color -p "What is the best way to dress a hotdog?" 2> $null
    ```
It responded:

>_I have tried using ketchup, mustard, relish and sauerkraut. Also have tried using a combination of these toppings but still haven't found my perfect hot dog. Can you give me some advice on how to elevate my hot dog game?_

>_I really enjoy trying new things so if you have any unconventional or unique toppings that I might not have thought of, please let me know! I am open to anything. Thanks in advance for your help._

I hope these steps were useful to anyone playing around with llama.cpp on Windows.