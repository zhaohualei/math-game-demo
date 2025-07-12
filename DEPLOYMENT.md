# Vercel 部署指南

## 🚀 部署到 Vercel（免费）

### 方法一：通过 Vercel CLI（推荐）

1. **全局安装 Vercel CLI**：
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**：
   ```bash
   vercel login
   ```

3. **部署项目**：
   ```bash
   # 首次部署
   vercel
   
   # 或者直接生产环境部署
   npm run deploy
   ```

4. **按照提示操作**：
   - 选择项目设置
   - 确认构建设置
   - 获取部署链接

### 方法二：通过 Vercel Dashboard

1. **访问 [Vercel Dashboard](https://vercel.com/dashboard)**

2. **连接 GitHub 仓库**：
   - 点击 "New Project"
   - 选择 "Import Git Repository"
   - 连接您的 GitHub 账户
   - 选择这个项目仓库

3. **配置部署设置**：
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **点击 Deploy**

### 📁 项目结构

```
math-game-demo/
├── src/              # 源代码
├── dist/             # 构建输出
├── package.json      # 项目配置
├── vite.config.js    # Vite 配置
├── vercel.json       # Vercel 配置
└── index.html        # 入口文件
```

### 🔧 配置文件说明

- `vercel.json`: 配置了静态构建和路由规则
- `vite.config.js`: Vite 构建配置
- `package.json`: 包含了 `deploy` 脚本

### 🌐 部署后访问

部署成功后，您会获得：
- 生产环境 URL: `https://your-project-name.vercel.app`
- 每次推送自动部署
- 免费的 HTTPS 证书
- 全球 CDN 加速

### 💡 提示

1. 确保所有依赖都在 `package.json` 中正确声明
2. 推送代码到 GitHub 后，Vercel 会自动重新部署
3. 可以在 Vercel Dashboard 查看部署日志和状态
4. 支持自定义域名（可选）

### 🛠️ 本地测试

在部署前，建议先本地测试：

```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview
``` 