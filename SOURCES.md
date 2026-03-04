# SOURCES

## 图像来源
- `public/shots/shot-001.png` ~ `public/shots/shot-040.png`：使用 Gemini 3 Pro Image（Banana Pro）生成。
- `public/shots/shot-041.png` ~ `public/shots/shot-080.png`：基于 001~040 的本地复用拷贝（用于保证 80 条目全部本地托管并可上线展示）。

## 生成方式
- 脚本：`/usr/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py`
- 生成策略：先基准图，再串行批量、间隔与失败重试。
- 详细记录见：`GEN_LOG.md` 与 `docs/PROMPTS.md`
