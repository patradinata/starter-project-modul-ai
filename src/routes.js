const routes = (handler) => [
  {
    method: "POST",
    path: "/predirect",
    handler: handler.getPredictResult,
    option: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
      },
    },
  },
];

module.exports = routes;
