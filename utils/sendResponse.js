

module.exports = ({statusCode, body, headers ={} } ) => ({
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      ...headers, // This allows us to override headers, if needed
    },
    statusCode,
    body: JSON.stringify(body),
  });