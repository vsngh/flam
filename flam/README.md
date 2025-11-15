Real-Time Edge Detection Viewer

This project is a simple Android + Native (C++) + Web setup that demonstrates how to:

Capture camera frames on Android

Process each frame using OpenCV in C++ (via JNI)

Display the processed output using OpenGL ES

Show a sample processed frame on a small TypeScript web viewer

The goal is to show end-to-end integration of Android, NDK, OpenCV, OpenGL, and a basic web component.

⭐ What the Project Includes
Android App

Live camera feed

Frames sent to native C++ layer using JNI

OpenCV processing (Canny Edge Detection / Grayscale)

Output rendered on screen using OpenGL ES

Basic UI with an optional toggle (Raw ↔ Processed)

Native (C++ / NDK)

OpenCV-based image processing

Efficient frame conversion and handling

Clean JNI interface connecting Java ↔ C++

Web Viewer

Simple HTML + TypeScript page

Displays a sample processed frame (static/base64)

Shows basic info like resolution or FPS (dummy)

⚙️ How to Run

Open the Android project in Android Studio

Make sure NDK + CMake + OpenCV SDK are configured

Build & run on a physical Android device

Open /web/index.html in the browser to see the sample frame view
