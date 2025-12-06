window.SVGApp = (function () {
    const XHTML_NS = "http://www.w3.org/1999/xhtml";

    const DATA_ID_ROOT = "dataStore";

    const svgRef = document.getElementById('svgApp');

    function _getSvgFileName() {
        try {
            const path = window.location.pathname;
            const name = path.split('/').pop();
            return name || 'export.svg';
        } catch (e) {
            return 'export.svg';
        }
    }

    function _getStorageDataId() {
        return `${DATA_ID_ROOT}_${_getSvgFileName()}`;
    }

    function _readFromSVG() {
        const elem = document.getElementById(DATA_ID_ROOT);
        if (!elem) return {};
        try { return JSON.parse(elem.textContent); } catch { return {}; }
    }

    function _readFromLocalStorage() {
        try { return JSON.parse(localStorage.getItem(_getStorageDataId())) || {}; }
        catch { return {}; }
    }

    function loadData() {
        const svgData = _readFromSVG();
        const lsData = _readFromLocalStorage();
        return { ...svgData, ...lsData };
    }

    function _writeToSVG(obj) {
        let elem = document.getElementById(DATA_ID_ROOT);
        if (!elem) {
            elem = createSVGElement("script", "", DATA_ID_ROOT);
            elem.setAttribute("type", "application/json");
            document.documentElement.appendChild(elem);
        }
        console.log(obj)
        elem.textContent = JSON.stringify(obj);
    }

    function _writeToLocalStorage(obj) {
        localStorage.setItem(_getStorageDataId(), JSON.stringify(obj));
    }

    function saveData(obj) {
        _writeToSVG(obj);
        _writeToLocalStorage(obj);
    }

    async function exportSVG() {
        const defaultName = _getSvgFileName();
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(svgRef);
        const blob = new Blob([source], { type: 'image/svg+xml' });

        if (window.showSaveFilePicker) {
            try {
                const handle = await window.showSaveFilePicker({
                    suggestedName: defaultName,
                    types: [
                        {
                            description: "SVG File",
                            accept: { "image/svg+xml": [".svg"] },
                        },
                    ],
                });

                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();

                console.log("Saved with File System Access API");
                return;
            } catch (err) {
                if (err.name === "AbortError") {
                    console.log("User cancelled the save dialog.");
                    return;
                }
                console.warn("File System API failed, falling back to download.", err);
            }
        }

        const url = URL.createObjectURL(blob);

        const a = createSVGElement("a");
        a.href = url;
        a.download = defaultName;
        a.dispatchEvent(new MouseEvent("click"));

        URL.revokeObjectURL(url);

        console.log("Saved via fallback download");
    }

    function createSVGElement(tag, elemClass, elemId) {
        const elem = document.createElementNS(XHTML_NS, tag);
        if (elemClass) {
            elem.setAttribute("class", elemClass);
        }
        if (elemId) {
            elem.setAttribute("id", elemId);
        }
        return elem;
    }

    function init(width, height) {
        svgRef.setAttribute("width", width);
        svgRef.setAttribute("height", height);
        svgRef.setAttribute("viewBox", `0 0 ${width} ${height}`);
    }

    return { loadData, saveData, exportSVG, createSVGElement, init };
})();
