const fse = require('fs-extra')
const runScript = require("@npmcli/run-script");

const path = require("path");
const readline = require("readline");

const rootDir = path.resolve(__dirname, "..");
const getPath = (...paths) => path.resolve(rootDir, ...paths);
const templateRoot = getPath("_template");
const getTemplatePath = (...paths) => path.resolve(templateRoot, ...paths);

// Template content
const package = getTemplatePath("package.json");
const credentialDir = getTemplatePath("settings");
const typescriptDir = getTemplatePath("typescript");
const javascriptDir = getTemplatePath("javascript");

const utilDir = getTemplatePath("util");

const allTemplate = [
  package,
  credentialDir,
  typescriptDir,
  javascriptDir,
  utilDir,
];

function askQuestion(questionString) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question(questionString, function (res) {
      resolve(res);
      rl.close();
    });
  });
}

async function confirm(questionString) {
  const res = await askQuestion(questionString);
  //   const yes = [
  //     "yes",
  //     "y",
  //     "yy",
  //     "yah",
  //     "sure",
  //     "yep",
  //     "yeah",
  //     1,
  //     "1",
  //     "yeep",
  //     "true",
  //     true,
  //   ];
  const no = [
    "no",
    "n",
    "nn",
    "no",
    "noo",
    "nope",
    "nah",
    0,
    "0",
    "nooo",
    "false",
    false,
    "",
  ];
  const candidate = res ? res.toLowerCase() : false;
  if (no.includes(candidate)) {
    return false;
  } else {
    return true;
  }
}

const runNPMScript = async (folderPath, cmd, args = []) => {
  return new Promise((resolve, reject) => {
    runScript({
        event: cmd,
        args,
        path: folderPath,
        scriptShell: "/bin/bash",
        stdioString: true,
        stdio: "inherit",
        banner: false,
      })
      .then(({
        code,
        signal,
        stdout,
        stderr,
        pkgid,
        path,
        event,
        script
      }) => {
        const payload = {
          code,
          signal,
          stdout,
          stderr,
          pkgid,
          path,
          event,
          script,
        };
        resolve(payload);
      })
      .catch((er) => {
        reject({
          err: er
        });
      });
  });
};

function writeJson(filePath, content) {
  return fse.writeJson(filePath, content);
}

module.exports = {
  askQuestion,
  allTemplate,
  runNPMScript,
  confirm,
  templateDir: templateRoot,
  mkdir: fse.ensureDir,
  copyFile: fse.copy,
  copyDir: fse.copy,
  writeJson
};