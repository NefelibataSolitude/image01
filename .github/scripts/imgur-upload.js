const { execSync } = require("child_process");
const { PicGo } = require("picgo");
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
// 获取 commit 提交后，修改的文件
(async () => {
  try {
    // 获取上一个提交的哈希
    // const lastCommit = execSync("git rev-parse HEAD^1").toString().trim();
    // 获取当前提交的哈希
    const currentCommit = execSync("git rev-parse HEAD").toString().trim();
    console.log(`currentCommit: ${currentCommit}`);
    // 获取文件更改信息
    const changes = execSync(
      `git diff --name-status ${lastCommit} ${currentCommit}`,
      { encoding: "utf-8" }
    ).trim();
    const images = changes.split("\n").map((change) => {
      const [status, filePath, ...other] = change.split("\t");
      // 只处理修改的文件
      if (
        (status === "M" || status === "A") &&
        imageExtensions.some((ext) => filePath.endsWith(ext))
      ) {
        if (/"/g.test(filePath) && /\\/.test(filePath)) {
          const cleanedfilePath = filePath.replace(/"/g, "");
          // 将转义字符转换为实际的字节
          const byteArray = cleanedfilePath
            .split("\\")
            .map((part, index) => {
              if (index === 0) return part; // 第一个部分不需要处理
              if (part.includes(".")) {
                const [num, ...other] = part.split(".");
                return [String.fromCharCode(parseInt(num, 8)), ...other].join(
                  "."
                );
              }
              return String.fromCharCode(parseInt(part, 8)); // 将八进制转为字符
            })
            .join("");
          // 创建 Buffer 并解码为 UTF-8 字符串
          const buffer = Buffer.from(byteArray, "latin1");
          return buffer.toString("utf8");
        }
        return filePath;
      }
    });
    // 执行上传操作
    const picgo = new PicGo();
    picgo.setConfig({
      "picBed.uploader": "imgur",
      "picBed.current": "imgur",
      "picBed.imgur.clientId": process.env.IMGUR_CLIENT_ID,
    });
    if (images.length > 0) {
      await picgo
      .upload(images)
      .then(async (result) => {
        console.log(result);
      })
      .catch((err) => {
        console.error(err);
      });
    }
  } catch (error) {
    console.error(error);
  }
})();