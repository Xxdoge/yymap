# 部署说明 - 修复504错误

## 🚨 问题解决

之前的504 Gateway Timeout错误是因为：
1. `netlify.toml`配置指向不存在的`api-proxy`函数
2. 现在已更新为指向具体的`markers.js`和`markers-batch.js`函数

## 📁 当前文件结构

```
yymap/
├── netlify/
│   └── functions/
│       ├── markers.js          # 处理 /api/markers 请求
│       └── markers-batch.js    # 处理 /api/markers/batch 请求
├── netlify.toml               # 更新的路由配置
├── package.json               # 包含 node-fetch 依赖
└── index.html                 # 主页面
```

## 🔧 修复内容

### 1. 更新了 netlify.toml 路由配置
```toml
[[redirects]]
  from = "/api/markers"
  to = "/.netlify/functions/markers"
  status = 200
  force = true

[[redirects]]
  from = "/api/markers/batch"
  to = "/.netlify/functions/markers-batch"
  status = 200
  force = true
```

### 2. 改进了函数实现
- 添加了更好的错误处理
- 增加了超时设置
- 改进了CORS头配置
- 添加了日志记录

### 3. 确保依赖正确
- `package.json`包含`node-fetch`依赖
- 函数使用正确的require语句

## 🚀 部署步骤

1. **提交更改**：
   ```bash
   git add .
   git commit -m "Fix 504 error: Update Netlify Functions routing"
   git push origin main
   ```

2. **等待Netlify自动部署**：
   - Netlify会自动检测到更改
   - 重新构建和部署函数
   - 通常需要2-3分钟

3. **验证修复**：
   - 访问 `https://yymap.netlify.app/api/markers`
   - 应该返回200状态码而不是504

## 🔍 故障排除

如果仍然遇到问题：

1. **检查Netlify Functions日志**：
   - 在Netlify Dashboard中查看Functions日志
   - 查找错误信息

2. **验证函数部署**：
   - 确认函数文件已正确上传
   - 检查函数名称和路径

3. **测试函数直接访问**：
   - 访问 `https://yymap.netlify.app/.netlify/functions/markers`
   - 应该返回相同的结果

## 📊 预期结果

修复后，API请求应该：
- ✅ 返回200状态码
- ✅ 正确代理到后端API
- ✅ 包含正确的CORS头
- ✅ 返回JSON数据

现在504错误应该已经解决了！
