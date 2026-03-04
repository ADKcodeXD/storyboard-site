# Banana Pro 提示词模板（可持续扩图）

## 0) 基准锁定模板（先生成1-2张）
`cinematic interior living room study at night, locked continuity, same two lead characters: Man A back-shoulder foreground, Woman B front-facing subject, Chinese film still, realistic, no text, no watermark, warm practical lamp, film noir contrast, 35mm anamorphic`

## 1) 批量变体模板
`{BASE_LOCKED_PROMPT}, {SHOT_VARIANT}, high detail, shallow depth of field, cinematic color grading`

### 建议变量 SHOT_VARIANT
- over shoulder from Man A to Woman B, medium close-up
- profile two-shot conversation tension
- low angle from coffee table
- frame-within-frame through bookshelf foreground blur
- Woman B emotional close-up, Man A blurred shoulder foreground
- centered symmetry with doorway frame
- wide static composition, characters separated by table

## 2) 建立镜头/空镜（少量）
`cinematic establishing shot, same apartment style, rainy night city outside window, moody practical lights, no characters`

## 3) 失败重试策略
- 串行生成
- 每张间隔 7-10 秒
- 失败重试 3 次
- 命中 429 时等待 20/40/60 秒退避
