#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");
const crypto = require("crypto");

const GITHUB_USERNAME = "sainsw";
const AVATAR_SIZE = 400;
const OUTPUT_DIR = path.join(__dirname, "..", "public", "images", "home");
const TEMP_PATH = path.join(OUTPUT_DIR, "avatar-temp.png");
const VERSION_FILE_PATH = path.join(__dirname, "..", "src", "lib", "version.ts");

const ensureOutputDir = () => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
};

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }
        response.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
  });
}

async function generateContentHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(content).digest("hex").substring(0, 8);
}

async function updateVersionFile(avatarHash) {
  try {
    let versionContent = "";
    if (fs.existsSync(VERSION_FILE_PATH)) {
      versionContent = fs.readFileSync(VERSION_FILE_PATH, "utf8");
    }
    if (versionContent.includes("AVATAR_VERSION")) {
      versionContent = versionContent.replace(/AVATAR_VERSION = ['\"]([^'\"]+)['\"];/, `AVATAR_VERSION = '${avatarHash}';`);
    } else {
      if (versionContent.trim().length > 0) {
        versionContent += "\n";
      }
      versionContent += `export const AVATAR_VERSION = '${avatarHash}';\n`;
    }
    fs.writeFileSync(VERSION_FILE_PATH, versionContent);
    console.log(`✅ Avatar version updated: ${avatarHash}`);
  } catch (error) {
    console.log(`⚠️  Failed to update version file: ${error.message}`);
  }
}

async function getExistingAvatarHash() {
  const files = fs.readdirSync(OUTPUT_DIR);
  const avatarFiles = files.filter(
    (file) => file.startsWith("avatar") && (file.endsWith(".jpg") || file.endsWith(".webp")),
  );

  if (avatarFiles.length > 0) {
    const preferredFile = avatarFiles.find((f) => f.endsWith(".jpg")) || avatarFiles[0];
    const filePath = path.join(OUTPUT_DIR, preferredFile);
    console.log(`🔍 Found existing avatar: ${preferredFile}`);
    return await generateContentHash(filePath);
  }

  return "fallback";
}

async function createVersionedFromExisting(hash) {
  const files = fs.readdirSync(OUTPUT_DIR);
  const avatarFiles = files.filter(
    (file) => file.startsWith("avatar") && (file.endsWith(".jpg") || file.endsWith(".webp")),
  );

  const sourceJpg = avatarFiles.find((f) => f.endsWith(".jpg"));
  const sourceWebp = avatarFiles.find((f) => f.endsWith(".webp"));

  const versionedJpg = path.join(OUTPUT_DIR, `avatar-${hash}.jpg`);
  const versionedWebp = path.join(OUTPUT_DIR, `avatar-${hash}.webp`);

  if (sourceJpg && !fs.existsSync(versionedJpg)) {
    fs.copyFileSync(path.join(OUTPUT_DIR, sourceJpg), versionedJpg);
    console.log(`📋 Created versioned JPG: avatar-${hash}.jpg`);
  }

  if (sourceWebp && !fs.existsSync(versionedWebp)) {
    fs.copyFileSync(path.join(OUTPUT_DIR, sourceWebp), versionedWebp);
    console.log(`📋 Created versioned WebP: avatar-${hash}.webp`);
  }
}

async function convertWithSharp(inputPath) {
  try {
    const sharp = require("sharp");

    const tempHash = await generateContentHash(inputPath);
    const TEMP_WEBP_PATH = path.join(OUTPUT_DIR, `avatar-temp-${tempHash}.webp`);
    const TEMP_JPG_PATH = path.join(OUTPUT_DIR, `avatar-temp-${tempHash}.jpg`);

    await sharp(inputPath)
      .resize(200, 200, { fit: "cover", position: "center" })
      .webp({ quality: 85, effort: 6 })
      .toFile(TEMP_WEBP_PATH);

    await sharp(inputPath)
      .resize(200, 200, { fit: "cover", position: "center" })
      .jpeg({ quality: 90, progressive: true })
      .toFile(TEMP_JPG_PATH);

    const finalHash = await generateContentHash(TEMP_JPG_PATH);
    const FINAL_WEBP_PATH = path.join(OUTPUT_DIR, `avatar-${finalHash}.webp`);
    const FINAL_JPG_PATH = path.join(OUTPUT_DIR, `avatar-${finalHash}.jpg`);

    fs.renameSync(TEMP_WEBP_PATH, FINAL_WEBP_PATH);
    fs.renameSync(TEMP_JPG_PATH, FINAL_JPG_PATH);

    console.log("✅ WebP and JPG optimization complete");
    return { success: true, hash: finalHash, webpPath: FINAL_WEBP_PATH, jpgPath: FINAL_JPG_PATH };
  } catch (error) {
    console.log(`ℹ️  Sharp not available (${error.message}), keeping existing avatar files`);
    throw error;
  }
}

async function fetchGitHubAvatar() {
  ensureOutputDir();
  try {
    console.log(`📡 Fetching GitHub user data for: ${GITHUB_USERNAME}`);
    const userData = await new Promise((resolve, reject) => {
      const options = {
        hostname: "api.github.com",
        path: `/users/${GITHUB_USERNAME}`,
        headers: { "User-Agent": "burnrate-avatar-fetcher" },
      };
      https
        .get(options, (res) => {
          if (res.statusCode !== 200) {
            reject(new Error(`GitHub API returned ${res.statusCode}`));
            return;
          }
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(new Error("Invalid JSON response"));
            }
          });
        })
        .on("error", reject);
    });

    if (!userData.avatar_url) {
      throw new Error("No avatar_url in response");
    }

    const avatarUrl = `${userData.avatar_url}&s=${AVATAR_SIZE}`;
    console.log(`📥 Downloading from: ${avatarUrl}`);

    await downloadImage(avatarUrl, TEMP_PATH);
    const result = await convertWithSharp(TEMP_PATH);
    fs.unlinkSync(TEMP_PATH);

    console.log("🎉 Avatar updated successfully!");
    if (result.success) {
      console.log(`📁 WebP: ${path.relative(process.cwd(), result.webpPath)}`);
      console.log(`📁 JPG: ${path.relative(process.cwd(), result.jpgPath)}`);
    }
    console.log(`🔑 Avatar hash: ${result.hash}`);
    await updateVersionFile(result.hash);
  } catch (error) {
    console.log("ℹ️  Avatar fetch failed, using existing files");
    console.log(`   Reason: ${error.message}`);
    if (fs.existsSync(TEMP_PATH)) {
      fs.unlinkSync(TEMP_PATH);
    }
    const existingHash = await getExistingAvatarHash();
    if (existingHash !== "fallback") {
      console.log(`📁 Using existing avatar files in: ${path.relative(process.cwd(), OUTPUT_DIR)}`);
      console.log(`🔑 Existing avatar hash: ${existingHash}`);
      const versionedWebp = path.join(OUTPUT_DIR, `avatar-${existingHash}.webp`);
      const versionedJpg = path.join(OUTPUT_DIR, `avatar-${existingHash}.jpg`);
      if (!fs.existsSync(versionedWebp) || !fs.existsSync(versionedJpg)) {
        console.log("🔄 Creating versioned files from existing avatars...");
        await createVersionedFromExisting(existingHash);
      }
      await updateVersionFile(existingHash);
    } else {
      console.error("💥 No avatar files found! Please ensure avatar files exist in public/images/home/");
      process.exit(1);
    }
  }
}

fetchGitHubAvatar();
