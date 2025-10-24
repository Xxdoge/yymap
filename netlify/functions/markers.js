const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // 允许CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
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
    let options = {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    // 如果是POST请求，添加body
    if (event.httpMethod === 'POST' && event.body) {
      options.body = event.body;
    }

    const response = await fetch(apiUrl, options);
    const data = await response.json();

    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: '请求失败',
        message: error.message 
      })
    };
  }
};