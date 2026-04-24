#!/usr/bin/env python3
import os

# Read markdown content
with open(r'C:\Users\Administrator\.qclaw\workspace\AI课程\14-Function Calling与MCP.md', 'r', encoding='utf-8') as f:
    markdown_content = f.read()

# Escape for JavaScript string
markdown_escaped = markdown_content.replace('\\', '\\\\').replace('`', '\\`').replace('$', '\\$')

html_template = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>第14章 Function Calling与MCP</title>
    <script src="https://cdn.jsdelivr.net/npm/marked@11.1.1/marked.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css">
    <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/highlight.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            min-height: 100vh;
            color: #e2e8f0;
            line-height: 1.8;
        }
        .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
        .markdown-content {
            background: rgba(30, 41, 59, 0.6);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 40px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }
        .markdown-content h1 {
            color: #60a5fa;
            font-size: 2.2em;
            margin-bottom: 0.5em;
            padding-bottom: 0.3em;
            border-bottom: 2px solid rgba(96, 165, 250, 0.3);
        }
        .markdown-content h2 {
            color: #38bdf8;
            font-size: 1.7em;
            margin-top: 1.5em;
            margin-bottom: 0.8em;
            padding-bottom: 0.2em;
            border-bottom: 1px solid rgba(56, 189, 248, 0.2);
        }
        .markdown-content h3 {
            color: #7dd3fc;
            font-size: 1.3em;
            margin-top: 1.2em;
            margin-bottom: 0.6em;
        }
        .markdown-content h4 {
            color: #a5f3fc;
            font-size: 1.1em;
            margin-top: 1em;
            margin-bottom: 0.5em;
        }
        .markdown-content p {
            margin-bottom: 1em;
            color: #cbd5e1;
        }
        .markdown-content blockquote {
            background: linear-gradient(90deg, rgba(96, 165, 250, 0.15), transparent);
            border-left: 4px solid #60a5fa;
            padding: 16px 20px;
            margin: 1.5em 0;
            border-radius: 0 8px 8px 0;
            font-style: italic;
            color: #94a3b8;
        }
        .markdown-content blockquote p { margin: 0; }
        .markdown-content code {
            background: rgba(15, 23, 42, 0.8);
            padding: 2px 8px;
            border-radius: 4px;
            font-family: "SF Mono", Monaco, "Cascadia Code", monospace;
            font-size: 0.9em;
            color: #f472b6;
        }
        .markdown-content pre {
            background: #0f172a;
            border-radius: 12px;
            padding: 20px;
            margin: 1.5em 0;
            overflow-x: auto;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .markdown-content pre code {
            background: transparent;
            padding: 0;
            color: inherit;
            font-size: 0.85em;
            line-height: 1.6;
        }
        .markdown-content ul, .markdown-content ol {
            margin: 1em 0;
            padding-left: 2em;
        }
        .markdown-content li {
            margin-bottom: 0.5em;
            color: #cbd5e1;
        }
        .markdown-content li::marker { color: #60a5fa; }
        .markdown-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5em 0;
            background: rgba(15, 23, 42, 0.5);
            border-radius: 8px;
            overflow: hidden;
        }
        .markdown-content th {
            background: rgba(96, 165, 250, 0.2);
            color: #60a5fa;
            padding: 12px 16px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid rgba(96, 165, 250, 0.3);
        }
        .markdown-content td {
            padding: 12px 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            color: #cbd5e1;
        }
        .markdown-content tr:hover { background: rgba(96, 165, 250, 0.05); }
        .markdown-content hr {
            border: none;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.5), transparent);
            margin: 2em 0;
        }
        .markdown-content strong {
            color: #fbbf24;
            font-weight: 600;
        }
        .markdown-content a {
            color: #60a5fa;
            text-decoration: none;
            border-bottom: 1px dotted rgba(96, 165, 250, 0.5);
            transition: all 0.3s ease;
        }
        .markdown-content a:hover {
            color: #93c5fd;
            border-bottom-style: solid;
        }
        .markdown-content pre code.hljs { background: transparent; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); }
        ::-webkit-scrollbar-thumb { background: rgba(96, 165, 250, 0.5); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(96, 165, 250, 0.7); }
        @media (max-width: 768px) {
            .container { padding: 20px 15px; }
            .markdown-content { padding: 24px; }
            .markdown-content h1 { font-size: 1.7em; }
            .markdown-content h2 { font-size: 1.4em; }
            .markdown-content pre { padding: 15px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div id="content" class="markdown-content"></div>
    </div>
    <script>
        const markdownContent = `%s`;
        
        // Configure marked
        marked.setOptions({
            highlight: function(code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(code, { language: lang }).value;
                }
                return hljs.highlightAuto(code).value;
            },
            breaks: true,
            gfm: true
        });
        
        // Render markdown
        document.getElementById('content').innerHTML = marked.parse(markdownContent);
        
        // Highlight all code blocks
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    </script>
</body>
</html>''' % markdown_escaped

output_path = r'C:\Users\Administrator\.qclaw\workspace\AI课程\chapter-14.html'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(html_template)

print(f"HTML file created successfully at: {output_path}")
print(f"File size: {os.path.getsize(output_path)} bytes")
