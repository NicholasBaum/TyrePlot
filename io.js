const token = '';

function getCsv(url) {
    return fetch(url, {
        headers: {
            Authorization: `token ${token}`
        }
    })
        .then(x => {
            if (!x.ok) {
                throw new Error("HTTP error, status = " + x.status);
            }
            return x;
        })
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
                data[headers[j]][i - 1] = values[j];
                continue;
            }
            data[headers[j]][i - 1] = parseFloat(values[j]);
        }
    }
    return data;
}

function getFileDescriptions() {
    const url = "https://api.github.com/repos/NicholasBaum/TyrePlot/git/trees/gh-pages?recursive=1";

    return fetch(url, {
        headers: {
            Authorization: `token ${token}`
        }
    })
        .then(x => {
            if (!x.ok) {
                throw new Error("HTTP error, status = " + x.status);
            }
            return x;
        })
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