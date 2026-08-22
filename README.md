this is a test <?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1000 800">
    <foreignObject width="100%" height="100%">
        <html xmlns="http://www.w3.org/1999/xhtml" style="height: 100%; width: 100%; overflow: auto;">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>GAME FILES</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #1e1e1e;
                        color: #d4d4d4;
                        margin: 0;
                        padding: 20px;
                        min-height: 100%;
                    }
                    h1 {
                        color: #569cd6;
                        text-align: center;
                        border-bottom: 1px solid #333;
                        padding-bottom: 10px;
                    }
                    #status {
                        text-align: center;
                        color: #ce9178;
                        margin-bottom: 20px;
                    }
                    .file-list {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    .file-item {
                        background-color: #252526;
                        padding: 15px;
                        border-radius: 6px;
                        border: 1px solid #333;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .file-name {
                        font-size: 16px;
                        font-family: monospace;
                        word-break: break-all;
                        margin-right: 15px;
                    }
                    .buttons {
                        display: flex;
                        gap: 8px;
                        flex-shrink: 0;
                    }
                    button {
                        background-color: #0e639c;
                        color: white;
                        border: none;
                        padding: 8px 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: background-color 0.2s;
                    }
                    button:hover {
                        background-color: #1177bb;
                    }
                    button.blob-btn { background-color: #4b8b3b; }
                    button.blob-btn:hover { background-color: #5a9c4a; }
                    button.data-btn { background-color: #9a5334; }
                    button.data-btn:hover { background-color: #b06240; }
                </style>
            </head>
            <body>

                <h1>GAME FILES</h1>
                <div id="status">Fetching files from julianlockibarra-cat/games...</div>
                <div class="file-list" id="fileList"></div>

                <script>
                //<![CDATA[
                    const REPO_OWNER = 'julianlockibarra-cat';
                    const REPO_NAME = 'games';
                    const BRANCH = 'main';
                    
                    const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${BRANCH}?recursive=1`;
                    const RAW_BASE_URL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/`;

                    const fileListElement = document.getElementById('fileList');
                    const statusElement = document.getElementById('status');

                    function createHTML(tag) {
                        return document.createElementNS('http://www.w3.org/1999/xhtml', tag);
                    }

                    async function init() {
                        try {
                            const response = await fetch(API_URL);
                            if (!response.ok) throw new Error('Failed to fetch repo data. Check if the repo is public.');
                            
                            const data = await response.json();
                            const htmlFiles = data.tree.filter(item => item.type === 'blob' && item.path.endsWith('.html'));
                            
                            statusElement.innerText = `Found ${htmlFiles.length} HTML files.`;
                            renderFiles(htmlFiles);
                        } catch (error) {
                            statusElement.innerText = `Error: ${error.message}`;
                            statusElement.style.color = 'red';
                        }
                    }

                    function renderFiles(files) {
                        files.forEach(file => {
                            const div = createHTML('div');
                            div.className = 'file-item';
                            div.style.flexWrap = 'wrap'; 
                            
                            const nameSpan = createHTML('span');
                            nameSpan.className = 'file-name';
                            nameSpan.innerText = file.path;

                            const btnGroup = createHTML('div');
                            btnGroup.className = 'buttons';
                            btnGroup.style.flexWrap = 'wrap';

                            const blankBtn = createHTML('button');
                            blankBtn.innerText = 'open in blank tab';
                            blankBtn.onclick = () => fetchAndOpen(file.path, 'blank');

                            const blobBtn = createHTML('button');
                            blobBtn.className = 'blob-btn';
                            blobBtn.innerText = 'open in blob tab';
                            blobBtn.onclick = () => fetchAndOpen(file.path, 'blob');

                            const dataBtn = createHTML('button');
                            dataBtn.className = 'data-btn';
                            dataBtn.innerText = 'open in data tab';
                            dataBtn.onclick = (e) => fetchAndOpen(file.path, 'data', btnGroup);

                            const dlBtn = createHTML('button');
                            dlBtn.style.backgroundColor = '#7a3e9d';
                            dlBtn.innerText = 'download';
                            dlBtn.onclick = () => fetchAndOpen(file.path, 'download');

                            btnGroup.appendChild(blankBtn);
                            btnGroup.appendChild(blobBtn);
                            btnGroup.appendChild(dataBtn);
                            btnGroup.appendChild(dlBtn);

                            div.appendChild(nameSpan);
                            div.appendChild(btnGroup);
                            fileListElement.appendChild(div);
                        });
                    }

                    async function fetchAndOpen(path, method, containerElement = null) {
                        statusElement.innerText = `Fetching ${path}...`;
                        try {
                            const response = await fetch(RAW_BASE_URL + path);
                            const htmlContent = await response.text();
                            
                            if (method === 'blank') {
                                const win = window.open('about:blank');
                                win.document.open();
                                win.document.write(htmlContent);
                                win.document.close();
                            } 
                            else if (method === 'blob') {
                                const blob = new Blob([htmlContent], { type: 'text/html' });
                                const url = URL.createObjectURL(blob);
                                window.open(url);
                            } 
                            else if (method === 'data') {
                                const encodedHtml = encodeURIComponent(htmlContent);
                                const url = `data:text/html;charset=utf-8,${encodedHtml}`;
                                const gameName = path.split('/').pop().replace(/\.html$/i, '');
                                
                                const existingLink = containerElement.querySelector('.draggable-link');
                                if (existingLink) {
                                    existingLink.remove();
                                }

                                const link = createHTML('a');
                                link.href = url;
                                link.innerText = `drag me to the url bar to play ${gameName} then click enter`;
                                link.style.backgroundColor = '#b06240';
                                link.style.color = 'white';
                                link.style.padding = '8px 12px';
                                link.style.borderRadius = '4px';
                                link.style.textDecoration = 'none';
                                link.style.fontSize = '14px';
                                link.style.display = 'inline-block';
                                link.style.cursor = 'grab';
                                link.style.marginTop = '5px';
                                link.style.width = '100%';
                                link.style.textAlign = 'center';
                                link.className = 'draggable-link';
                                link.title = `Drag and drop this link into your address bar!`;
                                
                                if (containerElement) {
                                    containerElement.appendChild(link);
                                }
                            }
                            else if (method === 'download') {
                                const encodedHtml = encodeURIComponent(htmlContent);
                                const url = `data:text/html;charset=utf-8,${encodedHtml}`;
                                
                                const a = createHTML('a');
                                a.href = url;
                                a.download = path.split('/').pop(); 
                                
                                // SVG fix: query the inner body rather than relying on document.body
                                const body = document.querySelector('body');
                                body.appendChild(a);
                                a.click();
                                body.removeChild(a);
                            }
                            statusElement.innerText = `Successfully processed ${path}!`;
                        } catch (error) {
                            statusElement.innerText = `Failed to process ${path}.`;
                            console.error(error);
                        }
                    }

                    init();
                //]]>
                </script>
            </body>
        </html>
    </foreignObject>
</svg>
