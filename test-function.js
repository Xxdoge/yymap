/**
 * 测试Netlify Function配置
 * 这个脚本用于验证函数的基本功能
 */

// 模拟Netlify Function事件
const testEvent = {
    httpMethod: 'GET',
    path: '/.netlify/functions/api-proxy/markers',
    queryStringParameters: null,
    body: null
};

const testContext = {};

// 导入函数
const { handler } = require('./netlify/functions/api-proxy');

// 运行测试
async function testFunction() {
    console.log('🧪 开始测试Netlify Function...');
    
    try {
        const result = await handler(testEvent, testContext);
        
        console.log('✅ 函数执行成功');
        console.log('状态码:', result.statusCode);
        console.log('响应头:', result.headers);
        console.log('响应体长度:', result.body ? result.body.length : 0);
        
        if (result.statusCode === 200) {
            console.log('🎉 测试通过！函数工作正常');
        } else {
            console.log('⚠️ 函数返回了非200状态码');
        }
        
    } catch (error) {
        console.error('❌ 函数执行失败:', error.message);
    }
}

// 运行测试
testFunction();
