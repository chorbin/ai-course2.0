// Course Content - 章节内容将在此加载
// 由于内容量较大，采用延迟加载方式

const CONFIG = {
    modules: [
        { id: 1, title: 'AI大模型基础', icon: '🧭', chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        { id: 2, title: 'RAG技术深度实战', icon: '🔍', chapters: [11, 12, 13] },
        { id: 3, title: 'Agent开发与实战', icon: '🤖', chapters: [14, 15, 16, 17, 18, 19] },
        { id: 4, title: '开发框架实战', icon: '💻', chapters: [20, 21, 22, 23, 24, 25] },
        { id: 5, title: '模型训练与微调', icon: '⚙️', chapters: [26, 27, 28, 29, 30, 31] },
        { id: 6, title: '模型部署及高并发', icon: '🚀', chapters: [32, 33, 34] },
        { id: 7, title: '低代码平台实战', icon: '📱', chapters: [35, 36] },
        { id: 8, title: '研发工程增效', icon: '🏢', chapters: [37, 38, 39, 40, 41] }
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

// State
let currentChapter = null;
let allExpanded = false;

// DOM Elements
const sidebar = document.getElementById('sidebar');
const chapterNav = document.getElementById('chapterNav');
const mainContent = document.getElementById('mainContent');
const progressBar = document.getElementById('progressBar');
const toggleAllBtn = document.getElementById('toggleAll');
const mobileToggle = document.getElementById('mobileToggle');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderNav();
    setupEvents();
    marked.setOptions({ breaks: true, gfm: true });
});

// Render Navigation
function renderNav() {
    let html = '';
    CONFIG.modules.forEach(module => {
        let chaptersHtml = '';
        module.chapters.forEach(num => {
            const title = CONFIG.chapterFiles[num].replace(/^\d{2}-/, '').replace('.md', '');
            chaptersHtml += `<div class="chapter-item" data-chapter="${num}">
                <span class="chapter-number">${num}.</span>
                <span class="chapter-title">${title}</span>
            </div>`;
        });
        
        html += `<div class="module-group">
            <div class="module-header" data-module="${module.id}">
                <span class="module-icon">${module.icon}</span>
                <span class="module-title">${module.title}</span>
                <span class="module-count">${module.chapters.length}章</span>
                <span class="toggle-icon">▶</span>
            </div>
            <div class="chapter-list">${chaptersHtml}</div>
        </div>`;
    });
    chapterNav.innerHTML = html;
}

// Setup Events
function setupEvents() {
    chapterNav.addEventListener('click', (e) => {
        const header = e.target.closest('.module-header');
        if (header) toggleModule(header);
        
        const item = e.target.closest('.chapter-item');
        if (item) loadChapter(parseInt(item.dataset.chapter));
    });
    
    toggleAllBtn.addEventListener('click', () => {
        allExpanded = !allExpanded;
        document.querySelectorAll('.module-header').forEach(h => {
            h.classList.toggle('expanded', allExpanded);
            h.nextElementSibling.classList.toggle('show', allExpanded);
        });
        toggleAllBtn.textContent = allExpanded ? '全部收起' : '全部展开';
    });
    
    mobileToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    
    window.addEventListener('scroll', () => {
        const progress = (scrollY / (document.documentElement.scrollHeight - innerHeight)) * 100;
        progressBar.style.width = progress + '%';
    });
}

// Toggle Module
function toggleModule(header) {
    header.classList.toggle('expanded');
    header.nextElementSibling.classList.toggle('show');
}

// Load Chapter
async function loadChapter(num) {
    // Update active
    document.querySelectorAll('.chapter-item.active').forEach(el => el.classList.remove('active'));
    const item = document.querySelector(`.chapter-item[data-chapter="${num}"]`);
    if (item) {
        item.classList.add('active');
        const parent = item.closest('.module-group');
        if (parent) {
            parent.querySelector('.module-header').classList.add('expanded');
            parent.querySelector('.chapter-list').classList.add('show');
        }
    }
    
    currentChapter = num;
    mainContent.innerHTML = '<div class="loading">正在加载...</div>';
    
    try {
        const filename = CONFIG.chapterFiles[num];
        // 直接使用相对路径，让浏览器处理编码
        const response = await fetch('./' + filename);
        if (!response.ok) throw new Error('加载失败');
        
        const md = await response.text();
        mainContent.innerHTML = `<article class="article-content">${marked.parse(md)}${navButtons(num)}</article>`;
        
        // Highlight code
        document.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
        
        history.pushState({ chapter: num }, '', '#chapter-' + num);
        scrollTo(0, 0);
    } catch (err) {
        mainContent.innerHTML = `<div class="welcome-message">
            <h2>😕 加载失败</h2>
            <p>无法加载第 ${num} 章</p>
            <p style="color:#888;font-size:14px">文件: ${CONFIG.chapterFiles[num]}</p>
            <p style="color:#888;font-size:14px">错误: ${err.message}</p>
            <button class="nav-button" onclick="loadChapter(${num})" style="margin-top:20px">重试</button>
        </div>`;
    }
}

// Navigation Buttons
function navButtons(num) {
    const prev = num > 1 ? num - 1 : null;
    const next = num < 41 ? num + 1 : null;
    const getTitle = n => CONFIG.chapterFiles[n].replace(/^\d{2}-/, '').replace('.md', '');
    
    return `<div class="chapter-navigation">
        <button class="nav-button" ${!prev ? 'disabled' : ''} onclick="loadChapter(${prev})">
            ← 上一章 ${prev ? getTitle(prev).slice(0, 20) + '...' : ''}
        </button>
        <button class="nav-button" ${!next ? 'disabled' : ''} onclick="loadChapter(${next})">
            ${next ? getTitle(next).slice(0, 20) + '...' : ''} 下一章 →
        </button>
    </div>`;
}

// Handle back/forward
window.addEventListener('popstate', e => {
    if (e.state?.chapter) loadChapter(e.state.chapter);
});

// Initial load
const hash = location.hash.match(/#chapter-(\d+)/);
if (hash) loadChapter(parseInt(hash[1]));
else document.querySelector('.module-header')?.classList.add('expanded');