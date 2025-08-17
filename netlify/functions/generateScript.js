exports.handler = async (event) => {
  console.log("Function is running!");

  return {
    statusCode: 200,
    body: JSON.stringify({ script: "TEST SUCCESS: Function triggered." }),
  };
};