function success(data, message = 'Operation completed successfully') {
  return { success: true, data, message };
}

function failure(message, details) {
  return { success: false, error: { message, details } };
}

module.exports = { success, failure };
