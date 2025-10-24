# Netlify Functions 跨域解决方案

## 🎯 解决方案概述

使用Netlify Functions作为代理服务器来解决跨域问题，这是最可靠和安全的解决方案。

## 📁 文件结构

```
yymap/
├── netlify/
│   └── functions/
│       └── api-proxy.js          # API代理函数
├── netlify.toml                  # Netlify配置
├── package.json                  # 项目依赖
└── index.html                    # 主页面
```

## 🔧 工作原理

1. **前端请求**：前端发送请求到 `/api/*`
2. **Netlify重定向**：Netlify将请求重定向到 `/.netlify/functions/api-proxy`
3. **函数代理**：Netlify Function接收请求并转发到后端API服务器
4. **响应返回**：函数将后端响应返回给前端

## 🚀 部署步骤

### 1. 本地测试

```bash
# 安装Netlify CLI
npm install -g netlify-cli

# 本地启动开发服务器
netlify dev
```

### 2. 部署到Netlify

```bash
# 部署到生产环境
netlify deploy --prod
```

或者通过GitHub自动部署：
1. 将代码推送到GitHub仓库
2. 在Netlify中连接GitHub仓库
3. 设置构建命令：`echo "No build required"`
4. 设置发布目录：`.`

## 🔍 配置说明

### netlify.toml

```toml
[build]
  publish = "."
  functions = "netlify/functions"

# 使用Netlify Functions代理API请求
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api-proxy"
  status = 200
  force = true
```

### API代理函数

- **文件位置**：`netlify/functions/api-proxy.js`
- **功能**：代理所有API请求到后端服务器
- **CORS处理**：自动添加CORS头
- **错误处理**：统一的错误响应格式

## 🎯 优势

1. **完全解决跨域问题**：服务器端代理，无跨域限制
2. **安全性高**：后端API地址不暴露给前端
3. **性能好**：Netlify CDN加速
4. **可靠性强**：Netlify基础设施保障
5. **易于维护**：配置简单，逻辑清晰

## 🔧 自定义配置

### 修改后端API地址

在 `netlify/functions/api-proxy.js` 中修改：

```javascript
const API_BASE_URL = 'http://your-api-server.com:port';
```

### 添加认证

可以在函数中添加API密钥或认证逻辑：

```javascript
// 在函数开头添加
const API_KEY = process.env.API_KEY;

// 在请求头中添加
requestOptions.headers['Authorization'] = `Bearer ${API_KEY}`;
```

## 🐛 故障排除

### 常见问题

1. **函数超时**：检查后端API响应时间
2. **CORS错误**：确认函数正确设置了CORS头
3. **404错误**：检查重定向规则配置

### 调试方法

1. 查看Netlify Functions日志
2. 使用 `netlify dev` 本地调试
3. 检查浏览器网络面板

## 📊 监控

- Netlify Dashboard 查看函数调用统计
- 函数日志监控错误和性能
- 后端API服务器监控

## 🔄 更新流程

1. 修改 `netlify/functions/api-proxy.js`
2. 提交代码到Git仓库
3. Netlify自动部署更新

这个解决方案完全解决了跨域问题，同时提供了更好的安全性和性能！
