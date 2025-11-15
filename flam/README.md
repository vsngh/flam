Real-Time Edge Detection Viewer

Android + OpenCV (C++) + OpenGL ES + TypeScript (Web)
3-Day R&D Intern Technical Challenge

Overview

This project showcases a real-time camera processing pipeline built for Android, combining OpenCV, OpenGL ES, and JNI for native-level performance. It captures frames from the device camera, sends them to a native C++ layer for processing (Canny Edge Detection or Grayscale conversion), and renders the processed output in real time using OpenGL.

Alongside the Android app, there’s a lightweight TypeScript-based web viewer that displays a sample processed frame. The web viewer demonstrates how native image outputs can be integrated and visualized within a web interface.

Android App — Key Features

Real-time camera feed using TextureView and the Camera2 API

JNI bridge for efficient frame transfer between Java and C++

OpenCV-based image processing, supporting both edge detection and grayscale filters

OpenGL ES rendering for displaying processed frames smoothly

Stable performance around 15 FPS

Toggle option to switch between raw and processed feeds

Web Viewer (TypeScript)

A simple TypeScript + HTML demo that displays a static processed frame exported from the Android app.
It includes basic UI updates like displaying frame resolution, FPS, and processing details — showcasing how native data can be visualized on the web.

Project Structure
app/      → Android Java/Kotlin code (camera + UI)
jni/      → C++ native code (OpenCV processing)
gl/       → OpenGL ES renderer and shaders
web/      → TypeScript-based web viewer
assets/   → Sample frames and screenshots
README.md → Project documentation

Technical Details
Native (C++ & JNI)

Uses OpenCV for all image processing (edge detection, grayscale, etc.)

Frames are transferred between Java and C++ via JNI

Processed frames are sent back as OpenGL textures for rendering

Rendering (OpenGL ES 2.0)

Real-time rendering handled by vertex and fragment shaders

Optimized pipeline for smooth visual output

Supports basic GLSL effects such as grayscale

Web Viewer

Written in TypeScript, compiled with tsc

Displays a static processed image

Shows metadata such as resolution and FPS

Includes a mock WebSocket endpoint to simulate real-time frame updates

Architecture Flow

Camera captures live frames on Android

Frames are passed to native C++ through JNI

C++ layer processes frames using OpenCV

Processed frames are returned as OpenGL textures

OpenGL renders the textures in real time

A processed frame can be exported and viewed on the web viewer

Setup & Build Instructions
Android

Install Android Studio

Enable NDK and CMake in SDK Manager

Add and configure the OpenCV SDK in CMakeLists.txt

Build and run on a physical Android device (ensure camera permissions are granted)

Web

Navigate to the web/ directory

Install dependencies

npm install


Build the TypeScript project


Open index.html in a browser to view the sample processed frame

Additional Features

Toggle button for switching between raw and processed camera feed

Real-time FPS counter and processing time logger

Basic GLSL shader for grayscale effects

Mock WebSocket to simulate frame streaming to the web viewer
