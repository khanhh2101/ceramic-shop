const { URLSearchParams } = require('url');
const fn = (prev) => { return new URLSearchParams(); };
try {
  const params = new URLSearchParams(fn);
  console.log("Success?", params.toString());
} catch(e) {
  console.log("Error:", e.message);
}
