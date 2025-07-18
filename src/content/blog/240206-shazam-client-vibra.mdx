---
title: 'vibra—A C++ Version Client of the Song Recognition Service, Shazam'
description: 'What’s the song playing right now?'
pubDate: 'Feb 06 2024'
heroImage: '/thumbnails/shazam-vibra.webp'
categories: ['Open Source', 'English']
authors: ['jayden']
tags: ['shazam', 'vibra', 'c++', 'DSP']
---

I often listen to music on LP, and due to the nature of LPs, I usually end up playing the whole album. This makes it hard to know the title of the track I’m currently listening to, what track number it is, or even who contributed to it.

That’s when I thought it would be great to have a solution that could continuously recognize the music playing and provide me with that information.

So, how do we recognize songs?

## Shazam — Music Recognizer

Shazam is an application that provides music recognition services. When a user records a snippet of the music they’re listening to, it identifies the song and displays information like the artist, song title, and album details.

It was acquired by Apple in 2018, and has since been integrated into iOS as a native feature.

![](/assets/shazam-in-ios.webp)

## ShazamKit and SongRec

Apple provides Shazam to developers in the form of an SDK called ShazamKit. ShazamKit can be used on iOS and Android, and it’s accessible to those registered as Apple developers.
However, I wanted to use it on small Linux machines like the Raspberry Pi. If I were to develop a music recognition app for a smartphone, that phone would be unusable while recognizing music, and I felt it lacked scalability.

Although one option was to install Android on a Raspberry Pi, I also needed to consider smaller, less powerful devices.

That’s when I came across an open-source project called SongRec.

They reversed Shazam’s Android app to uncover the Shazam API. By sending recorded data to that URL, it would return song information. It was the perfect open-source solution for what I needed.

I forked the project immediately and removed the entire GTK-based GUI, adapting it for my own project.

- cli-only songrec: https://github.com/BayernMuller/songrec-rust

## Developing Vibra

I was quite satisfied with the project using SongRec. I even completed a smart home solution called Mooding, which controls lighting based on the recognized song information.
For instance, if the album cover’s primary color is blue, the system automatically turns on blue lights.

<iframe width="560" height="315" src="https://www.youtube.com/embed/f88EUEIohI4?si=pLyEVBsJvoBKn1UT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

However, the process of recognizing songs was too slow. It lagged when a new song started, and because of the delayed response, real-time lyric syncing didn’t work properly.

After adding debug logs to SongRec, I realized that most of the time was spent generating the fingerprint from the recorded sound, rather than in the part that uses the Shazam API.

As I looked through the Rust code of SongRec, I found several areas that could be optimized, such as PCM data refinement and unnecessary memory copying.

So, I developed an improved C++ version of SongRec that performs the same function but operates much faster. I named it ***vibra***, after a song by Jazzyfact.

## Why is Vibra Faster?

To make Vibra faster than SongRec, I focused on optimizing the process of refining PCM data.
Shazam analyzes the frequency components using FFT and then generates the song’s fingerprint based on that. But before that, the music data is often too large, so we need to reduce its size by lowering its quality as follows:

- 16kHz
- 16bit
- Mono

This means we have 16k samples per second, with each sample representing sound within a 16-bit range, and it’s a single-channel audio source.

If you’re not familiar with the PCM format, it might help to read up on it first.

In Rust’s SongRec, I found that reducing the sample rate, converting to 16-bit, and converting multi-channel to mono were handled in separate loops.

In other words, it required scanning the PCM data three times, which is highly inefficient.

Since SongRec also uses dependency libraries, it likely had to rely on the functions those libraries provided, thus handling the processes separately.

I decided to combine all these processes into a single loop.

![](/assets/pcm-samples.webp)

Let’s take a 48kHz, 24-bit, stereo audio file. Each sample contains 24-bit data for both the right and left channels.

First, let’s grab the first sample and convert it to a single channel. There are various methods to do this, but I’ll simply calculate the average of the two channels.

![](/assets/pcm-stereo-to-mono.webp)

Even if it’s not stereo, the principle is the same. You take the sum of all channels and divide it by the number of channels.

Converting the resulting mono sample to 16-bit is also straightforward.

![](/assets/pcm-bit-down.webp)

We use a masking operation and cast the value to a short (16-bit) type, discarding the upper 8 bits.

Now that the first sample has been converted to 16-bit mono, we need to process the next sample.

At this point, instead of taking the second sample, we take the fifth sample. Since we need to convert from 48kHz to 16kHz, we perform downsampling by taking one sample out of every four.

![](/assets/pcm-downsampling.webp)

This way, I was able to obtain the new PCM data in the desired format within a single loop.

There were other factors, such as unnecessary memory copying when slicing parts of an array, but the PCM data refinement process was the most significant optimization.

![](/assets/vibra-benchmark.webp)

I compared Vibra with the Python and Rust versions of SongRec. Vibra showed about 15 times the performance improvement over the Python version and 2 times over the Rust version.

## How to Use Vibra

Since Vibra was designed with embedded systems in mind, I tried to minimize any OS-dependent code. As a result, Vibra itself cannot handle microphone recording or song recognition directly. Instead, it provides an interface that allows you to pass raw PCM data to it for song recognition.

You can use tools like sox or ffmpeg to capture raw PCM data from a microphone and pass it to Vibra.

```bash
sox -d -t raw -b 24 -e signed-integer -r 44100 -c 1 - 2>/dev/null \
| vibra --recognize --seconds 5 --rate 44100 --channels 1 --bits 24 > result.json
```

This command reads PCM data from sox via stdin for 5 seconds and then calls the Shazam API to recognize the song using that 5-second recording.

To extract information from the results:

```bash
$ jq .track.title result.json
"Stairway To Heaven"
```

```bash
$ jq .track.subtitle result.json
"Led Zeppelin"
$ jq .track.share.href result.json
"https://www.shazam.com/track/5933917/stairway-to-heaven"
```

It retrieves song information very accurately.

## Summary

I’ve developed a fast and lightweight C++ version of a Shazam client.
I efficiently handled the process of generating low-quality PCM data before creating the fingerprint of the audio.

For more detailed code and usage instructions, feel free to visit the Vibra GitHub page. https://github.com/BayernMuller/vibra

## References

- [An Industrial-Strength Audio Search Algorithm](https://www.ee.columbia.edu/~dpwe/papers/Wang03-shazam.pdf)
- [How does Shazam work](https://www.cameronmacleod.com/blog/how-does-shazam-work)
- [SongRec: an open-source Shazam client for Linux, written in Rust.](https://github.com/marin-m/SongRec/)
