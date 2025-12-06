import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import esbuild from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function build(inputDir, outputFile) {
    const htmlPath = path.join(inputDir, "index.html");
    const cssPath = path.join(inputDir, "styles.css");
    const jsPath = path.join(inputDir, "app.js");
    const runtimePath = path.join(__dirname, "lib/runtime.js");

    const html = fs.readFileSync(htmlPath, "utf8");
    const css = fs.readFileSync(cssPath, "utf8");
    const runtimeLib = fs.readFileSync(runtimePath, "utf8");

    // bundle user JS
    const jsBundle = await esbuild.build({
        entryPoints: [jsPath],
        bundle: true,
        minify: true,
        write: false,
    });
    const userJs = jsBundle.outputFiles[0].text;

    // SVG scaffold
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" id="svgApp">
  <foreignObject width="100%" height="100%">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <style><![CDATA[
          ${css}
        ]]></style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  </foreignObject>

  <!-- Starter app data -->
  <script type="application/json" id="dataStore">{}</script>

  <script><![CDATA[
    ${runtimeLib}
    ${userJs}
  ]]></script>
</svg>`;

    fs.writeFileSync(outputFile, svg, "utf8");
    console.log("Built", outputFile);
}

const [, , inputDir = "my-app", outputFile = "app.svg"] = process.argv;
build(inputDir, outputFile).catch(err => {
    console.error(err);
    process.exit(1);
});
