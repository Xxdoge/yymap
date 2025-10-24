/**
 * Netlify Function - API代理
 * 用于解决跨域问题，代理前端请求到后端API服务器
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// 后端API服务器配置
const API_BASE_URL = 'http://124.223.222.214:3000';

exports.handler = async (event, context) => {
    // 设置CORS头
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json'
    };

    // 处理OPTIONS预检请求
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // 获取请求路径和方法
        const { httpMethod, path, queryStringParameters, body } = event;
        
        // 构建目标URL
        const targetPath = path.replace('/.netlify/functions/api-proxy', '');
        const targetUrl = `${API_BASE_URL}${targetPath}`;
        
        // 添加查询参数
        const url = new URL(targetUrl);
        if (queryStringParameters) {
            Object.keys(queryStringParameters).forEach(key => {
                url.searchParams.append(key, queryStringParameters[key]);
            });
        }

        console.log(`🔄 代理请求: ${httpMethod} ${url.toString()}`);

        // 准备请求选项
        const requestOptions = {
            method: httpMethod,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Netlify-Proxy/1.0'
            }
        };

        // 如果有请求体，添加到选项中
        if (body && (httpMethod === 'POST' || httpMethod === 'PUT' || httpMethod === 'PATCH')) {
            requestOptions.body = body;
        }

        // 发送请求到后端API
        const response = await makeRequest(url.toString(), requestOptions);
        
        console.log(`✅ 代理响应: ${response.statusCode}`);

        return {
            statusCode: response.statusCode,
            headers: {
                ...headers,
                'Content-Type': response.headers['content-type'] || 'application/json'
            },
            body: response.body
        };

    } catch (error) {
        console.error('❌ 代理请求失败:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: '代理请求失败',
                message: error.message
            })
        };
    }
};

/**
 * 发送HTTP请求的辅助函数
 */
function makeRequest(url, options) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const isHttps = urlObj.protocol === 'https:';
        const httpModule = isHttps ? https : http;
        
        const requestOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: options.method,
            headers: options.headers,
            timeout: 10000 // 10秒超时
        };

        const req = httpModule.request(requestOptions, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('请求超时'));
        });

        // 发送请求体
        if (options.body) {
            req.write(options.body);
        }
        
        req.end();
    });
}
