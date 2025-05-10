# Web Summariser: AI-Powered Content Analysis & Chat

**Web Summariser** is an experimental browser extension designed to help you quickly understand and interact with web content using the power of Large Language Models (LLMs). Extract text from webpages, PDFs, or images, send it to your configured LLM API (like Gemini, OpenRouter, or any OpenAI-compatible endpoint), and get summaries or engage in a conversation about the content.

Inspired by [qoli/eisonAI](https://github.com/qoli/eisonAI).

**Note:** This is an experimental app made for fun and may have bugs. It is not recommended for production use at this stage.

## ✨ Features
![Resizable panel](/Screenshots/Light%20mode%20&%20Resize.png)
![Dark mode and settings page](/Screenshots/Dark%20mode%20&%20Settings.png)
*   **Intelligent Content Extraction**: Uses `Readability.js` to cleanly extract the main content from web pages.
*   **Versatile LLM Integration**:
    *   Connects to Gemini, OpenRouter, and other OpenAI-compatible LLM APIs.
    *   Pre-configured with defaults for OpenRouter, Gemini, and a Grok endpoint.
    *   Supports multiple API keys (comma-separated) for each provider, trying them sequentially until one works.
*   **Advanced AI Personas**: Utilizes a sophisticated prompt system with distinct personas and workflows for:
    *   **General Web Content Analyzer**: For summarizing articles, blog posts, etc.
    *   **Academic Paper Analyzer**: For in-depth analysis of research papers, including metadata extraction, keyword generation, and optional further reading searches.
    *   **Research Protocol Analyzer**: For breaking down and understanding research protocols.
*   **Summarization & Conversation**: Get quick summaries or chat with the extracted content to deepen your understanding.
*   **PDF & Image Support**:
    *   Upload and parse PDF files using `pdf.js`.
    *   Send images (from webpages or uploaded) to compatible multimodal LLM APIs.
*   **Customizable API Configuration**:
    *   Directly input API keys in the settings panel.
    *   Download current settings (including API configurations) as a JSON file.
    *   Modify the JSON to add custom API endpoints (e.g., local LLMs, Grok) or fine-tune existing ones, then upload it back.
*   **Cross-Device Sync (Optional)**: Supports syncing settings and conversation history across devices using a Redis database REST API (e.g., Upstash).
*   **User-Friendly Interface**:
    *   Use Shadow DOM to prevent influence of host style.
    *   Modern, responsive UI with glassmorphism effects.
    *   Draggable floating button to toggle the panel.
    *   Resizable panel.
    *   Dark/Light mode support (adapts to system preferences).
    *   Settings panel to manage API keys, prompt templates, model parameters (temperature, max tokens), and UI preferences.
    *   Streaming responses from LLMs for faster interaction.
    *   Toast notifications for actions like copying text or changing models.
*   **Keyboard Shortcuts**:
    *   `Cmd+S` (Mac) / `Alt+S` (Windows/Linux): Toggle the Summariser panel.
    *   `Enter` (in input field): Send message.
    *   `Esc`: Close panel.

## 🚀 Getting Started

### Installation

You can install Web Summariser in several ways:

1.  **Safari (iOS/macOS)**:
    *   Download or clone this repository.
    *   Open the `Summariser.xcodeproj` file in Xcode.
    *   Build and run the project to install the extension/app.

2.  **Chrome / Edge (and other Chromium-based browsers)**:
    *   Download or clone this repository.
    *   Open your browser's extension management page (e.g., `chrome://extensions` or `edge://extensions`).
    *   Enable "Developer mode".
    *   Click "Load unpacked" and select the `Shared (Extension)/Resources` folder from this project.

3.  **Tampermonkey / Greasemonkey (as a Userscript)**:
    *   Ensure you have the Tampermonkey (or a compatible) browser extension installed.
    *   Open the `Summariser.userscript.js` file from this project.
    *   Tampermonkey should automatically detect it and prompt you to install the script. Alternatively, you can copy its content into a new script in Tampermonkey.

### Configuration

1.  **Open the Panel**: Click the floating Summariser button on any webpage or use the `Cmd+S` / `Alt+S` shortcut.
2.  **Access Settings**: Click the settings icon (⚙️) in the panel header.
3.  **API Keys**:
    *   Input your API keys for the desired services (OpenRouter, Gemini, etc.). You can add multiple keys separated by commas.
    *   The extension will try them in order if one fails.
4.  **Default API Endpoints**:
    *   **Gemini**: `https://generativelanguage.googleapis.com/v1beta/models`
        *   Default Models: `gemini-2.5-flash-preview-04-17`, `gemini-2.5-pro-exp-03-25`
    *   **Grok**: `https://api.x.ai/v1/chat/completions`
        *   Default Models: `grok-3-fast-beta`, `grok-3-mini-fast-beta`
    *   **OpenRouter**: `https://openrouter.ai/api/v1/chat/completions`
        *   Default Models: `microsoft/mai-ds-r1:free`, `deepseek/deepseek-chat-v3-0324:free`, `tngtech/deepseek-r1t-chimera:free`, `google/gemini-2.5-pro-exp-03-25`
5.  **Custom APIs & Settings**:
    *   To use other OpenAI-compatible LLM endpoints, or to customize predefined models:
        *   In upload dropdown menu, find an option to download history/settings as JSON.
        *   Modify the `apiProviders` array in the JSON file to include your custom API details (URL, models, your API key structure).
        *   Upload the modified JSON file back through the upload interface.
6.  **Sync (Optional)**:
    *   If you want to sync your settings and conversations, you'll need to configure the Redis API endpoint details (URL, token) in the settings.

## 🛠️ How It Works

1.  **Activation**: User clicks the floating button, browser tool-bar button, or uses a shortcut.
2.  **Content Extraction**: If it's the first interaction on a page, `Readability.js` extracts the main text content.
3.  **Panel UI**: A panel slides out, displaying the chat interface.
4.  **Initial Summary**: An initial request is sent to the configured LLM API using the extracted content and the sophisticated prompt template to generate a summary or initial analysis based on the content type. `marked.js` is used to parse markdown response.
5.  **Interaction**: Users can then ask questions or give instructions related to the content in the chat input.
6.  **LLM Communication**: Messages are sent to the selected LLM API, and responses are streamed back and rendered as Markdown.
7.  **Settings Management**: User settings (API keys, model preferences, prompt, etc.) are stored locally (e.g., using `GM_setValue` for userscripts or browser local storage) and can be synced via Redis.

## 📋 Current Status & To-Do

This project is experimental and under active (hobby) development. Expect bugs!

### Known Issues & Areas for Improvement:

*   **General**:
    *   Numerous small bugs may exist.
    *   Not yet optimized for production use.
*   **iOS/macOS Webview App**:
    *   A simple iOS/macOS webview wrapper exists for the chatbox interface. It can sync with the extension.
    *   **(1) iOS Keyboard Issue**: When the keyboard appears, it can push the header out of view. A JavaScript-based fix is in place, but the transition isn't smooth.
    *   **(2) macOS Window Dragging**: The webview is extended to the full window, making the title bar transparent and thus the window difficult to move by dragging the title bar area.
    *   **(3) App Settings Reset**: The "Reset to Default Settings" button confirmation dialog (which works in the browser extension) is prevented within the standalone app, so settings cannot be easily restored to default from the app.
*   **Future Development Ideas**:
    *   More robust error handling.
    *   UI/UX refinements.
    *   Improved PDF and image handling.
    *   More customization options for APIs directly in the UI.

## 🤝 Contributing

This is a personal project, but pull requests, feedback and suggestions are welcome! If you encounter bugs or have ideas, please open an issue.

## 📜 License

This project is currently under the [GNU General Public License](LICENSE.md).

