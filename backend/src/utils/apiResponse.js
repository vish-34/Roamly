function success(data, message = 'Operation completed successfully') {
  return { success: true, data, message };
}

function failure(message, details) {
  return { success: false, data: null, message, error: { message, details } };
}

module.exports = { success, failure };
