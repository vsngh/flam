Real-Time Edge Detection Viewer

Android + OpenCV-C++ + OpenGL + TypeScript (Web)
R&D Intern Technical Assessment – 3-Day Challenge

Overview

This project demonstrates a real-time camera feed processing application built for Android using OpenCV (C++), OpenGL ES, and JNI for native-level performance.
It captures frames from the device camera, sends them to C++ for processing (Canny Edge or Grayscale filter), and renders the processed output using OpenGL in real time.

A small TypeScript-based web viewer is included to display a sample processed frame, showing how native image outputs can be visualized on a web interface.

Android Application
Key Features

Camera feed integration using TextureView and Camera2 API

JNI bridge for sending frames to the native C++ layer

OpenCV-based edge detection or grayscale processing

Real-time OpenGL rendering of processed frames

Smooth frame rate performance around 15 FPS

Optional toggle between raw and processed camera feed

Web Viewer (TypeScript)

A minimal TypeScript and HTML project that displays a static processed image captured from the Android app.
It includes basic DOM updates and frame details such as resolution or FPS.
The web viewer demonstrates the ability to bridge native processing results to a simple web layer.

Project Structure

The project is organized as follows:

app/ – Java/Kotlin Android code for camera and UI

jni/ – Native C++ code for OpenCV processing

gl/ – OpenGL ES renderer and shader classes

web/ – TypeScript web viewer

assets/ – Sample processed frames or screenshots

README.md – Project documentation

Technical Details
Native (C++ and JNI)

OpenCV handles all frame processing such as edge detection and grayscale conversion

Frames are transferred from Java to C++ using JNI

Processed frames are returned as textures for OpenGL rendering

Rendering (OpenGL ES 2.0)

Vertex and fragment shaders manage the on-screen rendering

Optimized for smooth real-time performance

Web Viewer

TypeScript modules for displaying images and updating DOM elements

Displays a static processed image in the browser

Buildable using the TypeScript compiler

Architecture Flow

Camera captures live frames on Android

Frames are sent to native C++ code via JNI

C++ layer processes the frames using OpenCV

Processed frames are returned as OpenGL textures

OpenGL renders the images on the Android screen

A processed frame can be exported to the web viewer

Setup Instructions
Android

Install Android Studio

Enable NDK and CMake in SDK Manager

Add OpenCV SDK and configure it in CMakeLists.txt

Build and run on an Android device (camera permission required)

Web

Navigate to the web folder

Install dependencies if needed

npm install


Build the project

tsc


Open index.html in a browser to view the processed frame


Toggle button to switch between raw and processed camera feed

FPS counter and frame processing time logs

Basic GLSL shader for grayscale effect

Mock WebSocket endpoint for web viewer updates
