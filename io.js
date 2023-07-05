USE_AUTH_TOKEN = true;

function getCsv(url) {
    return fetchWithRetry(url, apiToken)
        .then(x => x.json())
        .then(x => atob(x.content))
        .then(csv => parseCSV(csv));
}

function parseCSV(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const data = [];

    for (let j = 0; j < headers.length - 1; j++) {
        data[headers[j]] = [];
    }

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        for (let j = 0; j < values.length - 1; j++) {
            if (j == 0) {
                const [seconds, centisecond] = values[j].split(":").map(Number); // e.g. 112:52
                data[headers[j]][i - 1] = seconds + centisecond / 100;
            }
            else {
                data[headers[j]][i - 1] = parseFloat(values[j]);
            }
        }
    }
    return data;
}

function getFileDescriptions() {
    const url = "https://api.github.com/repos/NicholasBaum/TyrePlot/git/trees/gh-pages?recursive=1";

    return fetchWithRetry(url, apiToken)
        .then(response => response.json())
        .then(data => {
            // Filter the response to include only CSV files
            const csvFiles = data.tree.filter(file => file.path.endsWith('.csv'));

            // Function to create nested JSON
            const createNestedJson = (path, value) => {
                const keys = path.split('/').slice(1); // Exclude the first level
                const filename = keys.pop(); // Remove the filename from the path
                let currentLevel = nestedJson;

                // Create nested directories if they don't exist
                keys.forEach(key => {
                    if (!currentLevel[key]) {
                        currentLevel[key] = {};
                    }
                    currentLevel = currentLevel[key];
                });

                currentLevel[filename] = { 'name': filename, 'url': value, 'channels': null }
            };

            // Create nested JSON structure for CSV files
            const nestedJson = {};
            csvFiles.forEach(file => {
                const { path, url } = file;
                createNestedJson(path, url);
            });

            // Print the resulting nested JSON
            //console.log(JSON.stringify(nestedJson, null, 4));
            return nestedJson;
        });
}

function fetchWithRetry(url, authToken, retry = 1) {
    return fetch(url, {
        headers: {
            Authorization: authToken && USE_AUTH_TOKEN ? `token ${authToken}` : undefined
        }
    })
        .then(x => {
            if (!x.ok) {
                if (x.status >= 400 && x.status < 500 && retry > 0) {
                    console.warn("Retrying to fetch data from github without auth token.");
                    USE_AUTH_TOKEN = false;
                    return fetchWithRetry(url, undefined, retry - 1);
                }
                else {
                    throw new Error("HTTP error, status = " + x.status);
                }
            }
            return x;
        });
}
