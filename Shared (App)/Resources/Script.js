const DEFAULT_SETTINGS = {
    timestamp: 0,
    apiProviders: [
        {
            name: 'Gemini',
            url: '',
            models: ['gemini-2.5-flash-preview-04-17', 'gemini-2.5-pro-exp-03-25'],
            apiKeys: ['AIzaSy....']
        },
        {
            name: 'Grok',
            url: 'https://api.x.ai/v1/chat/completions',
            models: ['grok-3-fast-beta', 'grok-3-mini-fast-beta'],
            apiKeys: ['xai-...']
        },
        {
            name: 'OpenRouter',
            url: 'https://openrouter.ai/api/v1/chat/completions',
            models: ['deepseek/deepseek-r1:free', 'deepseek/deepseek-chat-v3-0324:free', 'microsoft/mai-ds-r1:free', 'google/gemini-2.5-pro-exp-03-25'],
            apiKeys: ['sk-or-v1-...']
        }
    ],
    activeProvider: 'Gemini',
    activeModel: 'gemini-2.5-flash-preview-04-17',
    promptTemplate: `You are an AI assistant designed to analyze text content. Your primary function is to identify whether the provided text is general web content, an academic paper, or a research protocol. Based on this identification, you will assume a specific persona and follow the corresponding instructions and workflow.

[1. General Web Content Analyzer]

<persona>
You are an expert in helping users understand web content.
</persona>

<workflow>
    1. Receive text content from the user.
    2. Determine the language of the text.
    3. If the text is not in Chinese or English, translate it to British English.
    4. Summarise the content according to the specified format.
    5. Extract key points from the content and add decorative emojis.
    6. Present the summary and key points in the specified format.
</workflow>

<guidelines>
    - Summarise the content concisely in a single sentence.
    - Extract the most important points from the text.
    - Add a decorative emoji to each key point.
</guidelines>

<output_format>
    - Follow the exact format provided: "Summary: [summary sentence]\nKey points: [key point 1 with emoji]\n[key point 2 with emoji]\n..."
    - Ensure a newline character after the summary line and each key point line.
    - Do not include any additional text outside the specified format.
</output_format>

[2. Academic Paper Analyzer]

<persona>
You are a professional academic paper-summariser and research assistant.
Your primary mission is to quickly digest and objectively summarise the content of a single academic paper (provided text content) and extract its keywords.
Upon explicit user request, you can then leverage the paper's core ideas & extracted keywords to locate, filter, and present high-quality further readings, activating the full research-assistant capabilities.
</persona>

<workflow>
    1. Receive text content of the online paper from the user and capture metadata (title, authors, journal, year, DOI/URL).
    2. Identify and list 5-10 salient KEYWORDS/phrases that represent the paper's main topics.
    3. Produce a concise structured summary of the paper (core argument, methods, key findings, applied value).
    4. **Present the summary and keywords to the user.**
    5. **Await user confirmation:** Ask the user if they would like you to perform a literature search for further readings based on the extracted keywords.
    6. **If requested:**
        a. Use the extracted keywords to design precise search syntax.
        b. Search academic databases (see <search_strategy>) and retrieve ≥10 credible, high-quality articles for further reading.
        c. Verify sources, filter by quality criteria, and flag any "Credibility Pending Verification."
        d. Present the search results using the specified markdown numbered list + detailed analyses.
        e. Conclude with a state-of-the-field synthesis and targeted recommendations.
    7. **If not requested:** Conclude the interaction after providing the summary and keywords.
</workflow>

<guidelines>
    <verification> *(Applies only if search is requested)*
        - Confirm DOI/links resolve.
        - Check publisher/journal reputation.
        - Mark questionable items "Credibility Pending Verification" and supply alternatives.
    </verification>

    <content_extraction>
        - Draw only from the paper's text (abstract, introduction, methods, results, conclusion).
        - Paraphrase; avoid direct quotes unless unavoidable (<40 words, cite page/section).
        - Remain neutral and objective.
    </content_extraction>

    <keyword_extraction>
        - Prioritise technical terms, theoretical constructs, methods, and domain-specific phrases.
        - Output 5-10 keywords in descending relevance order.
    </keyword_extraction>

    <user_interaction>
        - **Crucially, only perform the literature search (<summary_table>, <detailed_analysis>, <summary_recommendations>) if the user explicitly asks for it after seeing the initial summary and keywords.**
        - If the user requests the search *and* specifies focus areas (e.g., region, sub-discipline), refine keywords and search filters accordingly.
        - Update results based on user feedback and iterate if asked *during the search phase*.
    </user_interaction>

    <formatting_rules>
        - **Paper Titles:** Always present paper titles in sentence case. **Crucially, preserve the original casing for abbreviations, acronyms, and specific technical terms (e.g., "eGFP", "DNA", "CRISPR").**
        - **Author Lists:** When listing authors, include only the first two authors' last names followed by "et al." if there are more than two authors. If there are two or fewer authors, list all last names. Example: "Smith and Jones" or "Williams et al."
    </formatting_rules>
</guidelines>

<search_strategy> *(Applies only if search is requested)*
    <databases>
        - Google Scholar
        - PubMed
        - IEEE Xplore
        - arXiv
        - bioRxiv
        - Institutional repositories (.edu, .ac.uk)
        - Major publishers (Elsevier, Springer, Nature, Wiley, ACM)
    </databases>

    <search_syntax>
        - Exact phrase: \`"keyword 1" AND "keyword 2"\`
        - Boolean combinations: \`(term1 OR term2) AND method\`
        - Author or journal: \`author:"Surname"  source:"Journal Name"\`
        - Year filter (e.g.): \`since:2019\`
    </search_syntax>

    <selection_criteria>
        - Publication date: prefer ≤5 years old (unless seminal).
        - Citations: >50 when possible (or highest in niche areas).
        - Impact factor: IF > 3 (discipline-adjusted).
        - Source credibility: peer-reviewed, reputable institution/publisher.
    </selection_criteria>
</search_strategy>

<output_format>
**Use the following structure for your response. Use standard Markdown formatting (like headers \`###\`) as shown within the structure.**

**CRITICAL NOTE ON LISTS:**
*   **STRICT PROHIBITION:** **Do NOT use hyphens (\`-\`), asterisks (\`*\`), or plus signs (\`+\`) to create these numbered lists.** Using anything other than \`Number. Space\` will cause incorrect rendering.
*   **Sub-items:** For sub-items under numbered lists (like the summary), use indentation without any list marker (\`-\`, \`*\`, \`+\`).

\`\`\`markdown
<!-- ---------- 1. INITIAL OUTPUT (Always Provided) ---------- -->
**Title**: <Paper title in sentence case, preserving specific terms like eGFP>
**Authors**: <Author list, max 2 + "et al." if more>
**Journal**: <Name> (<Year>)
**Core Argument**: <1-2 sentences>
**Research Methods**: <1 sentence>
**Key Findings**: <1-2 sentences>
**Applied Value**: <1 sentence>
**Keywords**: <List of keywords>

<!-- ---------- User Prompt (Displayed after initial output) ---------- -->
**Would you like me to search for related papers based on these keywords and provide a list of further readings?**

<!-- ---------- 2. FURTHER-READING OUTPUT (Provided ONLY if requested) ---------- -->

<!-- If user confirms, provide the following sections -->
### Further Readings
1.  **[Article title in sentence case, preserving specific terms like eGFP](URL)** (<Author list, max 2 + "et al." if more>, Year). *Journal/Source* <if known, add \`(Cited <Citation count> times)\`>.
    **Summary**: One-sentence abstract summary.
*(continue numbered list for all entries)*

### Detailed Analysis
1. **Article Title 1**
**Core Argument**: …
**Research Methods**: …
**Key Findings**: …
**Applied Value**: …

2. **Article Title 2**
…

*(continue for all entries)*

### Overview of Research Status
…

### Major Research Trends
…

### Research Consensus and Divergences
1. **Consensus: <Consensus in a few words>** <Details>
…
1. **Divergence: <Divergence in a few words>** <Details>
…

### Research Gaps
1. …
2. …
…

### **Recommended Reading Order**
1. [#3](URL): <Reason>
2. [#1](URL): <Reason>
…

### **Suggestions for Research Entry Points**
1. Entry Point 1
2. Entry Point 2
…

### **Suggestions for Further Reading (Beyond the Found List)**
**<Topic A>**: <Why relevant>
**<Topic B>**: <Why relevant>
…

</output_format>


[3. Research Protocol Analyzer]

<persona>
You are a meticulous research assistant specializing in the analysis and summarization of research protocols. Your goal is to break down the protocol into its essential components, highlight key steps, and identify potential areas for attention.
</persona>

<workflow>
    1. Receive the research protocol text from the user.
    2. Identify the main sections of the protocol (e.g., Introduction, Objectives, Methods, Participants, Procedures, Data Collection, Data Analysis, Ethical Considerations, Timeline).
    3. Summarize the overall purpose and key objectives of the protocol.
    4. Create a step-by-step outline of the main procedures described in the protocol.
    5. Extract key details related to participants (e.g., inclusion/exclusion criteria, sample size).
    6. Note key methods for data collection and analysis.
    7. Identify any specified timeline or milestones.
    8. Highlight important ethical considerations mentioned.
    9. Present the analysis in a structured format with key notes.
</workflow>

<guidelines>
    - Focus on clarity and conciseness.
    - Use bullet points or numbered lists for steps and key details.
    - Note specific parameters, equipment, or materials if crucial to the protocol.
    - Highlight any safety precautions or potential risks mentioned.
    - Maintain objectivity and accuracy in summarization.
</guidelines>

<output_format>
**Use the following structure for your response. Use standard Markdown formatting (like headers \`###\`) as shown within the structure.**

\`\`\`markdown
### Research Protocol Analysis

**Protocol Title**: <If available, otherwise "Not specified">

**Overall Purpose and Objectives**:
- <Summary of the main goal>
- <List of key objectives>

**Key Procedures (Step-by-step workflow)**:
1.  <Step 1>: <Brief description and key note>
2.  <Step 2>: <Brief description and key note>
    - <Sub-step/Note if applicable>
3.  <Step 3>: <Brief description and key note>
    *(Continue for all major steps)*

**Participants**:
- Inclusion Criteria: <List criteria>
- Exclusion Criteria: <List criteria>
- Sample Size: <Specify number if mentioned>
- <Any other relevant participant details>

**Data Collection**:
- <Methods used>
- <Types of data collected>
- <Key notes on data collection process>

**Data Analysis**:
- <Methods used>
- <Software/Tools if specified>
- <Key notes on analysis plan>

**Timeline**:
- <Key milestones or duration if mentioned>

**Ethical Considerations**:
- <List of ethical points addressed>
- <Approval bodies if mentioned>

**Key Notes and Considerations**:
- <Highlight any safety measures>
- <Mention any specific equipment or materials>
- <Note any potential challenges or deviations>
- <Any other important remarks>
\`\`\`

</output_format>`,
    maxTokens: 65536,
    temperature: 0.7,
    buttonPosition: 'left',
    redisApiUrl: 'https://****.upstash.io',
    redisApiKey: '***'
};

// State management
let state = {
    settings: JSON.parse(JSON.stringify(DEFAULT_SETTINGS)), // Deep copy
    loaded: false,
    conversation: [],
    conversationHistory: {}, // Will store saved conversations
    currentWebpageContent: '',
    modelDropdownVisible: false,
    historyDropdownVisible: false,
    uploadDropdownVisible: false,
    settingsOpen: false,
    allModels: [], // Will store all models from all providers
    pendingImage: null, // Will store image to be sent with next user message
    pendingFileContent: null, // Will store text content to be sent with next user message
    historyLoaded: false, // Flag to track if history has been loaded
    currentHistoryId: null, // Store the current history ID when loading from history
    isStreaming: false, // Flag to track if streaming is in progress
    platform: 'macos' // Default platform
};

let marked = null, baseWindowColor = null;

// Elements object to store DOM element references
const elements = {
    panel: document.querySelector('.summariser-panel'),
    conversation: document.getElementById('conversation'),
    input: document.getElementById('input'),
    sendButton: document.getElementById('sendButton'),
    settings: document.getElementById('settings'),
    settingsButton: document.getElementById('settingsButton'),
    settingsSaveButton: document.getElementById('settingsSaveButton'),
    settingsCloseButton: document.getElementById('settingsCloseButton'),
    closeButton: document.getElementById('closeButton'),
    modelDropdown: document.getElementById('modelDropdown'),
    historyButton: document.getElementById('historyButton'),
    historyDropdown: document.getElementById('historyDropdown'),
    uploadButton: document.getElementById('uploadButton'),
    uploadDropdown: document.getElementById('uploadDropdown'),
    fileInput: document.getElementById('fileInput'),
    historyFileInput: document.getElementById('historyFileInput'),
    promptTemplate: document.getElementById('promptTemplate'),
    maxTokensInput: document.getElementById('maxTokensInput'),
    maxTokensValue: document.getElementById('maxTokensValue'),
    tempInput: document.getElementById('tempInput'),
    tempValue: document.getElementById('tempValue'),
    resetButton: document.getElementById('resetButton'),
    leftButton: document.getElementById('leftButton'),
    rightButton: document.getElementById('rightButton'),
    hideButton: document.getElementById('hideButton'),
    panelTitle: document.querySelector('.summariser-panel-title'),
    redisApiInput: document.getElementById('redis-api-url'),
    redisApiKeyInput: document.getElementById('redis-api-key'),
    newConversationButton: document.getElementById('newConversationButton'),
    refreshButton: document.getElementById('refreshButton'),
    toggleRedisUrlButton: document.getElementById('toggleRedisUrlButton'),
    toggleRedisKeyButton: document.getElementById('toggleRedisKeyButton')
};

// Utilities
const util = {
    async saveSettings(synced = true) {
        if (typeof browser !== 'undefined' && browser.storage) {
            await browser.storage.local.set({ 'summariserSettings': JSON.stringify(state.settings) });
        }

        if (!synced && state.settings.redisApiUrl && state.settings.redisApiKey) {
            state.settings.timestamp = Date.now().toString();
            try {
                // Save settings to Redis
                const response = await fetch(`${state.settings.redisApiUrl}/set/summariserSettings`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${state.settings.redisApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(state.settings)
                });

                if (!response.ok) {
                    throw new Error(`Redis API responded with status ${response.status}`);
                }
                console.log('Settings saved to Redis.');
                showToast('Settings saved to Redis.');
            } catch (e) {
                console.error('Failed to save settings to Redis:', e);
            }
        }
    },

    async loadSettings() {
        try {
            // If in a browser extension context
            if (typeof browser !== 'undefined' && browser.storage) {
                // Load from browser storage
                const result = await browser.storage.local.get('summariserSettings');
                let localSettings = null;

                if (result.summariserSettings) {
                    localSettings = JSON.parse(result.summariserSettings);
                    state.settings = localSettings;
                }
            }
        } catch (e) {
            console.error('Failed to load settings:', e);
        }
    },

    async saveConversationHistory() {
        if (typeof browser !== 'undefined' && browser.storage) {
            // Save to browser storage
            await browser.storage.local.set({ 'summariserHistory': JSON.stringify(state.conversationHistory) });
        }

        // Sync with Redis if URL is available
        if (state.settings.redisApiUrl && state.currentHistoryId) {
            try {
                // Save the current conversation to Redis
                const conversation = state.conversationHistory[state.currentHistoryId];
                if (conversation) {
                    await fetch(`${state.settings.redisApiUrl}/set/summariserHistory${state.currentHistoryId}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${state.settings.redisApiKey}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(conversation)
                    });
                }
            } catch (e) {
                console.error('Failed to sync conversation history with Redis:', e);
            }
        }
    },

    async loadConversationHistory() {
        try {
            if (typeof browser !== 'undefined' && browser.storage) {
                // Load from browser storage
                const result = await browser.storage.local.get('summariserHistory');
                if (result.summariserHistory) {
                    state.conversationHistory = JSON.parse(result.summariserHistory);
                } else {
                    state.conversationHistory = {};
                }
            }

            // Sync with Redis if URL is available
            if (state.settings.redisApiUrl) {
                try {
                    // Get list of all keys from Redis
                    const response = await fetch(`${state.settings.redisApiUrl}/scan/0/match/summariserHistory%2A`, {
                        headers: {
                            'Authorization': `Bearer ${state.settings.redisApiKey}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        const keys = data.result && Array.isArray(data.result) && data.result.length > 1
                            ? data.result[1]
                            : [];

                        // First get all current local history
                        const localHistoryIds = new Set(Object.keys(state.conversationHistory));

                        // For each Redis key, add any missing conversations to local storage
                        if (keys && keys.length > 0) {
                            for (const key of keys) {
                                // Extract the ID from the Redis key
                                const historyId = key.replace('summariserHistory', '');

                                // If this ID doesn't exist in local storage, fetch and add it
                                if (!localHistoryIds.has(historyId)) {
                                    const valueResponse = await fetch(`${state.settings.redisApiUrl}/get/${key}`, {
                                        headers: {
                                            'Authorization': `Bearer ${state.settings.redisApiKey}`
                                        }
                                    });
                                    if (valueResponse.ok) {
                                        const data = await valueResponse.json();
                                        const conversation = JSON.parse(data.result);
                                        state.conversationHistory[historyId] = conversation;
                                    }
                                }
                            }

                            // Now add any local conversations that don't exist in Redis
                            const redisKeySet = new Set(keys.map(k => k.replace('summariserHistory', '')));
                            for (const historyId of localHistoryIds) {
                                // If this local history doesn't exist in Redis, add it
                                if (!redisKeySet.has(historyId)) {
                                    try {
                                        await fetch(`${state.settings.redisApiUrl}/set/summariserHistory${historyId}`, {
                                            method: 'POST',
                                            headers: {
                                                'Authorization': `Bearer ${state.settings.redisApiKey}`,
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(state.conversationHistory[historyId])
                                        });
                                    } catch (e) {
                                        console.error(`Failed to sync conversation ${historyId} to Redis:`, e);
                                    }
                                }
                            }

                            // Save synchronised history back to browser storage
                            if (typeof browser !== 'undefined' && browser.storage) {
                                await browser.storage.local.set({ 'summariserHistory': JSON.stringify(state.conversationHistory) });
                            }
                        } else {
                            console.log('No conversation history found in Redis.');
                        }
                    }
                } catch (e) {
                    console.error('Failed to sync with Redis:', e);
                }
            }

            state.historyLoaded = true;
        } catch (e) {
            console.error('Failed to load conversation history:', e);
            state.conversationHistory = {};
            state.historyLoaded = true;
        }
    },

    async deleteConversationHistory(historyId) {
        // Delete from local storage
        if (state.conversationHistory[historyId]) {
            delete state.conversationHistory[historyId];
            if (typeof browser !== 'undefined' && browser.storage) {
                await browser.storage.local.set({ 'summariserHistory': JSON.stringify(state.conversationHistory) });
            }
        }

        // Delete from Redis if URL is available
        if (state.settings.redisApiUrl) {
            try {
                await fetch(`${state.settings.redisApiUrl}/del/summariserHistory${historyId}`, {
                    headers: {
                        'Authorization': `Bearer ${state.settings.redisApiKey}`
                    }
                });
            } catch (e) {
                console.error('Failed to delete conversation from Redis:', e);
            }
        }
    },

    getActiveProvider() {
        return state.settings.apiProviders.find(p => p.name === state.settings.activeProvider);
    },

    getProviderForModel(modelName) {
        for (const provider of state.settings.apiProviders) {
            if (provider.models.includes(modelName)) {
                return provider;
            }
        }
        return util.getActiveProvider(); // Fallback
    },

    truncateText(text, maxTokens) {
        // Roughly estimate tokens (words) and truncate if too long
        const words = text.split(/\s+/);
        if (words.length > maxTokens) {
            showToast(`Truncating ${words.length} text to ${maxTokens} tokens...`);
            return words.slice(0, maxTokens).join(' ') + '...';
        }
        return text;
    },

    // Compile a list of all models from all providers
    getAllModels() {
        const models = [];
        state.settings.apiProviders.forEach(provider => {
            provider.models.forEach(model => {
                models.push({
                    name: model,
                    provider: provider.name
                });
            });
        });
        return models;
    },

    // Convert a file to base64
    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    },

    // Parse a file and extract content
    async parseFile(file) {
        const fileType = file.type;

        // Handle different file types
        if (fileType.startsWith('image/')) {
            return this.fileToBase64(file).then(base64data => {
                // Store the image for the next user message
                state.pendingImage = base64data;
                return `[Image: ${file.name}]`;
            });
        } else if (fileType === 'application/pdf') {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = () => {
                    state.pendingFileContent = reader.result;
                    resolve(reader.result);
                };
                reader.onerror = error => reject("Error reading PDF file");
            });
        } else if (fileType === 'text/plain') {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = () => {
                    // Store the content for the next user message
                    state.pendingFileContent = reader.result;
                    resolve(reader.result);
                };
                reader.onerror = error => reject("Error reading file");
            });
        } else {
            return `Unsupported file type: ${fileType}`;
        }
    },

    // Get formatted date for history names
    getFormattedDate() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        return {
            ddmm: `${day}${month}`,
            time: `${hours}:${minutes}`
        };
    },

    // Extract thought content from AI response
    extractThoughtContent(response, provider) {
        // For Gemini
        if (provider === 'Gemini' && response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.thought === true) {
                    return part.text || '';
                }
            }
        }

        // For OpenRouter/GitHub
        if ((provider === 'OpenRouter' || provider === 'GitHub') && response.choices) {
            // Look for thought in OpenRouter/GitHub formats
            // This depends on how they format it, we need to check if it's in tool_calls or other formats
            if (response.choices[0].message && response.choices[0].message.tool_calls) {
                for (const toolCall of response.choices[0].message.tool_calls) {
                    if (toolCall.function && toolCall.function.name === 'thinking') {
                        return toolCall.function.arguments ? JSON.parse(toolCall.function.arguments).thought : '';
                    }
                }
            }

            // Alternative format - check if there's a thinking tag in the content
            if (response.choices[0].message && response.choices[0].message.content) {
                const content = response.choices[0].message.content;
                const thinkingMatch = content.match(/<thinking>([\s\S]*?)<\/thinking>/);
                if (thinkingMatch && thinkingMatch[1]) {
                    return thinkingMatch[1].trim();
                }
            }
        }

        return null; // No thought content found
    }
};

// Platform detection
function show(platform) {
    document.body.classList.add(`platform-${platform}`);
    state.platform = platform;
    if (platform === 'ios') {
        const img = new Image();
        const date = new Date(Date.now() - 5400000).toISOString().slice(0, 10).replace(/-/g, '');
        img.onerror = () => {
            document.querySelector('.summariser-container').style.background = 'url(https://yhl.ac.cn/wallpaper?type=mobile) center / cover no-repeat';
        };
        img.src = `https://yhl.ac.cn/${date.slice(0, -2)}/${date}-mobile.webp`;
        document.querySelector('.summariser-container').style.background = `url(${img.src}) center / cover no-repeat`;
    }
}

// MacOS preferences function
function closeApp() {
    webkit.messageHandlers.controller.postMessage("close");
}

// Show a toast notification
function showToast(message, duration = 3000) {
    // Remove existing toast if present
    const existingToast = document.querySelector('.summariser-toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'summariser-toast summariser-glassmorphism';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('summariser-fade-out');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

// Copy text to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    }
}

// Load chat history into dropdown
async function loadChatHistoryDropdown() {
    // Load chat history if not already loaded
    if (!state.historyLoaded) {
        await util.loadConversationHistory();
    }

    // Clear previous items except the header
    const historyDropdownHeader = elements.historyDropdown.querySelector('.summariser-dropdown-header');
    elements.historyDropdown.innerHTML = '';
    elements.historyDropdown.appendChild(historyDropdownHeader);

    // If no history, add a message
    if (Object.keys(state.conversationHistory).length === 0) {
        const noHistoryMsg = document.createElement('div');
        noHistoryMsg.className = 'summariser-model-option summariser-history-empty';
        noHistoryMsg.textContent = 'No saved conversations';
        elements.historyDropdown.appendChild(noHistoryMsg);
        return;
    }

    // Add each history item to dropdown
    const sortedHistory = Object.entries(state.conversationHistory)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0])); // Sort by timestamp (newest first)

    for (const [historyId, historyData] of sortedHistory) {
        const historyOption = document.createElement('div');
        historyOption.className = 'summariser-model-option';
        historyOption.setAttribute('data-history-id', historyId);

        const nameSpan = document.createElement('span');
        nameSpan.textContent = historyData.name || `Chat ${historyId.substring(0, 8)}`;
        historyOption.appendChild(nameSpan);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'summariser-panel-button-circle summariser-history-remove';
        removeBtn.setAttribute('data-history-id', historyId);
        removeBtn.innerHTML = `
<svg width="14" height="14" viewBox="0 0 24 24">
  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
</svg>
`;
        removeBtn.style.background = 'transparent';
        removeBtn.style.border = 'none';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.padding = '2px';
        removeBtn.style.marginLeft = 'auto';
        removeBtn.title = 'Remove conversation';

        historyOption.appendChild(removeBtn);
        elements.historyDropdown.appendChild(historyOption);
    }
}

// Prompt for URL input
function promptForUrl() {
    const url = prompt('Enter URL of file to upload:');
    if (url) {
        fetchFileFromUrl(url);
    }
}

// Fetch file from URL
async function fetchFileFromUrl(url) {
    try {
        showToast('Fetching file from URL...');
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        // Get file type from content-type header
        const contentType = response.headers.get('content-type');
        if (contentType.startsWith('image/')) {
            // Handle image
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            handleImageUrl(imageUrl, url.split('/').pop());
        } else if (contentType === 'application/pdf') {
            showToast('Loading PDF content...');
            const text = await response.text();
            state.pendingFileContent = text;
            showToast('PDF loaded successfully. Your next message will include this PDF content.');
        } else {
            // Handle other content
            const text = await response.text();
            // Store the content for next user message
            state.pendingFileContent = text;
            showToast('File loaded successfully. Your next message will include this file.');
        }
    } catch (error) {
        console.error('Error fetching file:', error);
        showToast(`Error: ${error.message}`);
    }
}

// Handle file upload
async function handleFileUpload(file) {
    try {
        showToast(`Processing ${file.name}...`);

        const fileContent = await util.parseFile(file);

        if (file.type.startsWith('image/')) {
            // For images, we've already stored the image in state.pendingImage
            showToast('Image uploaded successfully. Your next message will include this image.');

            // Add a preview of the image to the conversation area
            if (state.pendingImage) {
                const imgElement = document.createElement('img');
                imgElement.src = state.pendingImage;
                imgElement.alt = "Uploaded";
                imgElement.style.maxWidth = "100%";
                imgElement.style.maxHeight = "200px";
                imgElement.style.marginRight = "10px";
                imgElement.style.borderRadius = "8px";

                // Create a preview container
                const previewContainer = document.createElement('div');
                previewContainer.className = 'summariser-file-preview';
                previewContainer.innerHTML = `<div class="summariser-file-preview-header">Uploaded Image: ${file.name}</div>`;
                previewContainer.appendChild(imgElement);

                // Add to the conversation area
                elements.conversation.appendChild(previewContainer);
                elements.conversation.scrollTop = elements.conversation.scrollHeight;
            }
        } else if (file.type === 'application/pdf') {
            // For PDFs, show a preview of the first few lines
            showToast('PDF uploaded successfully. Your next message will include this PDF content.');

            if (state.pendingFileContent) {
                // Get first few lines for preview
                const previewLines = state.pendingFileContent.split('\n').slice(0, 10).join('\n');

                const pdfPreview = document.createElement('div');
                pdfPreview.className = 'summariser-file-preview';
                pdfPreview.innerHTML = `
        <div class="summariser-file-preview-header">Uploaded PDF: ${file.name}</div>
        <div class="summariser-file-preview-content">${previewLines}
        <div class="summariser-file-preview-footer">${Math.round(state.pendingFileContent.length / 1000)}KB of text extracted</div>
        </div>
      `;
                elements.conversation.appendChild(pdfPreview);
                elements.conversation.scrollTop = elements.conversation.scrollHeight;
            }
        } else {
            // For text files, we've stored the content in state.pendingFileContent
            showToast('File uploaded successfully. Your next message will include this file content.');

            // Add a preview of the file to the conversation area
            if (state.pendingFileContent) {
                const filePreview = document.createElement('div');
                filePreview.className = 'summariser-file-preview';
                filePreview.innerHTML = `
        <div class="summariser-file-preview-header">Uploaded File: ${file.name}</div>
        <div class="summariser-file-preview-content">${state.pendingFileContent.length > 300 ?
                        state.pendingFileContent.substring(0, 300) + '...' :
                        state.pendingFileContent}</div>
      `;
                elements.conversation.appendChild(filePreview);
                elements.conversation.scrollTop = elements.conversation.scrollHeight;
            }
        }
    } catch (error) {
        console.error('Error processing file:', error);
        showToast(`Error: ${error.message}`);
    }
}

// Handle image file
function handleImageUrl(url, filename = 'image') {
    // Store the image for the next user message
    state.pendingImage = url;

    // Create a temporary image element to load the image
    const img = new Image();
    img.onload = function () {
        // Add message about the image dimensions
        showToast(`Image loaded: ${img.width}x${img.height} pixels. Your next message will include this image.`);

        // Add the image to the prompt
        const imgElement = document.createElement('img');
        imgElement.src = url;
        imgElement.style.maxWidth = "100%";
        imgElement.style.maxHeight = "200px";
        imgElement.style.marginRight = "10px";
        imgElement.style.borderRadius = "8px";

        // Create a preview container
        const previewContainer = document.createElement('div');
        previewContainer.className = 'summariser-file-preview';
        previewContainer.innerHTML = `<div class="summariser-file-preview-header">Uploaded Image: ${filename}</div>`;
        previewContainer.appendChild(imgElement);

        // Add to the conversation area
        elements.conversation.appendChild(previewContainer);
        elements.conversation.scrollTop = elements.conversation.scrollHeight;
    };

    img.onerror = function () {
        showToast('Error loading image');
        state.pendingImage = null;
    };

    img.src = url;
}

// Download chat history as JSON
function downloadChatHistory() {
    try {
        // Create a JSON object with conversation and settings
        const historyData = {
            conversation: state.conversation,
            conversationHistory: state.conversationHistory,
            settings: state.settings,
            timestamp: new Date().toISOString()
        };

        // Convert to JSON string
        const jsonString = JSON.stringify(historyData, null, 2);

        // Create a blob and generate download link
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Create temporary download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-history-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

        showToast('Chat history downloaded');
    } catch (error) {
        console.error('Error downloading chat history:', error);
        showToast('Error downloading chat history');
    }
}

// Load chat history from JSON file
async function loadChatHistory(file) {
    try {
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const historyData = JSON.parse(e.target.result);

                // Validate the history file structure
                if (!historyData.conversation || !Array.isArray(historyData.conversation)) {
                    throw new Error('Invalid chat history format');
                }

                // Update the conversation state
                state.conversation = historyData.conversation;

                // Load any saved conversation history if available
                if (historyData.conversationHistory) {
                    state.conversationHistory = historyData.conversationHistory;

                    // Save the imported history to local storage
                    if (typeof browser !== 'undefined' && browser.storage) {
                        browser.storage.local.set({ 'summariserHistory': JSON.stringify(state.conversationHistory) });
                    }
                    util.loadConversationHistory();
                }

                // Optionally update settings if they exist in the file
                if (historyData.settings) {
                    state.settings = historyData.settings;
                    updateUIFromSettings();
                    util.saveSettings();
                }

                // Clear and rebuild the conversation UI
                elements.conversation.innerHTML = '';
                state.conversation.forEach((message, index) => {
                    addMessage(message.text, message.role, false, index, message.thought, message.image);
                });
                showToast('Chat history loaded successfully');
            } catch (parseError) {
                console.error('Error parsing chat history:', parseError);
                showToast('Error: Invalid chat history file');
            }
        };

        reader.onerror = function () {
            showToast('Error reading file');
        };

        reader.readAsText(file);
    } catch (error) {
        console.error('Error loading chat history:', error);
        showToast(`Error: ${error.message}`);
    }
}

// Reset conversation
function resetConversation() {
    state.conversation = [];
    elements.conversation.innerHTML = '';
}

// Save the current conversation to history
function saveCurrentConversation() {
    // Only save if there are messages and at least one AI response
    if (state.conversation.length === 0) return;

    // Check if there's at least one AI response
    const hasAIResponse = state.conversation.some(msg => msg.role === 'assistant');
    if (!hasAIResponse) return;

    // Create a new history entry or use the existing one if loaded from history
    let historyId = state.currentHistoryId;

    if (!historyId) {
        // Create a new history ID if none exists
        const date = util.getFormattedDate();
        let title = document.title;
        // Trim title if too long
        if (title.length > 20) {
            title = title.substring(0, 20) + '...';
        }

        // Create a unique ID for this conversation using timestamp
        historyId = Date.now().toString();
        state.currentHistoryId = historyId;

        // Add to history
        state.conversationHistory[historyId] = {
            name: `${date.ddmm} ${title}`,
            conversation: []
        };
    }

    // Update the conversation in history
    state.conversationHistory[historyId].conversation = state.conversation;

    // Save to storage
    util.saveConversationHistory();
}

// Add a message to the conversation
function addMessage(text = '', role, isLoading = false, index = -1, thought = null, image = null) {
    // Check if there's an image to display
    if (image !== null && image !== undefined) {
        const filename = image.includes('/') ? image.split('/').pop().split('?')[0] : 'image';
        handleImageUrl(image, filename);
    }
    if (role === 'system') return;
    // Calculate the correct index for the UI
    let messageIndex;
    messageIndex = index !== -1 ? index : state.conversation.length - 1;
    if (index === -1 && role === 'user') {
        messageIndex += 1;
    }
    const messageDiv = document.createElement('div');
    messageDiv.className = `summariser-message ${role === 'assistant' ? 'summariser-message-ai' : role === 'user' ? 'summariser-message-user' : ''}`;
    messageDiv.setAttribute('data-index', messageIndex);
    let prevMessageDiv = null;
    if (index !== -1) {
        prevMessageDiv = elements.conversation.querySelector(`.summariser-message[data-index="${index - 1}"]`);
    }
    if (isLoading) {
        messageDiv.innerHTML = '<div class="summariser-loading"></div>';
    } else {
        if (role === 'assistant') {
            messageDiv.innerHTML = marked.parse(text);

            // Add action buttons (regenerate, copy, and thought toggle if applicable)
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'summariser-message-actions';

            // Copy button
            actionsDiv.innerHTML = `
        <button class="summariser-action-button summariser-copy-button" data-index="${messageIndex}" title="Copy response">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
        </button>
      `;

            // Add thought toggle button if thought exists
            if (thought) {
                const thoughtId = `thought-${Date.now()}-${messageIndex}`;
                const thoughtToggleButton = document.createElement('button');
                thoughtToggleButton.className = 'summariser-action-button summariser-thought-toggle';
                thoughtToggleButton.setAttribute('data-thought-id', thoughtId);
                thoughtToggleButton.setAttribute('title', 'Show thought process');

                // Add SVG icon for showing thoughts
                thoughtToggleButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
        `;
                actionsDiv.appendChild(thoughtToggleButton);

                // Create thought process element
                const thoughtDiv = document.createElement('div');
                thoughtDiv.className = 'summariser-thought-process';
                thoughtDiv.setAttribute('data-thought-id', thoughtId);
                thoughtDiv.innerHTML = marked.parse(thought);

                // Add the thought div after adding actionsDiv
                setTimeout(() => {
                    messageDiv.appendChild(thoughtDiv);
                }, 0);
            }

            // Regenerate button
            actionsDiv.innerHTML += `
        <button class="summariser-action-button summariser-regenerate-button" data-index="${messageIndex}" title="Regenerate response">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
        </button>
      `;

            messageDiv.appendChild(actionsDiv);
        } else {
            messageDiv.textContent = text;
        }
    }

    if (prevMessageDiv) {
        if (prevMessageDiv.nextSibling) {
            elements.conversation.insertBefore(messageDiv, prevMessageDiv.nextSibling);
        } else {
            elements.conversation.appendChild(messageDiv);
        }
    } else {
        elements.conversation.appendChild(messageDiv);
    }
    elements.conversation.scrollTop = elements.conversation.scrollHeight;

    return messageDiv;
}

// Update a loading message with content
function updateLoadingMessage(messageDiv, text, index = -1, thought = null) {
    // If it's an AI message, parse markdown
    messageDiv.innerHTML = marked.parse(text);

    let messageIndex;
    if (index === -1) {
        messageIndex = state.conversation.length;
        state.conversation.push({
            text,
            role: 'assistant',
            thought
        });
    } else {
        messageIndex = index;
        state.conversation[index] = {
            text,
            role: 'assistant',
            thought
        };
    }
    saveCurrentConversation();
    // Update the data-index attribute to ensure it matches the array index
    messageDiv.setAttribute('data-index', messageIndex);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'summariser-message-actions';

    // Copy button
    actionsDiv.innerHTML = `
    <button class="summariser-action-button summariser-copy-button" data-index="${messageIndex}" title="Copy response">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
      </svg>
    </button>
  `;

    // Add thought toggle button if thought exists
    if (thought) {
        const thoughtId = `thought-${Date.now()}-${messageIndex}`;
        const thoughtToggleButton = document.createElement('button');
        thoughtToggleButton.className = 'summariser-action-button summariser-thought-toggle';
        thoughtToggleButton.setAttribute('data-thought-id', thoughtId);
        thoughtToggleButton.setAttribute('title', 'Show thought process');

        // Add SVG icon for showing thoughts
        thoughtToggleButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
    </svg>
  `;
        actionsDiv.appendChild(thoughtToggleButton);

        // Create thought process element
        const thoughtDiv = document.createElement('div');
        thoughtDiv.className = 'summariser-thought-process';
        thoughtDiv.setAttribute('data-thought-id', thoughtId);
        thoughtDiv.innerHTML = marked.parse(thought);

        // Add the thought div after adding actionsDiv
        setTimeout(() => {
            messageDiv.appendChild(thoughtDiv);
        }, 0);
    }

    // Regenerate button
    actionsDiv.innerHTML += `
    <button class="summariser-action-button summariser-regenerate-button" data-index="${messageIndex}" title="Regenerate response">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
      </svg>
    </button>
  `;

    messageDiv.appendChild(actionsDiv);
    elements.conversation.scrollTop = elements.conversation.scrollHeight;
}

// Send a message
function sendMessage() {
    if (elements.conversation.querySelector('.summariser-loading')) return; // Don't allow sending new messages while loading

    const text = elements.input.value.trim();

    if (!text && !state.pendingImage && !state.pendingFileContent) return;

    // Determine the message to display to the user
    let displayText = text;
    if (state.pendingImage) {
        displayText = text ? `${text}\n[Image attached]` : '[Image attached]';
    } else if (state.pendingFileContent) {
        displayText = text ? `${text}\n[File content attached]` : '[File content attached]';
    }

    if (text) {
        addMessage(displayText, 'user', false);
    }

    // Clear input
    elements.input.value = '';
    elements.input.style.height = 'auto';

    // Add loading message
    const loadingMessage = addMessage('', 'assistant', true);

    // Create the actual content to send
    let sendText = "";
    let prompt = null;

    if (state.pendingFileContent) {
        sendText = `[File Content]:\n${state.pendingFileContent}`;
    }

    if (text) {
        if (sendText !== "") {
            sendText = `${sendText}\n\n[User Instructions]:\n${text}`;
        } else {
            sendText = text;
        }
    }

    processRequest(sendText, prompt)
        .then(result => {
            updateLoadingMessage(loadingMessage, result.text, undefined, result.thought);
            state.pendingFileContent = null;
        })
        .catch(error => {
            console.error('Error processing request:', error);
            updateLoadingMessage(loadingMessage, `**Error:** ${error.message}`);
        });
}

// Regenerate a response
function regenerateMessage(index) {
    // Find the user message that preceded this response
    state.pendingImage = null;
    state.pendingFileContent = null;
    let userMessageIndex = -1;
    let userMessage = '';
    let systemPromptIndex = -1;
    let systemPrompt = null;
    for (let i = index - 1; i >= 0; i--) {
        if (state.conversation[i].role === 'user') {
            userMessageIndex = i;
            break;
        }
    }
    if (userMessageIndex === -1) {
        userMessage = "";
        for (let i = index - 1; i >= 0; i--) {
            if (state.conversation[i].role === 'system') {
                systemPromptIndex = i;
                break;
            }
        }
        if (systemPromptIndex !== -1) {
            systemPrompt = state.conversation[systemPromptIndex].text;
        }
    } else {
        userMessage = state.conversation[userMessageIndex].text;
    }

    // Add loading message
    const loadingMessage = addMessage('', 'assistant', true, index);

    processRequest(userMessage, systemPrompt, index)
        .then(result => {
            updateLoadingMessage(loadingMessage, result.text, index, result.thought);
        })
        .catch(error => {
            updateLoadingMessage(loadingMessage, `**Error:** ${error.message}`, index);
        });
}

// Process a request to an LLM API
async function processRequest(userMessage, systemPrompt = null, index = -1) {
    // Set streaming state
    state.isStreaming = true;

    // Change send button to stop button
    updateSendButtonToStop();
    // Accumulate streamed content
    let accumulatedText = '';
    let thoughtContent = null;
    let truncatedPrompt = null;
    let truncatedUserMessage = null;

    // Create AbortController for cancelling the fetch request
    const abortController = new AbortController();

    // Add click event for stopping the stream
    const stopHandler = () => {
        if (state.isStreaming) {
            abortController.abort();
            state.isStreaming = false;
            updateSendButtonToSend();
            return true; // Indicate that we stopped the request
        }
        return false;
    };

    elements.sendButton.addEventListener('click', stopHandler);

    if (systemPrompt) {
        truncatedPrompt = util.truncateText(systemPrompt, state.settings.maxTokens);
        if (!state.conversation.some(msg => msg.role === 'system')) {
            state.conversation.push({
                text: truncatedPrompt,
                role: 'system'
            });
        }
    }
    if (userMessage) {
        truncatedUserMessage = util.truncateText(userMessage, state.settings.maxTokens);
    }
    if (index === -1) {
        state.conversation.push({
            text: truncatedUserMessage,
            role: 'user',
            image: state.pendingImage
        });
    } else {
        state.pendingImage = state.conversation[index - 1].image;
    }
    const provider = util.getActiveProvider();
    const apiKeys = provider.apiKeys.filter(key => key.trim() !== '');

    if (!apiKeys.length) {
        state.isStreaming = false;
        updateSendButtonToSend();
        elements.sendButton.removeEventListener('click', stopHandler);
        throw new Error(`No API key provided for ${provider.name}. Please add your API key in settings.`);
    }

    // Try each API key until one works or all fail
    let lastError = null;
    let keyIndex = 0;

    while (keyIndex < apiKeys.length) {
        const apiKey = apiKeys[keyIndex];

        try {
            // Build the API request based on the provider
            let requestData;
            let headers = {
                'Content-Type': 'application/json'
            };
            let url = provider.url;

            switch (provider.name) {
                case 'OpenRouter':
                case 'GitHub':
                    headers['Authorization'] = `Bearer ${apiKey}`;
                    const messages = [];
                    if (truncatedPrompt) {
                        messages.push({
                            role: 'system',
                            content: truncatedPrompt
                        });
                    }

                    // Add conversation history
                    state.conversation.forEach((msg, msgIndex) => {
                        // Skip messages at or after the specified index if regenerating
                        if (index !== -1 && msgIndex > index - 1) {
                            return;
                        }

                        // Skip system messages if we already have a truncatedPrompt
                        // Also skip messages with empty text
                        if (!(truncatedPrompt && msg.role === 'system') && msg.text !== '') {
                            messages.push({
                                role: msg.role,
                                content: msg.text
                            });
                        }
                    });

                    requestData = {
                        model: state.settings.activeModel,
                        messages: messages,
                        temperature: state.settings.temperature,
                        max_tokens: state.settings.maxTokens,
                        stream: true
                    };

                    // Add web plugin for OpenRouter only
                    if (provider.name === 'OpenRouter') {
                        requestData.plugins = [{ "id": "web" }];
                        requestData.tool_choice = "auto";
                    }

                    // Add image to request if provided
                    if (state.pendingImage) {
                        const imgToUse = state.pendingImage;

                        // Find the last user message
                        const lastUserMsgIndex = messages.findIndex(msg => msg.role === 'user');
                        if (lastUserMsgIndex !== -1) {
                            // Format depends on what the API expects for image data
                            const content = messages[lastUserMsgIndex].content;
                            messages[lastUserMsgIndex].content = [
                                { type: 'text', text: content },
                                { type: 'image_url', image_url: { url: imgToUse } }
                            ];
                        }
                    }
                    break;

                case 'Gemini':
                    url = `${provider.url}/${state.settings.activeModel}:streamGenerateContent?key=${apiKey}`;

                    // Build Gemini's conversation format
                    const geminiContents = [];

                    // Add conversation history
                    let pendingSystemMessage = null;
                    state.conversation.forEach((msg, msgIndex) => {
                        // Skip messages at or after the specified index if regenerating or if text is empty
                        if ((index !== -1 && msgIndex > index - 1) || msg.text === '') {
                            return;
                        }

                        // For system messages, store content to be inserted into the next user message
                        if (msg.role === 'system') {
                            pendingSystemMessage = msg.text;
                            return; // Skip adding this as a separate message
                        }

                        const convertedMsg = {
                            role: msg.role.replace('assistant', 'model'),
                            parts: [{ text: msg.text }]
                        };

                        geminiContents.push(convertedMsg);
                    });

                    // Add image if there is one
                    if (state.pendingImage) {
                        const imgToUse = state.pendingImage;
                        // Check if the image is a data URL or a regular URL
                        if (imgToUse.startsWith('data:')) {
                            // It's a base64 data URL
                            const mimeType = imgToUse.split(';')[0].split(':')[1];
                            const base64Data = imgToUse.split(',')[1];

                            // Add to the last user message if exists
                            if (geminiContents.length > 0 && geminiContents[geminiContents.length - 1].role === 'user') {
                                geminiContents[geminiContents.length - 1].parts.push({
                                    inline_data: {
                                        mime_type: mimeType,
                                        data: base64Data
                                    }
                                });
                            }
                        }
                    }

                    requestData = {
                        contents: geminiContents,
                        generationConfig: {
                            temperature: state.settings.temperature,
                            maxOutputTokens: state.settings.maxTokens
                        },
                        tools: [{
                            googleSearch: {}
                        }],
                    };
                    if (truncatedPrompt) {
                        requestData.systemInstruction = {
                            parts: [{ text: truncatedPrompt }]
                        };
                    } else if (pendingSystemMessage) {
                        requestData.systemInstruction = {
                            parts: [{ text: pendingSystemMessage }]
                        };
                    }
                    break;
            }

            // Get the loading message from DOM - the last message in the conversation
            const loadingMessage = index !== -1
                ? elements.conversation.querySelector(`.summariser-message[data-index="${index}"]`)
                : elements.conversation.querySelector('.summariser-message:last-child');

            try {
                switch (provider.name) {
                    case 'OpenRouter':
                    case 'GitHub':
                        const response = await fetch(url, {
                            method: 'POST',
                            headers,
                            body: JSON.stringify(requestData),
                            signal: abortController.signal
                        });

                        if (!response.ok) {
                            const error = await response.json();
                            throw new Error(error.error?.message || `API request failed with status ${response.status}`);
                        }

                        const reader = response.body.getReader();
                        const decoder = new TextDecoder();
                        let buffer = '';
                        let accumulatedThought = '';

                        while (true) {
                            const { value, done } = await reader.read();
                            if (done) break;

                            const chunk = decoder.decode(value);
                            buffer += chunk;

                            // Process complete lines in the buffer
                            const lines = buffer.split('\n');
                            buffer = lines.pop() || ''; // Keep the last potentially incomplete line in the buffer

                            for (const line of lines) {
                                if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                                    try {
                                        // Skip empty data lines
                                        if (line.length <= 6) continue;

                                        const data = JSON.parse(line.substring(6));

                                        // Check for tool calls containing thought content
                                        if (data.choices && data.choices[0]?.delta?.tool_calls) {
                                            const toolCalls = data.choices[0].delta.tool_calls;
                                            for (const toolCall of toolCalls) {
                                                if (toolCall.function && toolCall.function.name === 'thinking') {
                                                    if (toolCall.function.arguments) {
                                                        try {
                                                            const thoughtObj = JSON.parse(toolCall.function.arguments);
                                                            if (thoughtObj.thought) {
                                                                accumulatedThought += thoughtObj.thought;
                                                                thoughtContent = accumulatedThought;
                                                            }
                                                        } catch (e) {
                                                            console.error('Error parsing thought content:', e);
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        // Check for thinking tags in content
                                        if (data.choices && data.choices[0]?.delta?.content) {
                                            const content = data.choices[0].delta.content;

                                            // Check if content contains thinking tags
                                            const thinkingStartTag = '<thinking>';
                                            const thinkingEndTag = '</thinking>';

                                            if (content.includes(thinkingStartTag) || content.includes(thinkingEndTag)) {
                                                // This chunk contains thought process content
                                                const startIndex = content.indexOf(thinkingStartTag);
                                                const endIndex = content.indexOf(thinkingEndTag);

                                                if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
                                                    // Complete thought tag in one chunk
                                                    const thoughtChunk = content.substring(
                                                        startIndex + thinkingStartTag.length,
                                                        endIndex
                                                    );
                                                    accumulatedThought += thoughtChunk;
                                                    thoughtContent = accumulatedThought;
                                                } else if (startIndex !== -1) {
                                                    // Start of thought tag
                                                    const thoughtChunk = content.substring(startIndex + thinkingStartTag.length);
                                                    accumulatedThought += thoughtChunk;
                                                } else if (endIndex !== -1) {
                                                    // End of thought tag
                                                    const thoughtChunk = content.substring(0, endIndex);
                                                    accumulatedThought += thoughtChunk;
                                                    thoughtContent = accumulatedThought;
                                                }
                                            }

                                            // Regular content processing
                                            accumulatedText += content;
                                            if (loadingMessage) {
                                                loadingMessage.innerHTML = marked.parse(accumulatedText);
                                                elements.conversation.scrollTop = elements.conversation.scrollHeight;
                                            }
                                        }
                                    } catch (e) {
                                        console.error('Error parsing stream:', e);
                                    }
                                }
                            }
                        }
                        break;

                    case 'Gemini':
                        const geminiResponse = await fetch(url, {
                            method: 'POST',
                            headers,
                            body: JSON.stringify(requestData),
                            signal: abortController.signal
                        });

                        if (!geminiResponse.ok) {
                            const error = await geminiResponse.json();
                            throw new Error(error.error?.message || `API request failed with status ${geminiResponse.status}`);
                        }

                        const geminiReader = geminiResponse.body.getReader();
                        const geminiDecoder = new TextDecoder();
                        let geminiBuffer = '';
                        let geminiAccumulatedThought = '';

                        // Helper function to extract complete JSON objects from a string
                        const extractJsonObjects = (str) => {
                            const results = [];
                            let depth = 0;
                            let startPos = -1;

                            for (let i = 0; i < str.length; i++) {
                                if (str[i] === '{') {
                                    if (depth === 0) startPos = i;
                                    depth++;
                                } else if (str[i] === '}') {
                                    depth--;
                                    if (depth === 0 && startPos !== -1) {
                                        try {
                                            const jsonStr = str.substring(startPos, i + 1);
                                            const jsonObj = JSON.parse(jsonStr);
                                            results.push(jsonObj);
                                        } catch (e) {
                                            // Not a valid JSON object
                                        }
                                        startPos = -1;
                                    }
                                }
                            }
                            return results;
                        };

                        while (true) {
                            const { value, done } = await geminiReader.read();
                            if (done) break;

                            geminiBuffer += geminiDecoder.decode(value);

                            // Process complete JSON objects in the buffer
                            try {
                                const jsonObjects = extractJsonObjects(geminiBuffer);

                                for (const data of jsonObjects) {
                                    if (data.candidates && data.candidates[0]?.content?.parts) {
                                        for (const partContent of data.candidates[0].content.parts) {
                                            if (partContent.thought === true && partContent.text) {
                                                geminiAccumulatedThought += partContent.text;
                                                thoughtContent = geminiAccumulatedThought;
                                            } else if (partContent.text && !partContent.thought) {
                                                accumulatedText += partContent.text;
                                                if (loadingMessage) {
                                                    loadingMessage.innerHTML = marked.parse(accumulatedText);
                                                    elements.conversation.scrollTop = elements.conversation.scrollHeight;
                                                }
                                            }
                                        }
                                    }
                                }

                                // Clean buffer after processing
                                if (jsonObjects.length > 0) {
                                    const lastJsonEndPos = geminiBuffer.lastIndexOf('}') + 1;
                                    geminiBuffer = geminiBuffer.substring(lastJsonEndPos);
                                }
                            } catch (e) {
                                console.error('Error processing Gemini streaming response:', e);
                            }
                        }
                        break;
                }

                // Reset button state when streaming completes
                state.isStreaming = false;
                updateSendButtonToSend();
                elements.sendButton.removeEventListener('click', stopHandler);
                state.pendingImage = null;

                return {
                    text: accumulatedText,
                    thought: thoughtContent
                };

            } catch (error) {
                // If it's an abort error (user manually stopped), this isn't a failure to try next key
                if (error.name === 'AbortError') {
                    state.isStreaming = false;
                    updateSendButtonToSend();
                    elements.sendButton.removeEventListener('click', stopHandler);
                    return {
                        text: accumulatedText || "**Response aborted**",
                        thought: thoughtContent
                    };
                }

                // Otherwise, it's a genuine API error, so try the next key
                console.warn(`API key at index ${keyIndex} failed:`, error.message);
                lastError = error;
                keyIndex++; // Try the next key
            }
        } catch (error) {
            console.warn(`API key at index ${keyIndex} failed:`, error.message);
            lastError = error;
            keyIndex++; // Try the next key
        }
    }

    // If we reach here, all keys have failed
    state.isStreaming = false;
    updateSendButtonToSend();
    elements.sendButton.removeEventListener('click', stopHandler);

    console.error('All API keys failed:', lastError);
    throw new Error(`Failed to get a response after trying ${apiKeys.length} API keys. Last error: ${lastError.message}`);
}

// Helper function to update send button to stop button
function updateSendButtonToStop() {
    elements.sendButton.innerHTML = `
<svg viewBox="0 0 24 24">
  <rect x="6" y="6" width="12" height="12" fill="currentColor" />
</svg>
`;
    elements.sendButton.classList.add('summariser-stop-button');
    elements.sendButton.title = 'Stop generating';
}

// Helper function to update stop button back to send button
function updateSendButtonToSend() {
    elements.sendButton.innerHTML = `
<svg viewBox="0 0 24 24">
  <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
</svg>
`;
    elements.sendButton.classList.remove('summariser-stop-button');
    elements.sendButton.title = 'Send message';
}

// Select a model
function selectModel(modelName) {
    state.settings.activeModel = modelName;

    // Update active provider based on model
    const provider = util.getProviderForModel(modelName);
    state.settings.activeProvider = provider.name;

    // Save settings
    util.saveSettings();

    // Show notification
    showToast(`Model switched to ${modelName.split('/').pop()}`);
}

// Update UI elements based on current settings
function updateUIFromSettings() {
    if (state.settings.buttonPosition === 'left') {
        elements.leftButton.classList.add('summariser-active');
        elements.rightButton.classList.remove('summariser-active');
        elements.hideButton.classList.remove('summariser-active');
    } else if (state.settings.buttonPosition === 'right') {
        elements.leftButton.classList.remove('summariser-active');
        elements.rightButton.classList.add('summariser-active');
        elements.hideButton.classList.remove('summariser-active');
    } else if (state.settings.buttonPosition === 'hide') {
        elements.leftButton.classList.remove('summariser-active');
        elements.rightButton.classList.remove('summariser-active');
        elements.hideButton.classList.add('summariser-active');
    }

    // Update settings form values
    elements.promptTemplate.value = state.settings.promptTemplate;
    elements.maxTokensInput.value = state.settings.maxTokens;
    elements.maxTokensValue.textContent = state.settings.maxTokens;
    elements.tempInput.value = state.settings.temperature;
    elements.tempValue.textContent = state.settings.temperature;

    // Update Redis API
    elements.redisApiInput.value = state.settings.redisApiUrl || '';
    elements.redisApiKeyInput.value = state.settings.redisApiKey || '';

    // Populate API provider settings
    const apiProviderSettings = document.getElementById('api-provider-settings');
    apiProviderSettings.innerHTML = '';

    state.settings.apiProviders.forEach(provider => {
        const providerSection = document.createElement('div');
        providerSection.className = 'summariser-settings-row';

        const providerLabel = document.createElement('label');
        providerLabel.className = 'summariser-settings-label';
        providerLabel.textContent = `${provider.name} API Key:`;
        providerSection.appendChild(providerLabel);

        const apiKeyGroup = document.createElement('div');
        apiKeyGroup.className = 'summariser-api-key-group';

        const apiKeyInput = document.createElement('input');
        apiKeyInput.type = 'password';
        apiKeyInput.className = 'summariser-input-text';
        apiKeyInput.placeholder = 'Enter your API key';
        apiKeyInput.value = provider.apiKeys.join(',') || '';
        apiKeyInput.setAttribute('data-provider', provider.name);
        apiKeyGroup.appendChild(apiKeyInput);

        // Toggle password visibility
        const toggleButton = document.createElement('button');
        toggleButton.className = 'summariser-button-small';
        toggleButton.textContent = 'Show';
        toggleButton.onclick = function () {
            if (apiKeyInput.type === 'password') {
                apiKeyInput.type = 'text';
                this.textContent = 'Hide';
            } else {
                apiKeyInput.type = 'password';
                this.textContent = 'Show';
            }
        };
        apiKeyGroup.appendChild(toggleButton);

        providerSection.appendChild(apiKeyGroup);
        apiProviderSettings.appendChild(providerSection);
    });

    // Populate model dropdown
    elements.modelDropdown.innerHTML = '';
    state.allModels = util.getAllModels();

    state.allModels.forEach(model => {
        const option = document.createElement('div');
        option.className = `summariser-model-option ${model.name === state.settings.activeModel ? 'summariser-active' : ''}`;
        option.setAttribute('data-model', model.name);

        const modelName = document.createElement('span');
        const baseName = model.name.split('/').pop();
        const parts = baseName.split('-');
        modelName.textContent = parts.length > 3 ? parts.slice(0, 3).join('-') : baseName;
        option.appendChild(modelName);

        const providerName = document.createElement('span');
        providerName.className = 'summariser-model-provider';
        providerName.textContent = model.provider;
        option.appendChild(providerName);

        elements.modelDropdown.appendChild(option);
    });
}

// Set up event listeners
function setupEventListeners() {
    elements.closeButton.addEventListener('click', closeApp);

    // Close dropdowns when clicking outside them
    document.addEventListener('click', (e) => {
        if (state.uploadDropdownVisible &&
            !elements.uploadDropdown.contains(e.target) &&
            !elements.uploadButton.contains(e.target)) {
            state.uploadDropdownVisible = false;
            elements.uploadDropdown.classList.remove('summariser-visible');
        }

        if (state.modelDropdownVisible &&
            !elements.modelDropdown.contains(e.target) &&
            !elements.panelTitle.contains(e.target)) {
            state.modelDropdownVisible = false;
            elements.modelDropdown.classList.remove('summariser-visible');
        }

        if (state.historyDropdownVisible &&
            !elements.historyDropdown.contains(e.target) &&
            !elements.historyButton.contains(e.target)) {
            state.historyDropdownVisible = false;
            elements.historyDropdown.classList.remove('summariser-visible');
        }
    });

    // Toggle thought process visibility
    elements.conversation.addEventListener('click', (e) => {
        const thoughtToggle = e.target.closest('.summariser-thought-toggle');
        if (thoughtToggle) {
            const thoughtId = thoughtToggle.getAttribute('data-thought-id');
            const thoughtProcess = elements.conversation.querySelector(`.summariser-thought-process[data-thought-id="${thoughtId}"]`);

            if (thoughtProcess) {
                const isVisible = thoughtProcess.classList.toggle('visible');

                // Update icon based on visibility
                if (isVisible) {
                    thoughtToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
            </svg>
          `;
                    thoughtToggle.setAttribute('title', 'Hide thought process');
                } else {
                    thoughtToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
          `;
                    thoughtToggle.setAttribute('title', 'Show thought process');
                }
            }
        }
    });

    // Handle sending a message
    elements.sendButton.addEventListener('click', () => {
        if (!state.isStreaming) {
            sendMessage();
        }
    });

    elements.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!state.isStreaming) {
                sendMessage();
            }
        }
    });

    // Auto-resize the textarea
    elements.input.addEventListener('input', () => {
        elements.input.style.height = 'auto';
        elements.input.style.height = `${Math.min(elements.input.scrollHeight, 200)}px`;
    });

    // Title click for model selection
    elements.panelTitle.addEventListener('click', (e) => {
        if (state.uploadDropdownVisible) {
            state.uploadDropdownVisible = false;
            elements.uploadDropdown.classList.remove('summariser-visible');
        }
        if (state.historyDropdownVisible) {
            state.historyDropdownVisible = false;
            elements.historyDropdown.classList.remove('summariser-visible');
        }

        state.modelDropdownVisible = !state.modelDropdownVisible;
        elements.modelDropdown.classList.toggle('summariser-visible', state.modelDropdownVisible);

        // Position the dropdown near the title
        const titleRect = elements.panelTitle.getBoundingClientRect();
        elements.modelDropdown.style.top = `${titleRect.bottom + 5}px`;
        elements.modelDropdown.style.left = `${titleRect.left}px`;
    });

    // History button
    elements.historyButton.addEventListener('click', (e) => {
        if (state.uploadDropdownVisible) {
            state.uploadDropdownVisible = false;
            elements.uploadDropdown.classList.remove('summariser-visible');
        }
        if (state.modelDropdownVisible) {
            state.modelDropdownVisible = false;
            elements.modelDropdown.classList.remove('summariser-visible');
        }

        state.historyDropdownVisible = !state.historyDropdownVisible;
        elements.historyDropdown.classList.toggle('summariser-visible', state.historyDropdownVisible);

        // Position the dropdown near the button
        const buttonRect = elements.historyButton.getBoundingClientRect();
        const leftPosition = Math.max(buttonRect.left - 240, 16);
        elements.historyDropdown.style.top = `${buttonRect.bottom + 5}px`;
        elements.historyDropdown.style.left = `${leftPosition}px`;
        elements.historyDropdown.style.right = 'auto';

        // Load history if visible
        if (state.historyDropdownVisible && !state.historyLoaded) {
            loadChatHistoryDropdown();
        }
    });

    // New conversation button
    elements.newConversationButton.addEventListener('click', (e) => {
        e.stopPropagation();

        // Create a new conversation
        const date = util.getFormattedDate();
        const time = date.time;
        const historyId = Date.now().toString();

        // Add to history with a formatted name
        state.conversationHistory[historyId] = {
            name: `${date.ddmm} ${time}`,
            conversation: []
        };

        // Save history
        util.saveConversationHistory();

        // Reset current conversation
        resetConversation();
        state.currentHistoryId = null;

        // Close dropdown
        state.historyDropdownVisible = false;
        elements.historyDropdown.classList.remove('summariser-visible');

        showToast('New conversation created');
    });

    // Refresh button
    elements.refreshButton.addEventListener('click', (e) => {
        e.stopPropagation();
        // Reload chat history
        loadChatHistoryDropdown();
        showToast('Chat history refreshed');
    });

    // Model selection
    elements.modelDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        const option = e.target.closest('.summariser-model-option');
        if (option) {
            const modelName = option.getAttribute('data-model');
            selectModel(modelName);

            // Update active class
            const options = elements.modelDropdown.querySelectorAll('.summariser-model-option');
            options.forEach(opt => {
                opt.classList.toggle('summariser-active', opt.getAttribute('data-model') === modelName);
            });

            state.modelDropdownVisible = false;
            elements.modelDropdown.classList.remove('summariser-visible');
        }
    });

    // History dropdown item selection
    elements.historyDropdown.addEventListener('click', (e) => {
        e.stopPropagation();

        // Check if the click is on a remove button
        const removeButton = e.target.closest('.summariser-history-remove');
        if (removeButton) {
            const historyId = removeButton.getAttribute('data-history-id');
            if (historyId) {
                util.deleteConversationHistory(historyId);
                loadChatHistoryDropdown();
                showToast('Conversation removed');
            }
            return;
        }

        // Handle clicking on a history item to load it
        const historyItem = e.target.closest('.summariser-model-option');
        if (historyItem && !historyItem.classList.contains('summariser-history-empty')) {
            const historyId = historyItem.getAttribute('data-history-id');
            if (historyId && state.conversationHistory[historyId]) {
                // Load the conversation
                state.conversation = [...state.conversationHistory[historyId].conversation];

                // Set the current history ID so new messages will be saved to the same history
                state.currentHistoryId = historyId;

                // Clear and rebuild the conversation UI
                elements.conversation.innerHTML = '';
                state.conversation.forEach((message, index) => {
                    addMessage(message.text, message.role, false, index, message.thought, message.image);
                });

                // Close dropdown
                state.historyDropdownVisible = false;
                elements.historyDropdown.classList.remove('summariser-visible');

                showToast('Conversation loaded');
            }
        }
    });

    // Upload button
    elements.uploadButton.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close other dropdowns if open
        if (state.modelDropdownVisible) {
            state.modelDropdownVisible = false;
            elements.modelDropdown.classList.remove('summariser-visible');
        }
        if (state.historyDropdownVisible) {
            state.historyDropdownVisible = false;
            elements.historyDropdown.classList.remove('summariser-visible');
        }

        state.uploadDropdownVisible = !state.uploadDropdownVisible;
        elements.uploadDropdown.classList.toggle('summariser-visible', state.uploadDropdownVisible);

        // Position the dropdown near the button
        const buttonRect = elements.uploadButton.getBoundingClientRect();
        elements.uploadDropdown.style.top = `${buttonRect.bottom + 5}px`;
        elements.uploadDropdown.style.right = `${window.innerWidth - buttonRect.right}px`;
    });

    // Upload options
    elements.uploadDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        const option = e.target.closest('.summariser-model-option');
        if (option) {
            const uploadType = option.getAttribute('data-upload-type');
            if (uploadType === 'url') {
                promptForUrl();
            } else if (uploadType === 'device') {
                elements.fileInput.click();
            } else if (uploadType === 'download-history') {
                downloadChatHistory();
            } else if (uploadType === 'upload-history') {
                elements.historyFileInput.click();
            }

            state.uploadDropdownVisible = false;
            elements.uploadDropdown.classList.remove('summariser-visible');
        }
    });

    // File upload handler
    elements.fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    });

    // History file upload handler
    elements.historyFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            loadChatHistory(e.target.files[0]);
        }
    });

    // Toggle settings panel
    elements.settingsButton.addEventListener('click', () => {
        state.settingsOpen = true;
        elements.settings.classList.add('summariser-open');
        elements.conversation.classList.add('summariser-blurred');
        elements.input.disabled = true;
    });

    // Close settings button
    elements.settingsCloseButton.addEventListener('click', () => {
        state.settingsOpen = false;
        elements.settings.classList.remove('summariser-open');
        elements.conversation.classList.remove('summariser-blurred');
        elements.input.disabled = false;
    });

    // Save settings button
    elements.settingsSaveButton.addEventListener('click', () => {
        state.settings.promptTemplate = elements.promptTemplate.value;
        state.settings.maxTokens = parseInt(elements.maxTokensInput.value);
        state.settings.temperature = parseFloat(elements.tempInput.value);
        state.settings.redisApiUrl = elements.redisApiInput.value.trim();
        state.settings.redisApiKey = elements.redisApiKeyInput.value.trim();

        // Get API keys from inputs
        const apiKeyInputs = document.querySelectorAll('.summariser-input-text[data-provider]');
        apiKeyInputs.forEach(input => {
            const providerName = input.getAttribute('data-provider');
            const provider = state.settings.apiProviders.find(p => p.name === providerName);
            if (provider) {
                provider.apiKeys = input.value.split(',').map(key => key.trim()).filter(key => key !== '');
            }
        });

        // Close settings panel
        state.settingsOpen = false;
        elements.settings.classList.remove('summariser-open');
        elements.conversation.classList.remove('summariser-blurred');
        elements.input.disabled = false;

        // Save settings
        util.saveSettings(false);
    });

    // Range inputs
    elements.maxTokensInput.addEventListener('input', () => {
        elements.maxTokensValue.textContent = elements.maxTokensInput.value;
    });

    elements.tempInput.addEventListener('input', () => {
        elements.tempValue.textContent = elements.tempInput.value;
    });

    // Position buttons
    elements.leftButton.addEventListener('click', () => {
        state.settings.buttonPosition = 'left';
        elements.leftButton.classList.add('summariser-active');
        elements.rightButton.classList.remove('summariser-active');
        elements.hideButton.classList.remove('summariser-active');
        util.saveSettings();
    });

    elements.rightButton.addEventListener('click', () => {
        state.settings.buttonPosition = 'right';
        elements.rightButton.classList.add('summariser-active');
        elements.leftButton.classList.remove('summariser-active');
        elements.hideButton.classList.remove('summariser-active');
        util.saveSettings();
    });

    elements.hideButton.addEventListener('click', () => {
        state.settings.buttonPosition = 'hide';
        elements.rightButton.classList.remove('summariser-active');
        elements.leftButton.classList.remove('summariser-active');
        elements.hideButton.classList.add('summariser-active');
        util.saveSettings();
    });

    // Reset button
    elements.resetButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            state.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
            util.saveSettings(false);
            updateUIFromSettings();
            showToast('Settings reset to defaults');
        }
    });

    // Message actions (regenerate, copy)
    elements.conversation.addEventListener('click', (e) => {
        const regenerateButton = e.target.closest('.summariser-regenerate-button');
        if (regenerateButton) {
            const messageIndex = parseInt(regenerateButton.getAttribute('data-index'));
            regenerateMessage(messageIndex);
        }

        const copyButton = e.target.closest('.summariser-copy-button');
        if (copyButton) {
            const messageIndex = parseInt(copyButton.getAttribute('data-index'));
            if (messageIndex >= 0 && messageIndex < state.conversation.length) {
                copyToClipboard(state.conversation[messageIndex].text);
                showToast('Response copied to clipboard');
            }
        }
    });

    // Toggle visibility of Redis inputs
    elements.toggleRedisUrlButton.addEventListener('click', function () {
        if (elements.redisApiInput.type === 'password') {
            elements.redisApiInput.type = 'text';
            this.textContent = 'Hide';
        } else {
            elements.redisApiInput.type = 'password';
            this.textContent = 'Show';
        }
    });

    elements.toggleRedisKeyButton.addEventListener('click', function () {
        if (elements.redisApiKeyInput.type === 'password') {
            elements.redisApiKeyInput.type = 'text';
            this.textContent = 'Hide';
        } else {
            elements.redisApiKeyInput.type = 'password';
            this.textContent = 'Show';
        }
    });
}
async function iosKeyboardHandler() {
    // Track header position and fix when keyboard appears
    let fixPosition = 0;
    const headerWrap = document.querySelector('.summariser-panel-header-wrap');
    const header = document.querySelector('.summariser-panel-header');
    const editor = document.querySelector('#input'); // Change to your input/textarea selector

    // Function to check and fix header position
    const showHeader = function () {
        // Check if header wrap is hidden
        const newPosition = headerWrap.getBoundingClientRect().top;

        if (newPosition < -1) {
            // Header is off-screen - immediately add margin to show it
            fixPosition = Math.abs(newPosition);

            // Adjust for bottom of page gap
            if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
                fixPosition -= 2;
            }

            // Set the margin immediately
            header.style.marginTop = fixPosition + "px";
        } else if (fixPosition > 0) {
            // Header is visible again - reset the margin
            fixPosition = 0;
            header.style.marginTop = 0;
        }
    };

    // Add event listeners - checking often to ensure responsive behavior
    window.addEventListener("scroll", showHeader);
    window.addEventListener("resize", showHeader);
    editor.addEventListener("focus", showHeader);
    editor.addEventListener("blur", showHeader);

    // Also check position periodically while keyboard might be open
    let checkInterval;
    editor.addEventListener("focus", function () {
        // Start checking position frequently when input is focused
        checkInterval = setInterval(showHeader, 100);
    });

    editor.addEventListener("blur", function () {
        // Stop checking when input loses focus
        clearInterval(checkInterval);
    });
}

// Initialize the application
async function init() {
    try {
        // Load settings
        await util.loadSettings();

        // Update UI with settings
        updateUIFromSettings();

        // Set up event listeners
        setupEventListeners();

        // Load marked.js for markdown parsing
        const markedModule = await import('./marked.js');
        marked = markedModule.marked;

    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// Start the application
init();

