// ===== Configuration =====
const CONFIG = {
    coursePath: '../',  // Markdown files are in parent directory
    modules: [
        {
            id: 1,
            title: 'AI大模型基础',
            icon: '🧭',
            chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        },
        {
            id: 2,
            title: 'RAG技术深度实战',
            icon: '🔍',
            chapters: [11, 12, 13]
        },
        {
            id: 3,
            title: 'Agent开发与实战',
            icon: '🤖',
            chapters: [14, 15, 16, 17, 18, 19]
        },
        {
            id: 4,
            title: '开发框架实战',
            icon: '💻',
            chapters: [20, 21, 22, 23, 24, 25]
        },
        {
            id: 5,
            title: '模型训练与微调',
            icon: '⚙️',
            chapters: [26, 27, 28, 29, 30, 31]
        },
        {
            id: 6,
            title: '模型部署及高并发',
            icon: '🚀',
            chapters: [32, 33, 34]
        },
        {
            id: 7,
            title: '低代码平台实战',
            icon: '📱',
            chapters: [35, 36]
        },
        {
            id: 8,
            title: '研发工程增效',
            icon: '🏢',
            chapters: [37, 38, 39, 40, 41]
        }
    ],
    chapterFiles: {
        1: '01-开学典礼.md',
        2: '02-从提示工程到RAG：构建大模型的知识与交互基础.md',
        3: '03-Agent：从可控性到自主反思.md',
        4: '04-多模态前沿：从Agent构建到视频AIGC.md',
        5: '05-AI大模型基本原理及API使用.md',
        6: '06-AI编程-从入门到精通.md',
        7: '07-OpenClaw-搭建你的私人助理.md',
        8: '08-Embeddings和向量数据库.md',
        9: '09-RAG技术与应用.md',
        10: '10-RAG多模态数据处理.md',
        11: '11-RAG调优.md',
        12: '12-项目实战：企业知识库.md',
        13: '13-就业服务：RAG相关简历+面试问题辅导.md',
        14: '14-Function Calling与MCP.md',
        15: '15-Agent的自主规划与工具开发.md',
        16: '16-构建Agent的搜索、感知与记忆能力.md',
        17: '17-Agent的能力优化与效果评估.md',
        18: '18-项目实战：OpenManus开发实践.md',
        19: '19-就业服务：Agent相关简历+面试问题辅导.md',
        20: '20-LangChain：多任务应用开发.md',
        21: '21-AI框架设计与选型.md',
        22: '22-HuggingFace生态实战：从模型应用到高效微调.md',
        23: '23-神经网络基础与TensorFlow实战.md',
        24: '24-PyTorch与视觉检测.md',
        25: '25-就业服务：开发框架相关简历+面试问题辅导.md',
        26: '26-LLM微调原理.md',
        27: '27-高质量微调数据工程与评估.md',
        28: '28-LLM模型蒸馏与微调实操.md',
        29: '29-视觉与多模态模型.md',
        30: '30-项目实战：AI质检.md',
        31: '31-就业服务：模型训练与微调相关简历+面试问题辅导.md',
        32: '32-企业级AI部署：从硬件选型到框架选择.md',
        33: '33-AI服务核心：高并发原理与性能监控调优.md',
        34: '34-SGLang深度优化：Radix缓存与多并发任务的极致交互.md',
        35: '35-Coze工作原理与应用实例.md',
        36: '36-Dify本地化部署与应用.md',
        37: '37-Agent调试、运维与系统集成.md',
        38: '38-AI赋能的智能测试与质量保障.md',
        39: '39-从Text-to-SQL到数据智能.md',
        40: '40-项目实战：ChatBI开发实战.md',
        41: '41-就业服务：部署及特效相关简历+面试问题辅导.md'
    }
};

// ===== State Management =====
const state = {
    currentChapter: null,
    allExpanded: false
};

// ===== DOM Elements =====
const elements = {
    sidebar: null,
    chapterNav: null,
    mainContent: null,
    progressBar: null,
    toggleAllBtn: null,
    mobileMenuToggle: null
};

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    renderChapterNav();
    setupEventListeners();
    configureMarkdownRenderer();
    loadInitialChapter();
});

function initializeElements() {
    elements.sidebar = document.getElementById('sidebar');
    elements.chapterNav = document.getElementById('chapterNav');
    elements.mainContent = document.getElementById('mainContent');
    elements.progressBar = document.getElementById('progressBar');
    elements.toggleAllBtn = document.getElementById('toggleAll');
    elements.mobileMenuToggle = document.getElementById('mobileMenuToggle');
}

// ===== Render Chapter Navigation =====
function renderChapterNav() {
    const navHTML = CONFIG.modules.map(module => {
        const chaptersHTML = module.chapters.map(chapterNum => {
            const fileName = CONFIG.chapterFiles[chapterNum];
            const chapterTitle = fileName.replace(/^\d{2}-/, '').replace('.md', '');
            return `
                <div class="chapter-item" data-chapter="${chapterNum}">
                    <span class="chapter-number">${chapterNum}.</span>
                    <span class="chapter-title">${chapterTitle}</span>
                </div>
            `;
        }).join('');
        
        return `
            <div class="module-group">
                <div class="module-header" data-module="${module.id}">
                    <span class="module-icon">${module.icon}</span>
                    <span class="module-title">${module.title}</span>
                    <span class="module-count">${module.chapters.length}章</span>
                    <span class="toggle-icon">▶</span>
                </div>
                <div class="chapter-list">
                    ${chaptersHTML}
                </div>
            </div>
        `;
    }).join('');
    
    elements.chapterNav.innerHTML = navHTML;
}

// ===== Setup Event Listeners =====
function setupEventListeners() {
    // Module header click - expand/collapse
    elements.chapterNav.addEventListener('click', (e) => {
        const moduleHeader = e.target.closest('.module-header');
        if (moduleHeader) {
            toggleModule(moduleHeader);
        }
        
        const chapterItem = e.target.closest('.chapter-item');
        if (chapterItem) {
            loadChapter(parseInt(chapterItem.dataset.chapter));
        }
    });
    
    // Toggle all modules
    elements.toggleAllBtn.addEventListener('click', toggleAllModules);
    
    // Mobile menu toggle
    elements.mobileMenuToggle.addEventListener('click', () => {
        elements.sidebar.classList.toggle('open');
    });
    
    // Close sidebar on chapter load (mobile)
    elements.chapterNav.addEventListener('click', (e) => {
        if (e.target.closest('.chapter-item') && window.innerWidth <= 768) {
            elements.sidebar.classList.remove('open');
        }
    });
    
    // Scroll progress
    window.addEventListener('scroll', updateProgress);
}

// ===== Toggle Module =====
function toggleModule(moduleHeader) {
    const chapterList = moduleHeader.nextElementSibling;
    const isExpanded = moduleHeader.classList.contains('expanded');
    
    if (isExpanded) {
        moduleHeader.classList.remove('expanded');
        chapterList.classList.remove('show');
    } else {
        moduleHeader.classList.add('expanded');
        chapterList.classList.add('show');
    }
}

// ===== Toggle All Modules =====
function toggleAllModules() {
    const allModules = document.querySelectorAll('.module-header');
    state.allExpanded = !state.allExpanded;
    
    allModules.forEach(moduleHeader => {
        const chapterList = moduleHeader.nextElementSibling;
        if (state.allExpanded) {
            moduleHeader.classList.add('expanded');
            chapterList.classList.add('show');
        } else {
            moduleHeader.classList.remove('expanded');
            chapterList.classList.remove('show');
        }
    });
    
    elements.toggleAllBtn.textContent = state.allExpanded ? '全部收起' : '全部展开';
}

// ===== Load Chapter =====
async function loadChapter(chapterNum) {
    // Update active state
    updateActiveChapter(chapterNum);
    
    // Show loading state
    elements.mainContent.innerHTML = '<div class="loading">正在加载章节内容...</div>';
    
    try {
        const fileName = CONFIG.chapterFiles[chapterNum];
        const filePath = `${CONFIG.coursePath}${fileName}`;
        
        console.log('Loading:', filePath);
        
        // Fetch markdown content
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        
        const markdown = await response.text();
        renderMarkdown(markdown, chapterNum);
        
        // Update URL without reload
        history.pushState({ chapter: chapterNum }, '', `#chapter-${chapterNum}`);
        
    } catch (error) {
        console.error('Error loading chapter:', error);
        showError(chapterNum, error.message);
    }
}

// ===== Update Active Chapter =====
function updateActiveChapter(chapterNum) {
    // Remove previous active state
    document.querySelectorAll('.chapter-item.active').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active state to current chapter
    const currentChapter = document.querySelector(`.chapter-item[data-chapter="${chapterNum}"]`);
    if (currentChapter) {
        currentChapter.classList.add('active');
        
        // Expand parent module
        const parentModule = currentChapter.closest('.module-group');
        if (parentModule) {
            const moduleHeader = parentModule.querySelector('.module-header');
            const chapterList = parentModule.querySelector('.chapter-list');
            moduleHeader.classList.add('expanded');
            chapterList.classList.add('show');
        }
        
        // Scroll chapter into view
        currentChapter.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    state.currentChapter = chapterNum;
}

// ===== Render Markdown =====
function renderMarkdown(markdown, chapterNum) {
    // Parse and render markdown
    const htmlContent = marked.parse(markdown);
    
    // Create article wrapper
    const articleHTML = `
        <article class="article-content">
            ${htmlContent}
            ${renderNavigation(chapterNum)}
        </article>
    `;
    
    elements.mainContent.innerHTML = articleHTML;
    
    // Apply syntax highlighting
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Render Navigation Buttons =====
function renderNavigation(currentChapter) {
    const prevChapter = currentChapter > 1 ? currentChapter - 1 : null;
    const nextChapter = currentChapter < 41 ? currentChapter + 1 : null;
    
    const getChapterTitle = (num) => {
        const fileName = CONFIG.chapterFiles[num];
        return fileName.replace(/^\d{2}-/, '').replace('.md', '');
    };
    
    return `
        <div class="chapter-navigation">
            <button class="nav-button prev-btn" ${!prevChapter ? 'disabled' : ''} data-chapter="${prevChapter}">
                ← 上一章 ${prevChapter ? getChapterTitle(prevChapter).substring(0, 20) + '...' : ''}
            </button>
            <button class="nav-button next-btn" ${!nextChapter ? 'disabled' : ''} data-chapter="${nextChapter}">
                ${nextChapter ? getChapterTitle(nextChapter).substring(0, 20) + '...' : ''} 下一章 →
            </button>
        </div>
    `;
}

// ===== Configure Markdown Renderer =====
function configureMarkdownRenderer() {
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false
    });
}

// ===== Load Initial Chapter =====
function loadInitialChapter() {
    // Check URL hash for chapter number
    const hash = window.location.hash;
    const match = hash.match(/#chapter-(\d+)/);
    
    if (match) {
        const chapterNum = parseInt(match[1]);
        if (chapterNum >= 1 && chapterNum <= 41) {
            loadChapter(chapterNum);
            return;
        }
    }
    
    // Default: expand first module
    const firstModule = document.querySelector('.module-header');
    if (firstModule) {
        firstModule.classList.add('expanded');
        firstModule.nextElementSibling.classList.add('show');
    }
}

// ===== Show Error =====
function showError(chapterNum, errorMsg) {
    elements.mainContent.innerHTML = `
        <div class="welcome-message">
            <h2>😕 加载失败</h2>
            <p>无法加载第 ${chapterNum} 章内容</p>
            <p style="color: #888; font-size: 14px;">错误: ${errorMsg}</p>
            <p style="color: #888; font-size: 14px;">文件: ${CONFIG.chapterFiles[chapterNum]}</p>
            <button onclick="loadChapter(${chapterNum})" class="nav-button" style="margin-top: 2rem;">
                重新加载
            </button>
        </div>
    `;
}

// ===== Update Progress Bar =====
function updateProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    
    if (elements.progressBar) {
        elements.progressBar.style.width = `${progress}%`;
    }
}

// ===== Handle Browser Back/Forward =====
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.chapter) {
        loadChapter(event.state.chapter);
    }
});

// ===== Handle Navigation Button Clicks =====
document.addEventListener('click', (e) => {
    const navButton = e.target.closest('.nav-button');
    if (navButton && !navButton.disabled) {
        const chapter = navButton.dataset.chapter;
        if (chapter) {
            loadChapter(parseInt(chapter));
        }
    }
});