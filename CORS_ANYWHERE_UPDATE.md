# CORS-Anywhere 代理更新

## 🔧 修改内容

已更新Netlify Functions以使用cors-anywhere代理来解决HTTPS请求HTTP的问题。

### 修改的文件

1. **`netlify/functions/markers.js`**
2. **`netlify/functions/markers-batch.js`**

### 主要变更

#### 1. 使用CORS代理URL
```javascript
// 之前
const apiUrl = `http://124.223.222.214:3000/api/markers`;

// 现在
const corsProxy = 'https://cors-anywhere.herokuapp.com/';
const originalApiUrl = 'http://124.223.222.214:3000/api/markers';
const apiUrl = corsProxy + originalApiUrl;
```

#### 2. 添加必要的请求头
```javascript
headers: {
  'Content-Type': 'application/json',
  'User-Agent': 'Netlify-Function/1.0',
  'X-Requested-With': 'XMLHttpRequest',
  'Origin': 'https://yymap.netlify.app'
}
```

## 🎯 解决的问题

- ✅ **HTTPS请求HTTP**：通过cors-anywhere代理解决Mixed Content问题
- ✅ **跨域限制**：cors-anywhere自动处理CORS头
- ✅ **协议兼容**：Netlify Functions (HTTPS) → CORS代理 (HTTPS) → 后端API (HTTP)

## ⚠️ 重要提醒

### CORS-Anywhere使用限制

1. **需要请求访问权限**：
   - 首次使用需要访问：https://cors-anywhere.herokuapp.com/corsdemo
   - 点击"Request temporary access to the demo server"

2. **服务限制**：
   - 这是公共演示服务，仅用于开发目的
   - 可能有请求频率限制
   - 服务可能不稳定或随时停止

3. **生产环境建议**：
   - 考虑部署自己的cors-anywhere实例
   - 或者使用其他代理服务
   - 或者配置后端API支持HTTPS

## 🚀 部署步骤

1. **提交更改**：
   ```bash
   git add .
   git commit -m "Update Netlify Functions to use CORS-Anywhere proxy"
   git push origin main
   ```

2. **等待Netlify部署**（2-3分钟）

3. **请求CORS-Anywhere访问权限**：
   - 访问：https://cors-anywhere.herokuapp.com/corsdemo
   - 点击"Request temporary access to the demo server"

4. **测试API**：
   - 访问：https://yymap.netlify.app/api/markers
   - 应该返回200状态码

## 🔍 故障排除

### 如果仍然遇到问题：

1. **检查CORS-Anywhere访问权限**：
   - 确保已请求并获得了访问权限
   - 访问权限有时效性

2. **查看Netlify Functions日志**：
   - 在Netlify Dashboard中查看函数执行日志
   - 查找错误信息

3. **备用方案**：
   - 如果cors-anywhere不可用，可以回退到直接请求
   - 或者部署自己的代理服务

## 📊 预期结果

修改后，API请求应该：
- ✅ 通过cors-anywhere代理成功请求HTTP后端
- ✅ 返回正确的CORS头
- ✅ 解决Mixed Content问题
- ✅ 正常返回JSON数据

这个方案解决了HTTPS环境请求HTTP API的问题！
