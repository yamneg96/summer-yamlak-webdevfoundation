// State Management
let workingDirectory = ["VCS-GIT.html", "git.css"];
let stagingArea = [];
let commits = [];
let pushedRemote = false;

// DOM Element Selectors
const workingFilesEl = document.getElementById("workingFiles");
const stagedFilesEl = document.getElementById("stagedFiles");
const commitHistoryEl = document.getElementById("commitHistory");
const termOutputEl = document.getElementById("termOutput");

// Buttons
const btnTouch = document.getElementById("btnTouch");
const btnStatus = document.getElementById("btnStatus");
const btnAdd = document.getElementById("btnAdd");
const btnCommit = document.getElementById("btnCommit");
const btnPush = document.getElementById("btnPush");
const btnReset = document.getElementById("btnReset");

// Helper function to log terminal output
function logTerminal(message, type = "prompt") {
  const p = document.createElement("p");
  p.className = `line ${type}`;
  p.textContent = message;
  termOutputEl.appendChild(p);
  termOutputEl.scrollTop = termOutputEl.scrollHeight;
}

// Render Working Directory & Staging Area UI
function render() {
  // Render Working Directory
  workingFilesEl.innerHTML = "";
  if (workingDirectory.length === 0) {
    workingFilesEl.innerHTML = '<li class="empty-msg">Working tree clean.</li>';
  } else {
    workingDirectory.forEach((file) => {
      const li = document.createElement("li");
      li.className = "file-item";
      li.innerHTML = `📄 <span>${file}</span>`;
      workingFilesEl.appendChild(li);
    });
  }

  // Render Staging Area
  stagedFilesEl.innerHTML = "";
  if (stagingArea.length === 0) {
    stagedFilesEl.innerHTML =
      '<li class="empty-msg">No files staged yet...</li>';
  } else {
    stagingArea.forEach((file) => {
      const li = document.createElement("li");
      li.className = "file-item";
      li.innerHTML = `📦 <span>${file}</span>`;
      stagedFilesEl.appendChild(li);
    });
  }
}

// Command 1: touch newfile.js
btnTouch.addEventListener("click", () => {
  const fileNames = ["app.js", "components.js", "script.js", "utils.js"];
  const randomFile = fileNames[Math.floor(Math.random() * fileNames.length)];

  if (
    !workingDirectory.includes(randomFile) &&
    !stagingArea.includes(randomFile)
  ) {
    workingDirectory.push(randomFile);
    logTerminal(
      `$ touch ${randomFile} -> Created new untracked file in Working Directory.`,
    );
    render();
  } else {
    logTerminal(
      `$ touch ${randomFile} -> File already exists in workspace!`,
      "error",
    );
  }
});

// Command 2: git status
btnStatus.addEventListener("click", () => {
  logTerminal(`$ git status`);
  if (workingDirectory.length > 0) {
    logTerminal(
      ` Untracked/Modified files: ${workingDirectory.join(", ")}`,
      "error",
    );
  }
  if (stagingArea.length > 0) {
    logTerminal(
      ` Changes staged for commit: ${stagingArea.join(", ")}`,
      "info",
    );
  }
  if (workingDirectory.length === 0 && stagingArea.length === 0) {
    logTerminal(` Nothing to commit, working tree clean.`, "prompt");
  }
});

// Command 3: git add .
btnAdd.addEventListener("click", () => {
  if (workingDirectory.length === 0) {
    logTerminal(`$ git add . -> Nothing to stage. Working tree clean.`, "info");
    return;
  }

  stagingArea = [...stagingArea, ...workingDirectory];
  logTerminal(
    `$ git add . -> Staged ${workingDirectory.length} file(s) to Staging Area.`,
    "info",
  );
  workingDirectory = [];
  render();
});

// Command 4: git commit -m "update"
btnCommit.addEventListener("click", () => {
  if (stagingArea.length === 0) {
    logTerminal(
      `$ git commit -> Error: No changes staged to commit. Run 'git add' first!`,
      "error",
    );
    return;
  }

  const hash = Math.random().toString(36).substring(2, 7);
  const commitMsg = `Commit #${commits.length + 1} [${stagingArea.join(", ")}]`;

  // Create commit node dynamically with pop animation
  const node = document.createElement("div");
  node.className = "commit-node";
  node.innerHTML = `<span class="commit-hash">${hash}</span> <span class="commit-msg">${commitMsg}</span>`;

  commitHistoryEl.prepend(node);
  commits.push({ hash, files: stagingArea });

  logTerminal(
    `$ git commit -m "${commitMsg}" -> Saved local snapshot [${hash}].`,
  );
  stagingArea = [];
  pushedRemote = false;
  render();
});

// Command 5: git push origin main
btnPush.addEventListener("click", () => {
  if (commits.length === 0) {
    logTerminal(
      `$ git push origin main -> Nothing to push! Create a commit first.`,
      "error",
    );
    return;
  }

  if (pushedRemote) {
    logTerminal(
      `$ git push origin main -> Everything up-to-date on GitHub.`,
      "info",
    );
  } else {
    logTerminal(
      `$ git push origin main -> Pushed ${commits.length} commit snapshot(s) to GitHub! 🚀`,
      "prompt",
    );
    pushedRemote = true;
  }
});

// Command 6: git reset --hard
btnReset.addEventListener("click", () => {
  workingDirectory = ["index.html", "styles.css"];
  stagingArea = [];
  logTerminal(
    `$ git reset --hard -> Reset workspace back to base state!`,
    "error",
  );
  render();
});

// Initial Render
render();
