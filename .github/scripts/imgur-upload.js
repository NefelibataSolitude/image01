const { execSync } = require("child_process");
const { PicGo } = require("picgo");
const fs = require('fs');
// 读取 GitHub 事件信息
const eventPath = process.env.GITHUB_EVENT_PATH;
const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf-8'));
const imageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".tiff",
  ".tif",
  ".webp",
  ".svg",
  ".heif",
  ".heic",
];
// 存储变更的文件
const changedFiles = [];

// 从 commits 中获取所有的变更文件
eventData.commits.forEach(commit => {
  changedFiles.push(...commit.added, ...commit.modified);
});
console.log(changedFiles);)
// 获取 commit 提交后，修改的文件
