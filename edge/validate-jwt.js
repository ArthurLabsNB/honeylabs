function handler(event) {
  var request = event.request;
  var token = request.cookies['hl_session'];
  if (!token) {
    return { statusCode: 401, statusDescription: 'Unauthorized' };
  }
  // basic signature check, real verification in backend
  var header = token.split('.')[0];
  if (!header) {
    return { statusCode: 401, statusDescription: 'Unauthorized' };
  }
  return request;
}

exports.handler = handler;
