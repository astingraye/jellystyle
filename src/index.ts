import { buildSass } from "./build.js";
import * as chokidar from "chokidar";
import { getPathFromProjectRoot } from "./utils/getPathFromProjectRoot.js";
import express from 'express';

buildSass();

const app = express();

const port = 2019;

app.get("/", (req, res) => {
    res.sendFile(getPathFromProjectRoot("/compiled.css"));
});

app.listen(port, () => {});

const watcher = chokidar.watch(getPathFromProjectRoot("/styles"), {
    persistent: true
});

watcher.on("change", (path) => {
    if(path.includes("styles/main")) return;

    console.log("\nUPDATING\n");

    buildSass()
})