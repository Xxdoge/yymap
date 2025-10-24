const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // 允许CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Max-Age': '86400'
  };

  // 预检请求处理
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const apiUrl = `http://124.223.222.214:3000/api/markers`;
  
  try {
    console.log(`🔄 代理请求: ${event.httpMethod} ${apiUrl}`);
    
    let options = {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Netlify-Proxy/1.0'
      },
      timeout: 10000 // 10秒超时
    };

    // 如果是POST/PUT请求，添加body
    if ((event.httpMethod === 'POST' || event.httpMethod === 'PUT') && event.body) {
      options.body = event.body;
    }

    const response = await fetch(apiUrl, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log(`✅ 代理响应: ${response.status}`);

    return {
      statusCode: response.status,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('❌ 代理请求失败:', error.message);
    
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