---
title: Building whisper.cpp on a Windows Laptop
date: "2023-09-09"
description: The steps for building and running whisper.cpp on my Windows laptop.
tags: ["AI","LLM","whisper.cpp"]
draft: true
---


$$
a^2 + b^2 = c^2
$$

The following steps were used to build [llama.cpp](https://github.com/ggerganov/llama.cpp) and run a llama 2 model on my Dell XPS 15 laptop running Windows 10 Professional Edition laptop.

For what it's worth, the laptop specs include:
* Intel Core i7-7700HQ 2.80 GHz
* 32 GB RAM
* 1TB NVMe SSD
* Intel HD Graphics 630
* NVIDIA GeForce GTX 1050

This guide is based off the following instructions hacker news comment:

https://news.ycombinator.com/item?id=36871730

1. Run powershell as an Administrator
1. [Install chocolatey](https://chocolatey.org/install#individual)
1. Install git: 
    ```
    choco install git
    ```
1. Clone the llama.cpp repository locally:
    ```
    git clone https://github.com/ggerganov/llama.cpp
    ```
1. [Install CMake for windows](https://cmake.org/download/)
1. Install [Visual Studio Community Edition](https://visualstudio.microsoft.com/vs/community/) with at least the following components:
    * C++ CMake tools for Windows
    * C++ Clang Compiler for Windows (16.0.5)
1. [Install the NVIDIA Cuda toolkit](https://developer.nvidia.com/cuda-downloads)
1. Download llama 2 model from here: ~https://huggingface.co/TheBloke/Llama-2-13B-chat-GGML/resolve/main/llama-2-13b-chat.ggmlv3.q4_0.bin~ (see discussion [here](https://huggingface.co/TheBloke/Llama-2-13B-chat-GGML/discussions/14)) https://huggingface.co/TheBloke/Llama-2-13B-chat-GGUF/resolve/main/llama-2-13b-chat.Q5_K_M.gguf
1. At this point I needed to create a new Visual Studio project (Cuda runtime C++) so it downloads all the necessary C++ dependencies (see [this comment](https://stackoverflow.com/a/31619842)).
1. In the llama.cpp repo, make a subdirectory and change into it:
    ```
    mkdir build
    cd build
    ```
1. Now build whisper.cpp using:
    ```
    cmake .. -DWHISPER_CUBLAS=1
    cmake --build . --config Release
    ```
1. Once it finishes building, create a models subdirectory and copy the model into it:
    ```
    cd bin/Release
    mkdir models
    mv Folder\Where\You\Downloaded\The\Model .\models
    ```
1. Finally, run the model:
    ```
     .\main.exe -m .\models\llama-2-13b-chat.Q5_K_M.gguf --color -p 'tell me some cool facts' 2> $null
    ```
    Note: the `2> $null` is used to suppress the debugging output.

Here was the response:
<hr />
Here are some cool facts about the human brain:

1. Your brain is made up of about 100 billion neurons, which are specialized cells that process and transmit information. Each neuron has an average of 7,000 synapses, or connections to other neurons, making the total number of synapses in the human brain around 1 quadrillion (1,000 trillion).
2. The human brain is incredibly energy-hungry, consuming about 20% of the body's entire energy expenditure. To put that in perspective, your brain uses more energy than your heart does.
3. Your brain weighs about 1.4 kilograms (3 pounds), but it makes up only about 2% of your body weight. Despite its small size, it contains over 100,000 kilometers (62,000 miles) of blood vessels, which is enough to circle the Earth four times.
4. The human brain is incredibly resilient and can survive for up to five minutes without oxygen before suffering permanent damage. This is because brain cells are highly adaptable and can switch to alternative sources of energy when needed.
5. Your brain has a unique "fingerprint" that is made up of the patterns of nerve fibers in your brain. This fingerprint can be used to identify you, much like a fingerprint on a crime scene.
6. The human brain is incredibly flexible and can rewire itself in response to changes in your life. This process, known as neuroplasticity, allows for the recovery of lost functions, such as language skills after a stroke, and can even help you learn new skills like playing a musical instrument.
7. Your brain has a specialized system for recognizing and remembering faces, known as the fusiform face area. This system is so powerful that it can recognize faces in just 100 milliseconds (a tenth of a second), even if the face is upside down or partially obscured.
8. The human brain has a built-in "default mode network" that helps you daydream and think about the future. This network is active when your mind is at rest, and it allows for the creation of mental scenarios and stories that help you plan and prepare for the future.
9. Your brain has a specialized system for processing music, known as the auditory cortex. This system is highly developed in humans and is responsible for our ability to appreciate and understand complex musical patterns.
10. The human brain contains around 100 billion neurons, each of which can form thousands of connections with other neurons. This incredible complexity is what gives you your unique thoughts, feelings, and experiences.