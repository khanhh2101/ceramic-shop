const axios = require('axios');

async function test() {
  try {
    const payload = {
      title: 'Test Blog',
      contentHtml: '<p>Test</p>',
      isPublished: true
    };
    
    // We need a token, but wait, without a token we get 401. 
    // We can't easily get a token without logging in.
    console.log("Cannot test without token directly.");
  } catch (err) {
    console.log(err.response ? err.response.data : err.message);
  }
}
test();
