// Synapse AI Codebase Intelligence Pipeline JavaScript Controller

document.addEventListener('DOMContentLoaded', () => {
    // State management variables
    let currentStep = 1;
    let unlockedSteps = [1];
    let isDemoRunning = false;
    let selectedRepo = "github.com/aether/synapse-core";
    let canvasAnimationId = null;
    let currentTermTimeout = null;
    let currentTypewriterInterval = null;
    let demoSequenceTimeouts = [];

    // Canvas properties for 3D Vector Space
    const canvas = document.getElementById('vectorCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let points = [];
    let angleX = 0.003;
    let angleY = 0.005;
    let queryPoint = null;
    let showConnections = false;

    // Initial Mock Repository Files List
    const mockFiles = [
        "package.json",
        "README.md",
        "tsconfig.json",
        "src/index.ts",
        "src/app.ts",
        "src/config/database.ts",
        "src/config/redis.ts",
        "src/api/auth/auth.controller.ts",
        "src/api/auth/auth.service.ts",
        "src/api/users/user.model.ts",
        "src/api/users/user.service.ts",
        "src/api/code/chunker.ts",
        "src/api/code/embedder.ts",
        "src/api/code/vector.db.ts",
        "src/api/ai/llm.service.ts",
        "src/api/ai/agent.ts",
        "src/middleware/error.ts",
        "src/middleware/rate-limiter.ts",
        "src/utils/logger.ts",
        "src/utils/crypto.ts",
        "tests/auth.test.ts",
        "tests/chunker.test.ts",
        "docker-compose.yml",
        "Dockerfile"
    ];

    // Source Code mock for chunking
    const sampleCodeLines = [
        "class ChunkProcessor {",
        "  constructor(chunkSize = 500, overlap = 50) {",
        "    this.chunkSize = chunkSize;",
        "    this.overlap = overlap;",
        "  }",
        "",
        "  splitFile(fileContent, filePath) {",
        "    const lines = fileContent.split('\\n');",
        "    const chunks = [];",
        "    let currentChunk = [];",
        "    let currentLength = 0;",
        "",
        "    for (let i = 0; i < lines.length; i++) {",
        "      const line = lines[i];",
        "      currentChunk.push(line);",
        "      currentLength += line.length;",
        "",
        "      if (currentLength >= this.chunkSize) {",
        "        chunks.push(this.compileChunk(currentChunk, filePath));",
        "        currentChunk = this.getOverlapLines(currentChunk);",
        "        currentLength = currentChunk.join('\\n').length;",
        "      }",
        "    }",
        "    if (currentChunk.length > 0) {",
        "      chunks.push(this.compileChunk(currentChunk, filePath));",
        "    }",
        "    return chunks;",
        "  }",
        "}"
    ];

    // Semantic tokens & floating vectors
    const tokenWords = ["class", "ChunkProcessor", "constructor", "splitFile", "fileContent", "filePath", "lines", "compileChunk", "overlapLines", "vectorSpace", "ChromaDB", "LargeLanguageModel", "semanticSearch", "embeddings"];

    // Initialize 3D Vector coordinates
    function initVectorSpace() {
        points = [];
        const colors = ['#8b5cf6', '#06b6d4', '#ec4899', '#10b981'];
        for (let i = 0; i < 150; i++) {
            points.push({
                x: (Math.random() - 0.5) * 300,
                y: (Math.random() - 0.5) * 300,
                z: (Math.random() - 0.5) * 300,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 2.5 + 1.5,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }

    // Resize Canvas
    function resizeCanvas() {
        if (canvas) {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height || 380;
        }
    }

    // Rotate 3D point
    function rotate3D(point, sinX, cosX, sinY, cosY) {
        // Rotate Y
        let x1 = point.x * cosY - point.z * sinY;
        let z1 = point.z * cosY + point.x * sinY;

        // Rotate X
        let y2 = point.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + point.y * sinX;

        return {
            x: x1,
            y: y2,
            z: z2,
            color: point.color,
            size: point.size,
            opacity: point.opacity
        };
    }

    // Draw canvas 3D vector space loop
    function drawVectorSpace() {
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const fov = 400; // field of view

        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);

        // Map and sort points by Z (depth buffer painting)
        const projectedPoints = points.map(p => {
            const rotated = rotate3D(p, sinX, cosX, sinY, cosY);
            p.x = rotated.x;
            p.y = rotated.y;
            p.z = rotated.z;

            const scale = fov / (fov + rotated.z);
            const x2d = cx + rotated.x * scale;
            const y2d = cy + rotated.y * scale;

            return { x2d, y2d, scale, z: rotated.z, color: rotated.color, size: rotated.size, opacity: rotated.opacity };
        });

        // Draw coordinate axes grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy);
        ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height);
        ctx.stroke();

        // Sort based on depth
        projectedPoints.sort((a, b) => b.z - a.z);

        // Draw normal points
        projectedPoints.forEach(p => {
            if (p.x2d >= 0 && p.x2d <= canvas.width && p.y2d >= 0 && p.y2d <= canvas.height) {
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.beginPath();
                ctx.arc(p.x2d, p.y2d, p.size * p.scale, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Query Point search animation (Step 6)
        if (queryPoint) {
            const rotQ = rotate3D(queryPoint, sinX, cosX, sinY, cosY);
            queryPoint.x = rotQ.x;
            queryPoint.y = rotQ.y;
            queryPoint.z = rotQ.z;

            const scaleQ = fov / (fov + rotQ.z);
            const x2dQ = cx + rotQ.x * scaleQ;
            const y2dQ = cy + rotQ.y * scaleQ;

            // Draw glowing query point
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ffffff';
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 1.0;
            ctx.beginPath();
            ctx.arc(x2dQ, y2dQ, 6 * scaleQ, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; // reset shadow

            // Connect lines to nearest 3 database nodes
            if (showConnections) {
                // Find nearest 3 projected points
                const dists = projectedPoints.map((p, idx) => {
                    const dx = p.x2d - x2dQ;
                    const dy = p.y2d - y2dQ;
                    return { dist: Math.sqrt(dx*dx + dy*dy), point: p, index: idx };
                });
                dists.sort((a, b) => a.dist - b.dist);

                ctx.lineWidth = 1.5;
                ctx.globalAlpha = 0.6;
                for (let k = 0; k < 4; k++) {
                    if (dists[k]) {
                        ctx.strokeStyle = dists[k].point.color;
                        ctx.beginPath();
                        ctx.moveTo(x2dQ, y2dQ);
                        ctx.lineTo(dists[k].point.x2d, dists[k].point.y2d);
                        ctx.stroke();

                        // Highlight the target node
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = dists[k].point.color;
                        ctx.fillStyle = dists[k].point.color;
                        ctx.beginPath();
                        ctx.arc(dists[k].point.x2d, dists[k].point.y2d, dists[k].point.size * dists[k].point.scale * 2.2, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    }
                }
            }
        }

        ctx.globalAlpha = 1.0;
        canvasAnimationId = requestAnimationFrame(drawVectorSpace);
    }

    // Interactive custom simulator screen switches
    function showStepScreen(stepNum) {
        document.querySelectorAll('.sim-step-screen').forEach(el => el.classList.remove('active'));
        const screenEl = document.getElementById(`simStep${stepNum}`);
        if (screenEl) {
            screenEl.classList.add('active');
        }

        // Clean up active timelines/timeouts
        clearTimeout(currentTermTimeout);
        clearInterval(currentTypewriterInterval);

        // Special steps animations initializer
        if (stepNum === 1) {
            document.querySelector('.sim-status-badge .sim-status-dot').classList.add('active');
            document.getElementById('simStatusText').textContent = "Scanning Core Structure...";
        } 
        else if (stepNum === 2) {
            runStep2ClonerTerminal();
        } 
        else if (stepNum === 3) {
            runStep3ChunkingCode();
        } 
        else if (stepNum === 4) {
            runStep4EmbeddingTokens();
        } 
        else if (stepNum === 5) {
            document.getElementById('simStatusText').textContent = "Storing chroma-vectors...";
            queryPoint = null;
            showConnections = false;
        } 
        else if (stepNum === 6) {
            runStep6SemanticSearch();
        } 
        else if (stepNum === 7) {
            runStep7ChatTyping();
        } 
        else if (stepNum === 8) {
            runStep8ArchitectureDraw();
        } 
        else if (stepNum === 9) {
            runStep9AdvancedHub();
        }
    }

    // Step 2 Cloner Terminal Typist
    function runStep2ClonerTerminal() {
        document.getElementById('simStatusText').textContent = "Cloning Repository...";
        const term = document.getElementById('clonerTerminal');
        if (!term) return;
        term.innerHTML = "";
        
        const commands = [
            { text: "git clone --depth 1 https://" + selectedRepo + ".git .", delay: 100, type: "cmd" },
            { text: "Cloning into '.'...", delay: 600, type: "info" },
            { text: "remote: Enumerating objects: 432, done.", delay: 1100, type: "info" },
            { text: "remote: Counting objects: 100% (432/432), done.", delay: 1600, type: "info" },
            { text: "remote: Compressing objects: 100% (218/218), done.", delay: 2000, type: "info" },
            { text: "Receiving objects: 100% (432/432), 1.25 MiB | 8.42 MiB/s, done.", delay: 2400, type: "info" },
            { text: "Resolving deltas: 100% (129/129), done.", delay: 2800, type: "info" },
            { text: "Extracting file hierarchy mapping structures...", delay: 3200, type: "cmd" },
            { text: "✔ Extracted 24 source files", delay: 3600, type: "success" },
            { text: "✔ Extracted 3 internal modules (auth, code, ai)", delay: 4000, type: "success" },
            { text: "✔ Found config dependencies: TypeScript, Node.js, ChromaDB, OpenAI", delay: 4300, type: "success" },
            { text: "Repository Cloned and Metadata indexed successfully.", delay: 4700, type: "success" }
        ];

        commands.forEach(cmd => {
            currentTermTimeout = setTimeout(() => {
                const line = document.createElement('div');
                line.className = `terminal-line ${cmd.type}`;
                line.textContent = cmd.text;
                term.appendChild(line);
                term.scrollTop = term.scrollHeight;
            }, cmd.delay);
        });
    }

    // Step 3 Chunking Code Highlighter
    function runStep3ChunkingCode() {
        document.getElementById('simStatusText').textContent = "Chunking files...";
        const scroller = document.getElementById('codeChunkScroller');
        const statsChunks = document.getElementById('statsTotalChunks');
        if (!scroller) return;

        // Render code lines
        scroller.innerHTML = "";
        sampleCodeLines.forEach((lineText, idx) => {
            const lineEl = document.createElement('span');
            lineEl.className = "code-line";
            lineEl.textContent = lineText;
            scroller.appendChild(lineEl);
        });

        // Animate separation
        const lines = scroller.querySelectorAll('.code-line');
        const delay = 400;

        setTimeout(() => {
            // Highlight chunk 1: constructor
            for (let i = 0; i <= 5; i++) {
                if (lines[i]) lines[i].className = "code-line chunk-highlight-1";
            }
            statsChunks.textContent = "1";
        }, delay);

        setTimeout(() => {
            // Highlight chunk 2: splitFile first half
            for (let i = 6; i <= 15; i++) {
                if (lines[i]) lines[i].className = "code-line chunk-highlight-2";
            }
            statsChunks.textContent = "2";
        }, delay * 2.5);

        setTimeout(() => {
            // Highlight chunk 3: splitFile second half
            for (let i = 16; i < lines.length; i++) {
                if (lines[i]) lines[i].className = "code-line chunk-highlight-3";
            }
            statsChunks.textContent = "4";
        }, delay * 4.5);
    }

    // Step 4 Embedding generator progress
    function runStep4EmbeddingTokens() {
        document.getElementById('simStatusText').textContent = "Generating Vector Embeddings...";
        const wordsWrapper = document.getElementById('tokenStreamWords');
        const vectorBrackets = document.querySelectorAll('.vector-brackets');
        const progressFill = document.getElementById('embeddingProgressFill');
        const progressVal = document.getElementById('embeddingProgressVal');

        if (!wordsWrapper) return;
        wordsWrapper.innerHTML = "";
        progressFill.style.width = "0%";
        progressVal.textContent = "0%";

        // Render token words
        tokenWords.forEach(word => {
            const span = document.createElement('span');
            span.className = "token-word";
            span.textContent = word;
            wordsWrapper.appendChild(span);
        });

        const tokens = wordsWrapper.querySelectorAll('.token-word');
        let currentIdx = 0;

        vectorBrackets.forEach(v => {
            v.classList.add('loading');
            v.textContent = "[...]";
        });

        currentTypewriterInterval = setInterval(() => {
            if (currentIdx < tokens.length) {
                // Highlight token
                tokens[currentIdx].classList.add('active');
                if (currentIdx > 0) {
                    tokens[currentIdx - 1].classList.remove('active');
                }

                // Fill one of the vector rows randomly
                const randomRowIdx = Math.floor(Math.random() * vectorBrackets.length);
                const vb = vectorBrackets[randomRowIdx];
                vb.classList.remove('loading');
                
                // Build a dummy floating vector
                let vec = [];
                for(let k=0; k<6; k++) {
                    vec.push((Math.random() * 2 - 1).toFixed(4));
                }
                vb.textContent = `[${vec.join(', ')}, ...]`;

                // Update Progress bar
                const pct = Math.min(Math.round(((currentIdx + 1) / tokens.length) * 100), 100);
                progressFill.style.width = `${pct}%`;
                progressVal.textContent = `${pct}%`;

                currentIdx++;
            } else {
                clearInterval(currentTypewriterInterval);
                tokens[tokens.length - 1].classList.remove('active');
                progressFill.style.width = "100%";
                progressVal.textContent = "100%";
                // Finish all loading rows
                vectorBrackets.forEach(v => {
                    v.classList.remove('loading');
                    if(v.textContent.includes('...')) return;
                    v.textContent = `[0.0825, -0.4294, 0.9251, -0.1983, ...]`;
                });
            }
        }, 250);
    }

    // Step 6 Semantic Search question and vector match
    function runStep6SemanticSearch() {
        document.getElementById('simStatusText').textContent = "Performing Semantic Search...";
        const bar = document.getElementById('searchSimBar');
        const resultsBox = document.getElementById('searchResultsList');

        if (!bar || !resultsBox) return;
        bar.value = "";
        resultsBox.innerHTML = "";

        const queryText = "How is file splitting chunk logic configured?";
        let charIdx = 0;

        // Animate writing the search query
        currentTypewriterInterval = setInterval(() => {
            if (charIdx < queryText.length) {
                bar.value += queryText[charIdx];
                charIdx++;
            } else {
                clearInterval(currentTypewriterInterval);
                
                // Trigger query point animation inside vector canvas
                queryPoint = { x: 0, y: 0, z: 0, color: '#ffffff', size: 6, opacity: 1.0 };
                
                // Wait to display connection lines
                setTimeout(() => {
                    showConnections = true;
                    // Render Search Result Cards
                    renderSearchResults();
                }, 800);
            }
        }, 60);
    }

    function renderSearchResults() {
        const resultsBox = document.getElementById('searchResultsList');
        if (!resultsBox) return;

        const mockResults = [
            { path: "src/api/code/chunker.ts", score: "0.9482", preview: "class ChunkProcessor { constructor(chunkSize = 500, overlap = 50) {" },
            { path: "tests/chunker.test.ts", score: "0.8241", preview: "describe('Chunker Tests', () => { it('should split file correctly'" },
            { path: "src/api/code/embedder.ts", score: "0.6845", preview: "export async function getEmbeddings(textChunks) {" }
        ];

        mockResults.forEach((res, idx) => {
            setTimeout(() => {
                const card = document.createElement('div');
                card.className = "search-result-item animate";
                card.innerHTML = `
                    <div class="search-result-header">
                        <span class="result-file-path">${res.path}</span>
                        <span class="result-score">Cosine Similarity: ${res.score}</span>
                    </div>
                    <div class="result-preview">${res.preview}</div>
                `;
                resultsBox.appendChild(card);
            }, idx * 400);
        });
    }

    // Step 7 Chat Typing Simulator
    function runStep7ChatTyping() {
        document.getElementById('simStatusText').textContent = "Generating LLM Response...";
        const box = document.getElementById('chatSimMessages');
        if (!box) return;

        box.innerHTML = "";

        // User message
        const uMsg = document.createElement('div');
        uMsg.className = "chat-msg user";
        uMsg.innerHTML = `
            <span class="chat-msg-sender">You</span>
            <div class="chat-msg-bubble">How does the file chunking code handle split sizing?</div>
        `;
        box.appendChild(uMsg);

        // Assistant Message loader
        const aMsg = document.createElement('div');
        aMsg.className = "chat-msg assistant";
        aMsg.innerHTML = `
            <span class="chat-msg-sender">Aether AI</span>
            <div class="chat-msg-bubble typing-dots">AI is generating explanations...</div>
        `;
        box.appendChild(aMsg);
        box.scrollTop = box.scrollHeight;

        const responseText = "The chunking logic is encapsulated in `ChunkProcessor` (found in `src/api/code/chunker.ts`). It splits source files into semantic chunks by tracking size character counts. When a chunk length crosses the `chunkSize` boundary (default `500` characters), it splits. To maintain context, it includes an overlap threshold of `overlap` lines (default `50`).";

        setTimeout(() => {
            const bubble = aMsg.querySelector('.chat-msg-bubble');
            bubble.classList.remove('typing-dots');
            bubble.textContent = "";
            let wordIdx = 0;
            const words = responseText.split(' ');

            currentTypewriterInterval = setInterval(() => {
                if (wordIdx < words.length) {
                    bubble.textContent += (wordIdx === 0 ? "" : " ") + words[wordIdx];
                    box.scrollTop = box.scrollHeight;
                    wordIdx++;
                } else {
                    clearInterval(currentTypewriterInterval);
                    // Add code/file references references
                    const refs = document.createElement('div');
                    refs.className = "chat-msg-references";
                    refs.innerHTML = `
                        <span class="chat-ref-tag">src/api/code/chunker.ts:L1-L30</span>
                        <span class="chat-ref-tag">ChunkProcessor.splitFile()</span>
                    `;
                    aMsg.appendChild(refs);
                    box.scrollTop = box.scrollHeight;
                }
            }, 75);
        }, 1200);
    }

    // Step 8 Architecture drawing
    function runStep8ArchitectureDraw() {
        document.getElementById('simStatusText').textContent = "Drawing Architecture Layout...";
        const svg = document.querySelector('.arch-svg-container svg');
        if (!svg) return;

        // Reset edges and node highlights
        svg.querySelectorAll('.arch-node').forEach(n => n.classList.remove('active', 'active-sec'));
        svg.querySelectorAll('.arch-edge').forEach(e => e.classList.remove('active'));

        // Sequence of visualization build
        setTimeout(() => {
            const uploadNode = document.getElementById('archNodeUpload');
            if (uploadNode) uploadNode.classList.add('active');
        }, 400);

        setTimeout(() => {
            const clonerNode = document.getElementById('archNodeCloner');
            const e1 = document.getElementById('archEdge1');
            if (clonerNode) clonerNode.classList.add('active');
            if (e1) e1.classList.add('active');
        }, 1000);

        setTimeout(() => {
            const dbNode = document.getElementById('archNodeDB');
            const e2 = document.getElementById('archEdge2');
            if (dbNode) dbNode.classList.add('active-sec');
            if (e2) e2.classList.add('active');
        }, 1600);

        setTimeout(() => {
            const llmNode = document.getElementById('archNodeLLM');
            const e3 = document.getElementById('archEdge3');
            if (llmNode) llmNode.classList.add('active');
            if (e3) e3.classList.add('active');
        }, 2200);

        setTimeout(() => {
            const uiNode = document.getElementById('archNodeUI');
            const e4 = document.getElementById('archEdge4');
            const e5 = document.getElementById('archEdge5');
            if (uiNode) uiNode.classList.add('active-sec');
            if (e4) e4.classList.add('active');
            if (e5) e5.classList.add('active');
        }, 2800);
    }

    // Step 9 Advanced Intelligence Tabs switcher
    function runStep9AdvancedHub() {
        document.getElementById('simStatusText').textContent = "Synthesizing Core Security & Reviews...";
        switchIntelTab('dependency');

        // Loop rotate tabs automatically for presentation if requested
        let tabs = ['dependency', 'hotspot', 'security', 'review'];
        let tIdx = 0;
        
        currentTypewriterInterval = setInterval(() => {
            tIdx = (tIdx + 1) % tabs.length;
            switchIntelTab(tabs[tIdx]);
        }, 2000);
    }

    function switchIntelTab(tabName) {
        document.querySelectorAll('.intel-tab').forEach(t => {
            t.classList.toggle('active', t.getAttribute('data-tab') === tabName);
        });
        document.querySelectorAll('.intel-pane').forEach(p => {
            p.classList.toggle('active', p.id === `intelPane-${tabName}`);
        });
    }

    // Switch active timeline item clicking
    function setStep(stepNum) {
        if (!unlockedSteps.includes(stepNum) && !isDemoRunning) return;

        currentStep = stepNum;
        
        // Update timeline DOM styles
        document.querySelectorAll('.step-item').forEach(el => {
            const sVal = parseInt(el.getAttribute('data-step'));
            el.classList.toggle('active', sVal === stepNum);
            el.classList.toggle('completed', sVal < stepNum);
        });

        // Set sidebar progress bar height percentage
        const progressPct = ((stepNum - 1) / 8) * 100;
        const timelineProgress = document.getElementById('timelineProgressBar');
        if (timelineProgress) {
            timelineProgress.style.height = `${progressPct}%`;
        }

        // Apply glow properties
        const panel = document.getElementById('simulatorPanel');
        if (panel) {
            panel.className = "simulator-panel " + (stepNum % 2 === 0 ? "active-glow-secondary" : "active-glow-primary");
        }

        // Switch simulator displays
        showStepScreen(stepNum);
    }

    // Bind manually clickable timeline elements
    document.querySelectorAll('.step-item').forEach(item => {
        item.addEventListener('click', () => {
            const stepNum = parseInt(item.getAttribute('data-step'));
            setStep(stepNum);
        });
    });

    // Preset repository click inputs
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const repoText = btn.getAttribute('data-repo');
            const input = document.getElementById('uploadInput');
            if (input) {
                input.value = repoText;
                selectedRepo = repoText;
            }
        });
    });

    // Run Automated Demo pipeline
    const runDemoBtn = document.getElementById('runDemoBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');

    if (runDemoBtn) runDemoBtn.addEventListener('click', startPipelineDemo);
    if (analyzeBtn) analyzeBtn.addEventListener('click', startPipelineDemo);

    function startPipelineDemo(e) {
        e.preventDefault();
        if (isDemoRunning) return;

        // Read input if custom URL was set
        const inputVal = document.getElementById('uploadInput') ? document.getElementById('uploadInput').value.trim() : "";
        if (inputVal) {
            selectedRepo = inputVal.replace(/^https?:\/\//, '').replace(/\/$/, '');
        }

        isDemoRunning = true;
        unlockedSteps = [1];
        
        // UI Reset
        document.querySelectorAll('.step-item').forEach(item => {
            item.classList.remove('completed', 'unlocked');
            if (item.getAttribute('data-step') !== "1") {
                item.style.opacity = "0.4";
            }
        });
        
        // Hide Dashboard initially if active
        switchMainTab('workflow');

        // Cancel existing sequence timers
        demoSequenceTimeouts.forEach(clearTimeout);
        demoSequenceTimeouts = [];

        // Clear dashboard button disabled status
        const dashNavTab = document.getElementById('navTabDashboard');
        if (dashNavTab) {
            dashNavTab.classList.add('disabled-tab');
            dashNavTab.title = "Complete pipeline scanner to unlock Dashboard";
        }

        const runStepSequence = (s) => {
            setStep(s);
            // Unlock DOM style
            const stepEl = document.querySelector(`.step-item[data-step="${s}"]`);
            if (stepEl) {
                stepEl.classList.add('unlocked');
                stepEl.style.opacity = "1";
            }
            unlockedSteps.push(s);
        };

        // Execution timers mapping
        runStepSequence(1);

        const timelineIntervals = [
            { step: 2, delay: 3000 },  // Terminal Cloner
            { step: 3, delay: 9000 },  // Semantic chunking
            { step: 4, delay: 14000 }, // Vector generator
            { step: 5, delay: 20000 }, // Database inserts
            { step: 6, delay: 24500 }, // Similarity Query search
            { step: 7, delay: 31000 }, // LLM Chat type
            { step: 8, delay: 38000 }, // SVG Arch layout
            { step: 9, delay: 43500 }  // Intelligence Hub
        ];

        timelineIntervals.forEach(t => {
            let id = setTimeout(() => {
                runStepSequence(t.step);
            }, t.delay);
            demoSequenceTimeouts.push(id);
        });

        // Pipeline Finish timeout
        let endId = setTimeout(() => {
            isDemoRunning = false;
            
            // Mark step 9 completed visually
            const step9El = document.querySelector(`.step-item[data-step="9"]`);
            if(step9El) step9El.classList.add('completed');
            
            // Unlock the Dashboard Access
            if (dashNavTab) {
                dashNavTab.classList.remove('disabled-tab');
                dashNavTab.title = "Click to open Repository Insights";
                // Add a glow nudge to dashboard tab
                dashNavTab.classList.add('glow-nudge');
            }

            // Auto-switch to unlocked Dashboard to show the wow factor!
            setTimeout(() => {
                dashNavTab.classList.remove('glow-nudge');
                switchMainTab('dashboard');
                // Auto alert success toast
                showToast("Deep Intelligence Mapping Completed! Opening Dashboard Overview.");
            }, 1500);

        }, 49500);
        demoSequenceTimeouts.push(endId);
    }

    // Toast alerts helper
    function showToast(msg) {
        const toast = document.createElement('div');
        toast.style.position = "fixed";
        toast.style.bottom = "2rem";
        toast.style.right = "2rem";
        toast.style.background = "linear-gradient(135deg, var(--bg-card), #0d121e)";
        toast.style.border = "1px solid var(--primary)";
        toast.style.boxShadow = "0 8px 24px var(--primary-glow)";
        toast.style.padding = "0.75rem 1.5rem";
        toast.style.borderRadius = "8px";
        toast.style.fontFamily = "var(--font-sans)";
        toast.style.fontSize = "0.85rem";
        toast.style.fontWeight = "600";
        toast.style.color = "var(--text-main)";
        toast.style.zIndex = "1000";
        toast.style.animation = "fadeIn 0.3s ease-out";
        toast.textContent = msg;

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = "fadeOut 0.3s ease-in";
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // Advanced Intelligence Sub-tabs listener
    document.querySelectorAll('.intel-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            // Only toggle manually if not inside active autoplay loop
            if (isDemoRunning && currentStep === 9) {
                clearInterval(currentTypewriterInterval); // stop autoplay loop
            }
            const tabName = btn.getAttribute('data-tab');
            switchIntelTab(tabName);
        });
    });

    // Navigation Main Tabs Switching (Workflow page vs Dashboard insights page)
    window.switchMainTab = function(tabId) {
        // Validation check if dashboard is locked
        if (tabId === 'dashboard') {
            const dashTab = document.getElementById('navTabDashboard');
            if (dashTab && dashTab.classList.contains('disabled-tab')) {
                showToast("Please input a repository and run the AI Pipeline first!");
                return;
            }
        }

        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId);
        });

        document.querySelectorAll('.page-section').forEach(sec => {
            sec.classList.toggle('active', sec.id === `${tabId}Section`);
        });

        if (tabId === 'dashboard') {
            // Activate overview tab inside dashboard
            switchDashPane('overview');
        }
    };

    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            if (target) switchMainTab(target);
        });
    });

    // Dashboard Side Navigation Tabs
    function switchDashPane(paneId) {
        document.querySelectorAll('.dash-menu-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-pane') === paneId);
        });

        document.querySelectorAll('.dash-pane').forEach(p => {
            p.classList.toggle('active', p.id === `dashPane-${paneId}`);
        });

        if (paneId === 'chat') {
            // Focus chatbot input
            const inp = document.getElementById('dashChatInput');
            if(inp) inp.focus();
        }
    }

    document.querySelectorAll('.dash-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const paneId = item.getAttribute('data-pane');
            switchDashPane(paneId);
        });
    });

    // Dashboard Interactive Chatbot Responder
    const chatInput = document.getElementById('dashChatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatMsgBox = document.getElementById('dashChatMessages');

    if (sendChatBtn && chatInput) {
        sendChatBtn.addEventListener('click', handleDashboardChatSubmit);
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleDashboardChatSubmit();
        });
    }

    function handleDashboardChatSubmit() {
        const query = chatInput.value.trim();
        if (!query) return;

        chatInput.value = "";
        appendDashChatMessage("You", query, "user");

        // Mock loader response
        const loader = appendDashChatMessage("Aether AI", "Thinking...", "assistant loader");
        chatMsgBox.scrollTop = chatMsgBox.scrollHeight;

        setTimeout(() => {
            loader.remove();
            const responseObj = generateMockAIResponse(query);
            const msgEl = appendDashChatMessage("Aether AI", responseObj.text, "assistant");
            
            if (responseObj.refs && responseObj.refs.length > 0) {
                const refDiv = document.createElement('div');
                refDiv.className = "chat-msg-references";
                responseObj.refs.forEach(r => {
                    refDiv.innerHTML += `<span class="chat-ref-tag">${r}</span>`;
                });
                msgEl.appendChild(refDiv);
            }
            chatMsgBox.scrollTop = chatMsgBox.scrollHeight;
        }, 1200);
    }

    function appendDashChatMessage(sender, text, type) {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${type}`;
        msg.innerHTML = `
            <span class="chat-msg-sender">${sender}</span>
            <div class="chat-msg-bubble">${text}</div>
        `;
        chatMsgBox.appendChild(msg);
        chatMsgBox.scrollTop = chatMsgBox.scrollHeight;
        return msg;
    }

    function generateMockAIResponse(query) {
        const normalized = query.toLowerCase();
        
        if (normalized.includes('security') || normalized.includes('vulnerabilit')) {
            return {
                text: "My scanning module has detected 2 moderate/high risk vulnerabilities in this repository:\n1. Hardcoded private client secrets located in `src/config/database.ts` at line 14.\n2. Potential ReDoS vulnerability via unsafe regex matching inside `src/api/code/chunker.ts` at line 42.",
                refs: ["src/config/database.ts:L14", "src/api/code/chunker.ts:L42", "Security Report v1"]
            };
        } 
        else if (normalized.includes('architecture') || normalized.includes('structure') || normalized.includes('design')) {
            return {
                text: "The application follows a modular layered architecture. It consists of 3 key sub-services:\n1. Cloner Engine (`src/api/cloner`): downloads and maps structures.\n2. Processing Engine (`src/api/code`): handles tokenizer splits & embeddings.\n3. Large Language Model Agent Router (`src/api/ai`): conducts prompt contextualization and databases searches via ChromaDB APIs.",
                refs: ["System Architecture Diagram", "src/app.ts", "src/index.ts"]
            };
        } 
        else if (normalized.includes('chunk') || normalized.includes('embedding') || normalized.includes('chromadb') || normalized.includes('vector')) {
            return {
                text: "In the indexing pipeline, files are parsed and mapped. Large source code units are split into overlapping lines blocks via semantic rules. They are encoded into 1536-dimension floating arrays using OpenAI Text-Embedding models, and upserted in ChromaDB collections under unique hash keys.",
                refs: ["src/api/code/chunker.ts", "src/api/code/embedder.ts", "src/api/code/vector.db.ts"]
            };
        } 
        else if (normalized.includes('review') || normalized.includes('hotspot') || normalized.includes('optimize')) {
            return {
                text: "Based on static maintainability analyses, `src/api/code/chunker.ts` is marked as a Bug Hotspot (Risk Score 86%) due to high cyclomatic complexity (3 nested loops) and frequent modifications. Refactoring suggestions have been populated under the Code Reviews tab.",
                refs: ["src/api/code/chunker.ts", "Code Reviews recommendations"]
            };
        } 
        else {
            return {
                text: `I've analyzed the codebase for "${query}". The code components are fully indexed in ChromaDB. Let me know if you want details on security vulnerabilities, architecture layout nodes, file chunk definitions, or code optimization recommendations.`,
                refs: ["Repository Index Metadata"]
            };
        }
    }

    // Dashboard Accordion recommendations expand/collapse
    window.toggleRecommendCard = function(el) {
        const card = el.parentElement;
        const isOpen = card.classList.contains('open');
        
        // Close other open cards
        document.querySelectorAll('.rec-card').forEach(c => c.classList.remove('open'));
        
        if (!isOpen) {
            card.classList.add('open');
        }
    };

    // Initialize Canvas space & run resize calculations
    initVectorSpace();
    window.addEventListener('resize', () => {
        resizeCanvas();
    });
    
    // Quick initial timer trigger to make sure container size fits on canvas
    setTimeout(() => {
        resizeCanvas();
        drawVectorSpace();
        showStepScreen(1); // default load step 1
    }, 100);
});
