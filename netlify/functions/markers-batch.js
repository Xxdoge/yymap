const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Max-Age': '86400'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // 使用cors-anywhere解决HTTPS请求HTTP的问题
  const corsProxy = 'https://cors-anywhere.herokuapp.com/';
  const originalApiUrl = 'http://124.223.222.214:3000/api/markers/batch';
  const apiUrl = corsProxy + originalApiUrl;
  
  try {
    console.log(`🔄 批量操作请求: ${event.httpMethod} ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Netlify-Function/1.0',
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': 'https://yymap.netlify.app'
      },
      body: event.body,
      timeout: 15000 // 15秒超时，批量操作可能需要更长时间
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log(`✅ 批量操作响应: ${response.status}`);

    return {
      statusCode: response.status,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('❌ 批量操作失败:', error.message);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false,
        error: '批量操作失败',
        message: error.message 
      })
    };
  }
};