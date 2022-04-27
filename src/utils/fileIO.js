
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

export const getAnnotationNames = async () => {
    const response = await fetch("/api/annotationnames", {
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

export const getAnnotationData = async (fileIdx) => {
    const response = await fetch("/api/getannotation/" + fileIdx, {
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

export const saveAnnotationData = async (fileIdx, annotations) => {
    const obj = {
        fileIdx,
        annotations
    };
    console.log("saveAnnotationData()");
    const response = await fetch("/api/postannotation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('POST: ', data);
    return data;
}