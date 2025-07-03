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
  var payload;
  try {
    payload = JSON.parse(atob(token.split('.')[1]));
  } catch (e) {}
  if (!payload || payload.exp * 1000 < Date.now()) {
    return { statusCode: 401, statusDescription: 'Unauthorized' };
  }
  return request;
}

exports.handler = handler;
