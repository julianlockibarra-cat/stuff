        function loadSnowRider3D() {
            // 1. Inject the Stylesheet
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/gh/drippy-cat/snowrider3D@c82fe583cbffafa502b0aa3ed2da0053972e0c80/TemplateData/style.css';
            document.head.appendChild(link);

            // 2. Create and inject the HTML structure
            const webglContent = document.createElement('div');
            webglContent.className = 'webgl-content';
            webglContent.style.width = '100vw'; 
            webglContent.style.height = '100vh'; 

            const gameContainer = document.createElement('div');
            gameContainer.id = 'gameContainer';
            gameContainer.style.width = '100%';
            gameContainer.style.height = '100%';
            gameContainer.style.margin = 'auto';

            webglContent.appendChild(gameContainer);
            document.body.appendChild(webglContent);

            // 3. Helper function to load scripts sequentially
            function loadScript(src, callback) {
                const script = document.createElement('script');
                script.src = src;
                script.onload = callback;
                document.head.appendChild(script);
            }

            // 4. Load UnityProgress.js first, then UnityLoader.js, then initialize the game
            loadScript('https://cdn.jsdelivr.net/gh/drippy-cat/snowrider3D@c82fe583cbffafa502b0aa3ed2da0053972e0c80/TemplateData/UnityProgress.js', () => {
                loadScript('https://cdn.jsdelivr.net/gh/drippy-cat/snowrider3D@c82fe583cbffafa502b0aa3ed2da0053972e0c80/Build/UnityLoader.js', () => {
                    
                    // 5. Initialize the Unity Game Instance once scripts are ready
                    window.gameInstance = UnityLoader.instantiate(
                        "gameContainer", 
                        "https://cdn.jsdelivr.net/gh/drippy-cat/snowrider3D@c82fe583cbffafa502b0aa3ed2da0053972e0c80/Build/SnowRider3D-gd-1.json", 
                        {
                            onProgress: UnityProgress,
                            Module: {
                                onRuntimeInitialized: function() {
                                    UnityProgress(window.gameInstance, "complete");
                                }
                            }
                        }
                    );

                });
            });
        }

        // Execute the function when the page loads
        window.addEventListener('DOMContentLoaded', loadSnowRider3D);
