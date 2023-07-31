const TestController = {
  crash: (req, res, next) => {
    // Simulate a server crash by throwing an error
    throw new Error('Simulated server crash');
  },
};
module.exports = TestController;
