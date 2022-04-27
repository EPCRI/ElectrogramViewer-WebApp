
export const getFileNames = async () => {
    const response = await fetch("/api/filenames", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.files;
}

export const getFileData = async (fileIdx) => {
    const response = await fetch("/api/file/" + fileIdx, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
}