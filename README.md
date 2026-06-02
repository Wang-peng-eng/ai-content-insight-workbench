# AI内容洞察工作台

一个用于评论区运营分析的纯前端工具。运营人员可以一次粘贴多条评论，系统会自动去空行、去重，并输出高频焦虑、用户画像、内容机会、选题建议和标题建议。

## V1功能

- 评论批量粘贴导入
- 自动去空行、去重
- 原始评论数和去重后评论数统计
- 高频焦虑分析
- 用户画像生成
- 内容机会分析
- 10个选题建议
- 10个标题建议
- 移动端适配

## 技术栈

- React
- Vite
- Tailwind CSS

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 测试

```bash
npm test
```

## GitHub Pages部署

项目使用 Vite 构建到 `docs/` 目录，适合直接通过 GitHub Pages 发布。

```bash
npm run build
git add docs
git commit -m "Build GitHub Pages output"
git push
```

首次使用时，需要在仓库 Settings 中将 Pages Source 设置为 `main` 分支的 `/docs` 目录。

## 说明

V1 不包含登录、注册、数据库、后端、爬虫、平台接口、会员系统或支付系统。所有分析都在浏览器本地完成。
