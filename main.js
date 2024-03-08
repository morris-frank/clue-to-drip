import Alpine from "alpinejs";

import { saveAs } from "file-saver";
import { formatClueJson } from "./src/formatjson";

const readFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result); // desired file content
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });

Alpine.data("fileUpload", () => ({
  file: null,
  fileToDownload: false,
  error: null,

  async onUpload({ target }) {
    try {
      this.file = target.files[0];
      const json = await readFile(target.files[0]);
      const readyData = await formatClueJson(JSON.parse(json));
      this.fileToDownload = readyData;
    } catch {
      this.file = null;
      this.error = true;
    }
  },
  downloadCSV() {
    const blob = new Blob([this.fileToDownload], {
      type: "text/csv;charset=utf-8",
    });
    saveAs(blob, "drip.csv");
  },
}));

Alpine.start();
