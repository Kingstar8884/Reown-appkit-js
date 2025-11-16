const { exec } = require("child_process");

function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${stderr}`);
        return reject(error);
      }
      console.log(stdout);
      resolve(stdout);
    });
  });
}

async function main() {
  try {
    await run("git add .");
    await run('git commit -m "N/A"');
    await run("git push");
    console.log("Git commands executed successfully!");
  } catch (e) {
    console.error("Failed:", e);
  }
}

main();