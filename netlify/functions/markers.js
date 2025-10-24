const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  console.log('🚀 Markers function started');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // 处理预检请求
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // 使用cors-anywhere解决HTTPS请求HTTP的问题
  const corsProxy = 'https://cors-anywhere.herokuapp.com/';
  const originalApiUrl = 'http://124.223.222.214:3000/api/markers';
  const apiUrl = corsProxy + originalApiUrl;
  console.log('🔗 Using CORS proxy:', apiUrl);

  try {
    // 更短的超时时间用于测试
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ Fetch timeout reached');
      controller.abort();
    }, 5000);

    const fetchOptions = {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Netlify-Function/1.0',
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': 'https://yymap.netlify.app'
      },
      signal: controller.signal,
      redirect: 'follow'
    };

    // 添加请求体（如果是POST）
    if (event.httpMethod === 'POST' && event.body) {
      fetchOptions.body = event.body;
      console.log('📦 Request body:', event.body.substring(0, 200));
    }

    console.log('🔄 Starting fetch request...');
    const response = await fetch(apiUrl, fetchOptions);
    clearTimeout(timeoutId);

    console.log('✅ Backend response status:', response.status);
    console.log('📋 Response headers:', JSON.stringify(Object.fromEntries(response.headers)));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Backend error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('🎉 Successfully fetched data, count:', data.length || data.data?.length);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: data,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('💥 Fetch error details:');
    console.error('Name:', error.name);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Stack:', error.stack);

    let statusCode = 502;
    let userMessage = '网络请求失败';

    if (error.name === 'AbortError') {
      statusCode = 504;
      userMessage = '请求超时，服务器响应时间过长';
    } else if (error.message.includes('ECONNREFUSED')) {
      statusCode = 503;
      userMessage = '无法连接到服务器';
    } else if (error.message.includes('ENOTFOUND')) {
      statusCode = 502;
      userMessage = '服务器地址无法解析';
    }

    return {
      statusCode: statusCode,
      headers,
      body: JSON.stringify({
        success: false,
        error: userMessage,
        details: error.message,
        type: error.name,
        url: apiUrl,
        timestamp: new Date().toISOString()
      })
    };
  }
};