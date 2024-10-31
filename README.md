# 技术文档网站

这是一个基于 [Docusaurus](https://docusaurus.io/) 构建的现代静态网站生成器，用于创建和维护技术文档、博客以及其他相关内容。

## 目录

- [技术文档网站](#技术文档网站)
  - [目录](#目录)
  - [功能特性](#功能特性)
  - [技术栈](#技术栈)
  - [目录结构](#目录结构)
  - [安装指南](#安装指南)
  - [本地开发](#本地开发)
  - [构建](#构建)
  - [部署](#部署)
    - [使用 SSH 部署](#使用-ssh-部署)
    - [不使用 SSH 部署](#不使用-ssh-部署)
  - [文档编写指南](#文档编写指南)
  - [自定义主题](#自定义主题)
  - [贡献指南](#贡献指南)
  - [许可证](#许可证)
  - [联系方式](#联系方式)

## 功能特性

- 📝 **Markdown 支持**：使用 Markdown 编写内容，方便快捷。
- 🔍 **全文搜索**：内置搜索功能，快速查找所需信息。
- 📱 **响应式设计**：兼容多种设备，确保良好的用户体验。
- 🌙 **主题切换**：支持浅色和深色模式，满足不同用户偏好。
- ⚡️ **快速部署**：支持通过 GitHub Pages 等静态内容托管服务快速部署。

## 技术栈

- [Docusaurus](https://docusaurus.io/): React 驱动的静态网站生成器
- [React](https://reactjs.org/): 用户界面库
- [MDX](https://mdxjs.com/): Markdown 增强，支持嵌入 React 组件
- [Node.js](https://nodejs.org/): JavaScript 运行时
- [Yarn](https://yarnpkg.com/): 包管理工具

## 目录结构

```
my-website/
├── blog/                    # 博客文章
├── docs/                    # 文档
├── src/                     # 源代码
│   ├── components/          # React 组件
│   ├── css/                 # 样式文件
│   └── pages/               # 自定义页面
├── static/                  # 静态资源
├── docusaurus.config.js     # 站点配置
├── sidebars.js              # 侧边栏配置
├── package.json             # 项目依赖和脚本
└── README.md                # 项目说明文件
```

## 安装指南

请确保你已经安装了 [Node.js](https://nodejs.org/) 和 [Yarn](https://yarnpkg.com/)。

1. **克隆仓库**

   ```bash
   git clone https://github.com/你的用户名/你的仓库.git
   cd 你的仓库
   ```

2. **安装依赖**

   ```bash
   yarn
   ```

## 本地开发

启动本地开发服务器并打开浏览器窗口。大多数更改会实时反映，无需重启服务器。

```bash
yarn start
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

## 构建

生成静态内容到 `build` 目录，可以使用任何静态内容托管服务进行部署。

```bash
yarn build
```

## 部署

项目支持两种部署方式：

### 使用 SSH 部署

```bash
USE_SSH=true yarn deploy
```

### 不使用 SSH 部署

```bash
GIT_USER=<你的 GitHub 用户名> yarn deploy
```

如果你使用 GitHub Pages 进行托管，这个命令会构建网站并将内容推送到 `gh-pages` 分支。

## 文档编写指南

1. **创建文档**

   在 `docs/` 目录下创建新的 Markdown 文件。例如，`docs/intro.md`。

2. **配置侧边栏**

   编辑 `sidebars.js` 以添加新的文档到侧边栏。

   ```javascript
   module.exports = {
     sidebar: [
       {
         type: "category",
         label: "文档",
         items: ["intro", "getting-started", "advanced"],
       },
     ],
   };
   ```

3. **自定义页面**

   在 `src/pages/` 目录下创建自定义页面。例如，`src/pages/about.js`。

## 自定义主题

1. **修改样式**

   编辑 `src/css/custom.css` 自定义站点样式。

2. **配置主题选项**

   在 `docusaurus.config.js` 中配置主题相关选项，如导航栏、页脚等。

   ```javascript
   themeConfig: {
     navbar: {
       title: '技术文档',
       items: [
         { to: '/docs/intro', label: '文档', position: 'left' },
         { to: '/blog', label: '博客', position: 'left' },
         { href: 'https://github.com/你的用户名/你的仓库', label: 'GitHub', position: 'right' },
       ],
     },
     footer: {
       style: 'dark',
       links: [
         {
           title: '文档',
           items: [
             { label: '介绍', to: '/docs/intro' },
             { label: '快速开始', to: '/docs/getting-started' },
           ],
         },
         {
           title: '社区',
           items: [
             { label: 'Stack Overflow', href: 'https://stackoverflow.com/questions/tagged/docusaurus' },
             { label: 'Discord', href: 'https://discordapp.com/invite/docusaurus' },
           ],
         },
         {
           title: '更多',
           items: [
             { label: '博客', to: '/blog' },
             { label: 'GitHub', href: 'https://github.com/你的用户名/你的仓库' },
           ],
         },
       ],
       copyright: `Copyright © ${new Date().getFullYear()} 你的名字.`,
     },
   },
   ```

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

1. **提交 Issue**

   如果你发现了问题或有新的功能建议，请提交一个 Issue。

2. **提交 Pull Request**

   1. Fork 本仓库
   2. 创建新分支 `git checkout -b feature/你的功能`
   3. 提交更改 `git commit -m '添加了新的功能'`
   4. 推送分支 `git push origin feature/你的功能`
   5. 创建 Pull Request

请确保你的代码遵循项目的代码规范，并通过所有测试。

## 许可证

本项目使用 [MIT 许可证](LICENSE)。

## 联系方式

如有任何问题或建议，请通过以下方式联系我：

- **邮箱**: your.email@example.com
- **GitHub**: [https://github.com/你的用户名](https://github.com/你的用户名)
