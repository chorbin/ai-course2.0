# 读取所有课程内容并生成自包含HTML
$courseDir = "C:\Users\Administrator\.qclaw\workspace\AI课程"
$outputFile = "$courseDir\AI课程完整版.html"

# 读取所有章节
$chapters = @{}
for ($i = 1; $i -le 41; $i++) {
    $pattern = "{0:D2}-*.md" -f $i
    $file = Get-ChildItem $courseDir -Filter $pattern | Select-Object -First 1
    if ($file) {
        $chapters[$i] = @{
            filename = $file.Name
            title = $file.Name -replace '^\d{2}-', '' -replace '\.md$', ''
            content = Get-Content $file.FullName -Raw -Encoding UTF8
        }
    }
}

# 模块定义
$modules = @(
    @{id=1; title='AI大模型基础'; icon='🧭'; chapters=1..10},
    @{id=2; title='RAG技术深度实战'; icon='🔍'; chapters=11..13},
    @{id=3; title='Agent开发与实战'; icon='🤖'; chapters=14..19},
    @{id=4; title='开发框架实战'; icon='💻'; chapters=20..25},
    @{id=5; title='模型训练与微调'; icon='⚙️'; chapters=26..31},
    @{id=6; title='模型部署及高并发'; icon='🚀'; chapters=32..34},
    @{id=7; title='低代码平台实战'; icon='📱'; chapters=35..36},
    @{id=8; title='研发工程增效'; icon='🏢'; chapters=37..41}
)

# 生成目录HTML
$navHtml = ""
foreach ($module in $modules) {
    $chaptersHtml = ""
    foreach ($num in $module.chapters) {
        if ($chapters[$num]) {
            $chaptersHtml += "<div class='chapter-item' data-chapter='$num'><span class='chapter-number'>$num.</span><span class='chapter-title'>$($chapters[$num].title)</span></div>"
        }
    }
    $navHtml += "<div class='module-group'><div class='module-header'><span class='module-icon'>$($module.icon)</span><span class='module-title'>$($module.title)</span><span class='module-count'>$($module.chapters.Count)章</span><span class='toggle-icon'>▶</span></div><div class='chapter-list'>$chaptersHtml</div></div>"
}

# 生成课程内容JS对象
$contentJs = "const CONTENT = {"
for ($i = 1; $i -le 41; $i++) {
    if ($chapters[$i]) {
        $content = $chapters[$i].content
        # 转义特殊字符
        $content = $content -replace '\\', '\\\\' -replace '"', '\"' -replace "`r", "" -replace "`n", "\n"
        $contentJs += "`n    $i: `"$content`""
    }
    if ($i -lt 41) { $contentJs += "," }
}
$contentJs += "`n};"

# 完整HTML
$html = @"
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI大模型技术与商业应用 - 完整课程</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
    <style>
        :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --bg-dark: #0f172a;
            --bg-card: #1e293b;
            --bg-hover: #334155;
            --text-primary: #f1f5f9;
            --text-secondary: #94a3b8;
            --border: #334155;
            --accent: #22d3ee;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans SC', sans-serif;
            background: var(--bg-dark);
            color: var(--text-primary);
            line-height: 1.8;
        }
        .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: linear-gradient(135deg, var(--bg-card), var(--bg-dark));
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            padding: 0 20px;
            z-index: 1000;
        }
        .logo { display: flex; align-items: center; gap: 12px; }
        .logo-icon { font-size: 28px; }
        .logo h1 {
            font-size: 18px;
            font-weight: 600;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .header-stats { margin-left: auto; display: flex; gap: 20px; font-size: 13px; color: var(--text-secondary); }
        .container { display: flex; margin-top: 60px; min-height: calc(100vh - 60px); }
        .sidebar {
            width: 320px;
            min-width: 320px;
            background: var(--bg-card);
            border-right: 1px solid var(--border);
            height: calc(100vh - 60px);
            position: sticky;
            top: 60px;
            overflow-y: auto;
        }
        .sidebar-header {
            padding: 16px 20px;
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .sidebar-header h2 { font-size: 14px; font-weight: 600; color: var(--text-secondary); }
        .toggle-all {
            background: var(--bg-hover);
            border: none;
            color: var(--text-secondary);
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .toggle-all:hover { background: var(--primary); color: white; }
        .module-group { border-bottom: 1px solid var(--border); }
        .module-header {
            padding: 14px 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: background 0.2s;
        }
        .module-header:hover { background: var(--bg-hover); }
        .module-icon { font-size: 18px; }
        .module-title { flex: 1; font-size: 14px; font-weight: 500; }
        .module-count {
            font-size: 11px;
            color: var(--text-secondary);
            background: var(--bg-hover);
            padding: 2px 8px;
            border-radius: 10px;
        }
        .toggle-icon { font-size: 10px; color: var(--text-secondary); transition: transform 0.2s; }
        .module-header.expanded .toggle-icon { transform: rotate(90deg); }
        .chapter-list { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; background: rgba(0,0,0,0.2); }
        .chapter-list.show { max-height: 2000px; }
        .chapter-item {
            padding: 10px 20px 10px 50px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
            font-size: 13px;
        }
        .chapter-item:hover { background: var(--bg-hover); }
        .chapter-item.active { background: var(--primary); color: white; }
        .chapter-number { color: var(--text-secondary); font-size: 12px; min-width: 24px; }
        .chapter-item.active .chapter-number { color: rgba(255,255,255,0.7); }
        .content { flex: 1; padding: 40px 60px; max-width: 900px; }
        .welcome-message { text-align: center; padding: 60px 20px; }
        .welcome-message h2 { font-size: 32px; margin-bottom: 16px; }
        .welcome-message p { color: var(--text-secondary); font-size: 18px; }
        .quick-stats { display: flex; gap: 20px; margin-top: 40px; justify-content: center; }
        .stat-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 24px 32px;
            text-align: center;
        }
        .stat-icon { font-size: 32px; margin-bottom: 8px; }
        .stat-number { font-size: 36px; font-weight: 700; color: var(--accent); }
        .stat-label { font-size: 13px; color: var(--text-secondary); margin-top: 4px; }
        .article-content h1 { font-size: 36px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid var(--border); }
        .article-content h2 { font-size: 28px; margin: 40px 0 20px; color: var(--accent); }
        .article-content h3 { font-size: 22px; margin: 32px 0 16px; }
        .article-content h4 { font-size: 18px; margin: 24px 0 12px; }
        .article-content p { margin-bottom: 16px; color: var(--text-primary); }
        .article-content blockquote {
            border-left: 4px solid var(--primary);
            padding: 16px 20px;
            margin: 20px 0;
            background: var(--bg-card);
            border-radius: 0 8px 8px 0;
            color: var(--text-secondary);
        }
        .article-content ul, .article-content ol { margin: 16px 0; padding-left: 24px; }
        .article-content li { margin-bottom: 8px; }
        .article-content table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
        .article-content th, .article-content td { border: 1px solid var(--border); padding: 12px 16px; text-align: left; }
        .article-content th { background: var(--bg-card); font-weight: 600; }
        .article-content tr:nth-child(even) { background: rgba(255,255,255,0.02); }
        .article-content code {
            background: var(--bg-card);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 13px;
            font-family: 'Fira Code', 'Consolas', monospace;
        }
        .article-content pre { background: var(--bg-card); border-radius: 8px; padding: 20px; margin: 20px 0; overflow-x: auto; }
        .article-content pre code { background: none; padding: 0; }
        .article-content hr { border: none; border-top: 1px solid var(--border); margin: 40px 0; }
        .chapter-navigation {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
            padding-top: 40px;
            border-top: 1px solid var(--border);
        }
        .nav-button {
            background: var(--bg-card);
            border: 1px solid var(--border);
            color: var(--text-primary);
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        }
        .nav-button:hover:not(:disabled) { background: var(--primary); border-color: var(--primary); }
        .nav-button:disabled { opacity: 0.3; cursor: not-allowed; }
        .mobile-toggle {
            display: none;
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary);
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            z-index: 1001;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        @media (max-width: 1024px) {
            .sidebar { position: fixed; left: -320px; z-index: 1000; transition: left 0.3s; }
            .sidebar.open { left: 0; }
            .mobile-toggle { display: flex; align-items: center; justify-content: center; }
            .content { padding: 20px; }
            .header-stats { display: none; }
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: var(--bg-dark); }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--text-secondary); }
        .progress-bar {
            position: fixed;
            top: 60px;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary), var(--accent));
            z-index: 999;
            transition: width 0.1s;
        }
    </style>
</head>
<body>
    <div class="progress-bar" id="progressBar"></div>
    <header class="header">
        <div class="logo">
            <span class="logo-icon">🤖</span>
            <h1>AI大模型技术与商业应用</h1>
        </div>
        <div class="header-stats">
            <span>📚 41章节</span>
            <span>🎯 八大模块</span>
        </div>
    </header>
    <div class="container">
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <h2>📚 课程目录</h2>
                <button class="toggle-all" id="toggleAll">全部展开</button>
            </div>
            <nav id="chapterNav">$navHtml</nav>
        </aside>
        <main class="content" id="mainContent">
            <div class="welcome-message">
                <h2>👋 欢迎来到AI学习之旅</h2>
                <p>请从左侧目录选择章节开始学习</p>
                <div class="quick-stats">
                    <div class="stat-card">
                        <div class="stat-icon">📖</div>
                        <div class="stat-number">41</div>
                        <div class="stat-label">章节课程</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-number">8</div>
                        <div class="stat-label">核心模块</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💡</div>
                        <div class="stat-number">100+</div>
                        <div class="stat-label">实战案例</div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <button class="mobile-toggle" id="mobileToggle">☰</button>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.0/marked.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script>
        $contentJs
        let currentChapter = null;
        let allExpanded = false;
        const sidebar = document.getElementById('sidebar');
        const chapterNav = document.getElementById('chapterNav');
        const mainContent = document.getElementById('mainContent');
        const progressBar = document.getElementById('progressBar');
        const toggleAllBtn = document.getElementById('toggleAll');
        const mobileToggle = document.getElementById('mobileToggle');
        
        document.addEventListener('DOMContentLoaded', () => {
            setupEvents();
            marked.setOptions({ breaks: true, gfm: true });
            const hash = location.hash.match(/#chapter-(\d+)/);
            if (hash) loadChapter(parseInt(hash[1]));
        });
        
        function setupEvents() {
            chapterNav.addEventListener('click', (e) => {
                const header = e.target.closest('.module-header');
                if (header) {
                    header.classList.toggle('expanded');
                    header.nextElementSibling.classList.toggle('show');
                }
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
                progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
            });
            
            window.addEventListener('popstate', e => {
                if (e.state?.chapter) loadChapter(e.state.chapter);
            });
        }
        
        function loadChapter(num) {
            document.querySelectorAll('.chapter-item.active').forEach(el => el.classList.remove('active'));
            const item = document.querySelector(`.chapter-item[data-chapter="\${num}"]`);
            if (item) {
                item.classList.add('active');
                const parent = item.closest('.module-group');
                if (parent) {
                    parent.querySelector('.module-header').classList.add('expanded');
                    parent.querySelector('.chapter-list').classList.add('show');
                }
            }
            
            currentChapter = num;
            const content = CONTENT[num];
            if (content) {
                mainContent.innerHTML = \`<article class="article-content">\${marked.parse(content)}\${navButtons(num)}</article>\`;
                document.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
                history.pushState({ chapter: num }, '', '#chapter-' + num);
                scrollTo(0, 0);
            } else {
                mainContent.innerHTML = '<div class="welcome-message"><h2>😕 内容加载失败</h2><p>第 ' + num + ' 章内容不存在</p></div>';
            }
        }
        
        function navButtons(num) {
            const prev = num > 1 ? num - 1 : null;
            const next = num < 41 ? num + 1 : null;
            const getTitle = n => CONTENT[n] ? '' : '';
            return \`<div class="chapter-navigation">
                <button class="nav-button" \${!prev ? 'disabled' : ''} onclick="loadChapter(\${prev})">← 上一章</button>
                <button class="nav-button" \${!next ? 'disabled' : ''} onclick="loadChapter(\${next})">下一章 →</button>
            </div>\`;
        }
    </script>
</body>
</html>
"@

# 写入文件
$html | Out-File $outputFile -Encoding UTF8
Write-Host "生成完成: $outputFile"
Write-Host "文件大小: $((Get-Item $outputFile).Length / 1MB) MB"