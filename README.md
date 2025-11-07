# Editor

This is a project for a code editor component with dynamic styling capabilities.

## Folder Structure

1. `app`: Contains a test application where you can experiment with the code editor component.
2. `packages/editor`: Contains the main code editor component with classes applier and styling logic.
3. `packages/core`: Contains shared utilities and types used across the project.
4. `packages/themes`: Contains themes for the code editor component.
5. `packages/languages`: Contain configuration for compiler of various programming languages. It will be used by core package to provide syntax highlighting and other language-specific features.

   ![Package Structure](./images/Structure_dark.svg)

## Features of Editor (Technical - Performance Focused)

1. No React/Framework Dependency: The editor is built using vanilla TypeScript, ensuring compatibility across various frameworks.
2. Virtualization: Efficiently handles large files by rendering only the visible portion of the text
3. High Performance: Optimized for speed and responsiveness, even with large files and complex operations. Supports virtually unlimited file sizes (based on your RAM) without any performance degradation.
